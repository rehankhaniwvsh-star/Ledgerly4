import { Request, Response, NextFunction } from "express";

/**
 * Rate Limiter Configuration Interface
 * All thresholds are fully configurable via environment variables or runtime configuration.
 */
export interface RateLimitConfig {
  // 1. Moderate limits for public endpoints
  public: {
    windowMs: number;
    maxRequests: number;
  };
  // 2. Looser limits for authenticated user actions
  authenticatedUser: {
    windowMs: number;
    maxRequests: number;
  };
  // 3. Stricter limits for authentication routes (per-IP + per-account + exponential backoff)
  authRoutes: {
    ipWindowMs: number;
    ipMaxRequests: number;
    accountMaxAttempts: number;
    baseBackoffMs: number;
    maxBackoffMs: number;
    backoffFactor: number;
    failureDecayMs: number;
  };
}

/**
 * State store for IP and Account tracking
 */
interface RequestRecord {
  timestamps: number[];
}

interface AuthFailureRecord {
  consecutiveFailures: number;
  lastFailureTime: number;
  nextAllowedTime: number;
  currentBackoffMs: number;
}

class RateLimiterService {
  private config: RateLimitConfig;
  private ipStore = new Map<string, RequestRecord>();
  private authUserStore = new Map<string, RequestRecord>();
  private authIpFailureStore = new Map<string, AuthFailureRecord>();
  private authAccountFailureStore = new Map<string, AuthFailureRecord>();

  // Diagnostic Metrics
  private metrics = {
    totalRequestsChecked: 0,
    totalThrottled: 0,
    throttledAuthIp: 0,
    throttledAuthAccount: 0,
    throttledPublic: 0,
    throttledAuthUser: 0,
    startTime: Date.now(),
  };

  constructor() {
    this.config = this.loadConfig();

    // Periodic cleanup of stale records every 5 minutes to prevent memory leaks
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Load configurations dynamically from environment variables with robust defaults
   */
  private loadConfig(): RateLimitConfig {
    return {
      public: {
        windowMs: parseInt(process.env.RATE_LIMIT_PUBLIC_WINDOW_MS || "60000", 10), // 1 minute
        maxRequests: parseInt(process.env.RATE_LIMIT_PUBLIC_MAX || "100", 10), // 100 reqs/min
      },
      authenticatedUser: {
        windowMs: parseInt(process.env.RATE_LIMIT_AUTH_USER_WINDOW_MS || "60000", 10), // 1 minute
        maxRequests: parseInt(process.env.RATE_LIMIT_AUTH_USER_MAX || "300", 10), // 300 reqs/min
      },
      authRoutes: {
        ipWindowMs: parseInt(process.env.RATE_LIMIT_AUTH_IP_WINDOW_MS || "900000", 10), // 15 minutes
        ipMaxRequests: parseInt(process.env.RATE_LIMIT_AUTH_IP_MAX || "20", 10), // 20 attempts/15min
        accountMaxAttempts: parseInt(process.env.RATE_LIMIT_AUTH_ACCOUNT_MAX_ATTEMPTS || "5", 10), // 5 attempts before backoff
        baseBackoffMs: parseInt(process.env.RATE_LIMIT_AUTH_BASE_BACKOFF_MS || "1000", 10), // 1s initial delay
        maxBackoffMs: parseInt(process.env.RATE_LIMIT_AUTH_MAX_BACKOFF_MS || "300000", 10), // 5 minutes max delay
        backoffFactor: parseFloat(process.env.RATE_LIMIT_AUTH_BACKOFF_FACTOR || "2"), // Exponential base (2^n)
        failureDecayMs: parseInt(process.env.RATE_LIMIT_AUTH_DECAY_MS || "1800000", 10), // 30 minutes without error resets streak
      },
    };
  }

  /**
   * Get current configuration
   */
  public getConfig(): RateLimitConfig {
    return { ...this.config };
  }

  /**
   * Update configuration thresholds dynamically at runtime
   */
  public updateConfig(newConfig: Partial<RateLimitConfig>): RateLimitConfig {
    if (newConfig.public) {
      this.config.public = { ...this.config.public, ...newConfig.public };
    }
    if (newConfig.authenticatedUser) {
      this.config.authenticatedUser = { ...this.config.authenticatedUser, ...newConfig.authenticatedUser };
    }
    if (newConfig.authRoutes) {
      this.config.authRoutes = { ...this.config.authRoutes, ...newConfig.authRoutes };
    }
    return this.getConfig();
  }

  /**
   * Reset all rate-limiting memory stores and metrics
   */
  public resetStores(): void {
    this.ipStore.clear();
    this.authUserStore.clear();
    this.authIpFailureStore.clear();
    this.authAccountFailureStore.clear();
  }

  /**
   * Get metrics and health status
   */
  public getMetrics() {
    return {
      ...this.metrics,
      activePublicTracked: this.ipStore.size,
      activeAuthUsersTracked: this.authUserStore.size,
      activeAuthIpBackoffs: this.authIpFailureStore.size,
      activeAuthAccountBackoffs: this.authAccountFailureStore.size,
      uptimeSeconds: Math.floor((Date.now() - this.metrics.startTime) / 1000),
      config: this.config,
    };
  }

  /**
   * Helper to extract client IP address safely behind reverse proxies
   */
  public getClientIp(req: Request): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }
    if (Array.isArray(forwarded) && forwarded.length > 0) {
      return forwarded[0].trim();
    }
    return req.ip || req.socket.remoteAddress || "127.0.0.1";
  }

  /**
   * Helper to extract account identifier (email, username, or login handle)
   */
  public getAccountIdentifier(req: Request): string | null {
    const body = req.body || {};
    const rawId = body.email || body.username || body.account || body.identifier || req.query.email || req.query.username;
    if (typeof rawId === "string" && rawId.trim()) {
      return rawId.trim().toLowerCase();
    }
    return null;
  }

  /**
   * Calculate exponential backoff duration based on consecutive failures
   */
  private calculateBackoffDelay(consecutiveFailures: number): number {
    const { accountMaxAttempts, baseBackoffMs, maxBackoffMs, backoffFactor } = this.config.authRoutes;
    if (consecutiveFailures <= accountMaxAttempts) {
      return 0; // Allowed without exponential backoff
    }
    const excessAttempts = consecutiveFailures - accountMaxAttempts;
    // Exponential formula: delay = baseBackoffMs * (backoffFactor ^ (excessAttempts - 1))
    const delay = baseBackoffMs * Math.pow(backoffFactor, excessAttempts - 1);
    return Math.min(Math.round(delay), maxBackoffMs);
  }

  /**
   * Record a successful authentication attempt (clears backoff penalty)
   */
  public recordAuthSuccess(req: Request): void {
    const ip = this.getClientIp(req);
    const account = this.getAccountIdentifier(req);

    if (ip) {
      this.authIpFailureStore.delete(ip);
    }
    if (account) {
      this.authAccountFailureStore.delete(account);
    }
  }

  /**
   * Record a failed authentication attempt (increments failure streak and calculates exponential backoff)
   */
  public recordAuthFailure(req: Request): {
    consecutiveFailures: number;
    backoffDelayMs: number;
    nextAllowedTime: number;
    scope: "account" | "ip";
  } {
    const now = Date.now();
    const ip = this.getClientIp(req);
    const account = this.getAccountIdentifier(req);

    // Track per-account failure if account provided
    let accountRecord = account ? this.authAccountFailureStore.get(account) : null;
    let newAccountFailures = 1;

    if (accountRecord) {
      // If decay time passed, reset streak
      if (now - accountRecord.lastFailureTime > this.config.authRoutes.failureDecayMs) {
        newAccountFailures = 1;
      } else {
        newAccountFailures = accountRecord.consecutiveFailures + 1;
      }
    }

    const accountBackoffMs = this.calculateBackoffDelay(newAccountFailures);
    if (account) {
      this.authAccountFailureStore.set(account, {
        consecutiveFailures: newAccountFailures,
        lastFailureTime: now,
        nextAllowedTime: now + accountBackoffMs,
        currentBackoffMs: accountBackoffMs,
      });
    }

    // Track per-IP failure
    let ipRecord = this.authIpFailureStore.get(ip);
    let newIpFailures = 1;
    if (ipRecord) {
      if (now - ipRecord.lastFailureTime > this.config.authRoutes.failureDecayMs) {
        newIpFailures = 1;
      } else {
        newIpFailures = ipRecord.consecutiveFailures + 1;
      }
    }
    const ipBackoffMs = this.calculateBackoffDelay(newIpFailures);
    this.authIpFailureStore.set(ip, {
      consecutiveFailures: newIpFailures,
      lastFailureTime: now,
      nextAllowedTime: now + ipBackoffMs,
      currentBackoffMs: ipBackoffMs,
    });

    if (account && accountBackoffMs > ipBackoffMs) {
      return {
        consecutiveFailures: newAccountFailures,
        backoffDelayMs: accountBackoffMs,
        nextAllowedTime: now + accountBackoffMs,
        scope: "account",
      };
    }

    return {
      consecutiveFailures: newIpFailures,
      backoffDelayMs: ipBackoffMs,
      nextAllowedTime: now + ipBackoffMs,
      scope: "ip",
    };
  }

  /**
   * Check Auth Route Rate Limits (Combination of Per-IP, Per-Account, and Exponential Backoff)
   */
  public checkAuthRateLimit(req: Request): {
    allowed: boolean;
    retryAfterSeconds?: number;
    backoffDelayMs?: number;
    scope?: "account" | "ip";
    consecutiveFailures?: number;
    limit: number;
    remaining: number;
    resetTimestamp: number;
    errorReason?: string;
  } {
    const now = Date.now();
    const ip = this.getClientIp(req);
    const account = this.getAccountIdentifier(req);
    const { ipWindowMs, ipMaxRequests, accountMaxAttempts } = this.config.authRoutes;

    // 1. Check Per-Account Exponential Backoff
    if (account) {
      const accountRecord = this.authAccountFailureStore.get(account);
      if (accountRecord && now < accountRecord.nextAllowedTime) {
        const remainingMs = accountRecord.nextAllowedTime - now;
        const retryAfterSeconds = Math.max(1, Math.ceil(remainingMs / 1000));
        return {
          allowed: false,
          retryAfterSeconds,
          backoffDelayMs: accountRecord.currentBackoffMs,
          scope: "account",
          consecutiveFailures: accountRecord.consecutiveFailures,
          limit: accountMaxAttempts,
          remaining: 0,
          resetTimestamp: accountRecord.nextAllowedTime,
          errorReason: `Too many failed attempts for account '${account}'. Exponential backoff active. Please wait ${retryAfterSeconds}s before trying again.`,
        };
      }
    }

    // 2. Check Per-IP Exponential Backoff
    const ipBackoffRecord = this.authIpFailureStore.get(ip);
    if (ipBackoffRecord && now < ipBackoffRecord.nextAllowedTime) {
      const remainingMs = ipBackoffRecord.nextAllowedTime - now;
      const retryAfterSeconds = Math.max(1, Math.ceil(remainingMs / 1000));
      return {
        allowed: false,
        retryAfterSeconds,
        backoffDelayMs: ipBackoffRecord.currentBackoffMs,
        scope: "ip",
        consecutiveFailures: ipBackoffRecord.consecutiveFailures,
        limit: ipMaxRequests,
        remaining: 0,
        resetTimestamp: ipBackoffRecord.nextAllowedTime,
        errorReason: `Too many failed attempts from your IP. Exponential backoff active. Please wait ${retryAfterSeconds}s before trying again.`,
      };
    }

    // 3. Check Overall Per-IP Sliding Window for auth routes
    let ipRecord = this.ipStore.get(`auth:${ip}`);
    if (!ipRecord) {
      ipRecord = { timestamps: [] };
      this.ipStore.set(`auth:${ip}`, ipRecord);
    }
    // Filter timestamps within window
    ipRecord.timestamps = ipRecord.timestamps.filter((t) => now - t < ipWindowMs);

    if (ipRecord.timestamps.length >= ipMaxRequests) {
      const oldest = ipRecord.timestamps[0];
      const resetTime = oldest + ipWindowMs;
      const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));
      return {
        allowed: false,
        retryAfterSeconds,
        scope: "ip",
        limit: ipMaxRequests,
        remaining: 0,
        resetTimestamp: resetTime,
        errorReason: `Auth request limit exceeded for your IP (${ipMaxRequests} requests per ${Math.round(ipWindowMs / 60000)} mins).`,
      };
    }

    // Allow and record timestamp
    ipRecord.timestamps.push(now);
    const remaining = Math.max(0, ipMaxRequests - ipRecord.timestamps.length);
    const resetTimestamp = now + ipWindowMs;

    return {
      allowed: true,
      limit: ipMaxRequests,
      remaining,
      resetTimestamp,
    };
  }

  /**
   * Middleware for Stricter Auth Routes (e.g. login, signup, password reset, admin PIN verify)
   */
  public authRateLimiterMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      this.metrics.totalRequestsChecked++;
      const result = this.checkAuthRateLimit(req);

      // Set standard RFC-6585 and draft IETF RateLimit headers
      res.setHeader("X-RateLimit-Limit", result.limit);
      res.setHeader("X-RateLimit-Remaining", result.remaining);
      res.setHeader("X-RateLimit-Reset", Math.ceil(result.resetTimestamp / 1000));
      res.setHeader("X-RateLimit-Policy", `auth;ip_limit=${this.config.authRoutes.ipMaxRequests};account_limit=${this.config.authRoutes.accountMaxAttempts};backoff_factor=${this.config.authRoutes.backoffFactor}`);

      if (!result.allowed) {
        this.metrics.totalThrottled++;
        if (result.scope === "account") {
          this.metrics.throttledAuthAccount++;
        } else {
          this.metrics.throttledAuthIp++;
        }

        if (result.retryAfterSeconds) {
          res.setHeader("Retry-After", result.retryAfterSeconds);
          res.setHeader("X-RateLimit-Backoff-Delay-Ms", result.backoffDelayMs || result.retryAfterSeconds * 1000);
        }

        return res.status(429).json({
          success: false,
          error: result.errorReason || "Too many authentication attempts. Please wait before retrying.",
          code: "RATE_LIMIT_AUTH_EXCEEDED",
          scope: result.scope || "ip",
          retryAfterSeconds: result.retryAfterSeconds || 1,
          backoffDelayMs: result.backoffDelayMs || (result.retryAfterSeconds ? result.retryAfterSeconds * 1000 : 1000),
          consecutiveFailures: result.consecutiveFailures || 0,
          resetTimestamp: result.resetTimestamp,
        });
      }

      next();
    };
  }

  /**
   * Middleware for Moderate Public Endpoints (e.g. sitemaps, robots.txt, health, public generation)
   */
  public publicRateLimiterMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      this.metrics.totalRequestsChecked++;
      const now = Date.now();
      const ip = this.getClientIp(req);
      const { windowMs, maxRequests } = this.config.public;

      let record = this.ipStore.get(`pub:${ip}`);
      if (!record) {
        record = { timestamps: [] };
        this.ipStore.set(`pub:${ip}`, record);
      }

      record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

      const remaining = Math.max(0, maxRequests - record.timestamps.length);
      const oldest = record.timestamps.length > 0 ? record.timestamps[0] : now;
      const resetTime = oldest + windowMs;

      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", Math.ceil(resetTime / 1000));
      res.setHeader("X-RateLimit-Policy", `public;limit=${maxRequests};window=${Math.round(windowMs / 1000)}s`);

      if (record.timestamps.length >= maxRequests) {
        this.metrics.totalThrottled++;
        this.metrics.throttledPublic++;
        const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));
        res.setHeader("Retry-After", retryAfterSeconds);

        return res.status(429).json({
          success: false,
          error: `Public rate limit exceeded (${maxRequests} requests per ${Math.round(windowMs / 1000)}s). Please slow down.`,
          code: "RATE_LIMIT_PUBLIC_EXCEEDED",
          retryAfterSeconds,
          resetTimestamp: resetTime,
        });
      }

      record.timestamps.push(now);
      next();
    };
  }

  /**
   * Middleware for Looser Authenticated User Actions (e.g. CMS updates, invoice storage, profile)
   */
  public authenticatedUserRateLimiterMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      this.metrics.totalRequestsChecked++;
      const now = Date.now();
      const { windowMs, maxRequests } = this.config.authenticatedUser;

      // Extract user key: Authorization header, API Key, Session cookie, or client IP
      const authHeader = req.headers["authorization"] || req.headers["x-user-id"] || req.headers["x-api-key"];
      const userKey = typeof authHeader === "string" ? authHeader : `user-ip:${this.getClientIp(req)}`;

      let record = this.authUserStore.get(userKey);
      if (!record) {
        record = { timestamps: [] };
        this.authUserStore.set(userKey, record);
      }

      record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

      const remaining = Math.max(0, maxRequests - record.timestamps.length);
      const oldest = record.timestamps.length > 0 ? record.timestamps[0] : now;
      const resetTime = oldest + windowMs;

      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", Math.ceil(resetTime / 1000));
      res.setHeader("X-RateLimit-Policy", `authenticated;limit=${maxRequests};window=${Math.round(windowMs / 1000)}s`);

      if (record.timestamps.length >= maxRequests) {
        this.metrics.totalThrottled++;
        this.metrics.throttledAuthUser++;
        const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));
        res.setHeader("Retry-After", retryAfterSeconds);

        return res.status(429).json({
          success: false,
          error: `User action rate limit exceeded (${maxRequests} requests per ${Math.round(windowMs / 1000)}s).`,
          code: "RATE_LIMIT_USER_EXCEEDED",
          retryAfterSeconds,
          resetTimestamp: resetTime,
        });
      }

      record.timestamps.push(now);
      next();
    };
  }

  /**
   * Cleanup memory caches of old records
   */
  private cleanup(): void {
    const now = Date.now();
    const publicWindow = this.config.public.windowMs;
    const userWindow = this.config.authenticatedUser.windowMs;
    const decayMs = this.config.authRoutes.failureDecayMs;

    for (const [key, record] of this.ipStore.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < publicWindow);
      if (record.timestamps.length === 0) {
        this.ipStore.delete(key);
      }
    }

    for (const [key, record] of this.authUserStore.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < userWindow);
      if (record.timestamps.length === 0) {
        this.authUserStore.delete(key);
      }
    }

    for (const [key, record] of this.authIpFailureStore.entries()) {
      if (now - record.lastFailureTime > decayMs && now >= record.nextAllowedTime) {
        this.authIpFailureStore.delete(key);
      }
    }

    for (const [key, record] of this.authAccountFailureStore.entries()) {
      if (now - record.lastFailureTime > decayMs && now >= record.nextAllowedTime) {
        this.authAccountFailureStore.delete(key);
      }
    }
  }
}

export const rateLimiterService = new RateLimiterService();
