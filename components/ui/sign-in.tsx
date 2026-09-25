import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
);

// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

export interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial; delay: string }) => (
  <div
    className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-card/60 dark:bg-zinc-800/60 backdrop-blur-xl border border-white/20 dark:border-white/10 p-5 w-64 shadow-lg`}
  >
    <img
      src={testimonial.avatarSrc}
      className="h-10 w-10 object-cover rounded-2xl shrink-0"
      alt={testimonial.name}
      loading="lazy"
    />
    <div className="text-sm leading-snug min-w-0">
      <p className="flex items-center gap-1 font-semibold text-foreground truncate">{testimonial.name}</p>
      <p className="text-muted-foreground text-xs">{testimonial.handle}</p>
      <p className="mt-1 text-foreground/80 line-clamp-3 text-xs">{testimonial.text}</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-light text-foreground tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  heroImageSrc = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen md:h-[100dvh] flex flex-col md:flex-row font-geist w-full overflow-x-hidden bg-background text-foreground">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              {title}
            </h1>
            <p className="animate-element animate-delay-200 text-muted-foreground text-sm sm:text-base leading-relaxed">
              {description}
            </p>

            <form className="space-y-4 sm:space-y-5" onSubmit={onSignIn}>
              <div className="animate-element animate-delay-300">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground block mb-1.5">
                  Email Address
                </label>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-sm p-3.5 sm:p-4 rounded-2xl focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
                  />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground block mb-1.5">
                  Password
                </label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm p-3.5 sm:p-4 pr-12 rounded-2xl focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-between text-xs sm:text-sm pt-0.5">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    defaultChecked
                    className="custom-checkbox w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                  <span className="text-foreground/90 font-medium">Keep me signed in</span>
                </label>
                <a
                  href="#reset-password"
                  onClick={(e) => {
                    e.preventDefault();
                    onResetPassword?.();
                  }}
                  className="hover:underline text-violet-500 dark:text-violet-400 transition-colors font-medium"
                >
                  Reset password
                </a>
              </div>

              <button
                type="submit"
                className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-3.5 sm:py-4 font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.99] transition-all shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            </form>

            <div className="animate-element animate-delay-700 relative flex items-center justify-center my-1">
              <span className="w-full border-t border-border"></span>
              <span className="px-4 text-xs uppercase tracking-wider text-muted-foreground bg-background absolute">
                Or continue with
              </span>
            </div>

            <button
              type="button"
              onClick={onGoogleSignIn}
              className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-3.5 sm:py-4 hover:bg-muted/80 active:scale-[0.99] transition-all font-medium text-foreground bg-card/60 backdrop-blur-sm shadow-sm"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="animate-element animate-delay-900 text-center text-xs sm:text-sm text-muted-foreground">
              New to our platform?{' '}
              <a
                href="#create-account"
                onClick={(e) => {
                  e.preventDefault();
                  onCreateAccount?.();
                }}
                className="text-violet-500 dark:text-violet-400 hover:underline font-semibold transition-colors"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4 lg:p-6 min-h-[500px]">
          <div
            className="animate-slide-right animate-delay-300 absolute inset-4 lg:inset-6 rounded-3xl bg-cover bg-center overflow-hidden border border-border shadow-2xl"
            style={{ backgroundImage: `url(${heroImageSrc})` }}
          >
            {/* Ambient Dark/Warm Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
            <div className="absolute top-8 left-8 right-8 flex items-center justify-between text-white/90">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs uppercase tracking-widest font-semibold backdrop-blur-md bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  Enterprise Grade Security
                </span>
              </div>
            </div>
          </div>

          {testimonials.length > 0 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 px-6 w-full justify-center z-10">
              <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
              {testimonials[1] && (
                <div className="hidden xl:flex">
                  <TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" />
                </div>
              )}
              {testimonials[2] && (
                <div className="hidden 2xl:flex">
                  <TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" />
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default SignInPage;
