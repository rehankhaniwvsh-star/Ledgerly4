import React, { useState } from 'react';
import { BrandSettings, UserProfile } from '../types';
import { SlidersHorizontal, Sparkles, Menu, X, ArrowRight, Lock, Unlock, LogOut, User, CheckCircle2, ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { MorphingMascot } from './MorphingMascot';

interface HeaderProps {
  brand: BrandSettings;
  onOpenCms: () => void;
  onOpenGenerator: () => void;
  onOpenDashboard: () => void;
  isAdminOpen: boolean;
  isAdminAuthenticated: boolean;
  onLockAdmin: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (tab?: 'signin' | 'signup') => void;
  onLogout?: () => void;
  currentView?: 'landing' | 'studio' | 'auth';
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  brand,
  onOpenCms,
  onOpenGenerator,
  onOpenDashboard,
  isAdminOpen,
  isAdminAuthenticated,
  onLockAdmin,
  currentUser,
  onOpenAuth,
  onLogout,
  currentView,
  onNavigateHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const showAdminPublicly = brand.showAdminButtonInHeader ?? false;

  const handleAuthClick = (tab: 'signin' | 'signup') => {
    if (onOpenAuth) {
      onOpenAuth(tab);
    } else {
      const el = document.getElementById('auth');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/85 backdrop-blur-xl border-b border-[var(--border)] transition-all">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo with Enchanted Receipt Icon & Tagline */}
        <a href="#" onClick={handleLogoClick} className="cursor-pointer">
          <BrandLogo
            brandName={brand.brandName || 'Billnest'}
            tagline={brand.tagline || 'Invoices, paid faster'}
            size="md"
            showTagline={true}
          />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href={currentView === 'landing' ? '#features' : '/#features'}
            onClick={() => onNavigateHome && onNavigateHome()}
            className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            Features
          </a>
          <a
            href={currentView === 'landing' ? '#how-it-works' : '/#how-it-works'}
            onClick={() => onNavigateHome && onNavigateHome()}
            className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            How it works
          </a>
          <a
            href={currentView === 'landing' ? '#faq' : '/#faq'}
            onClick={() => onNavigateHome && onNavigateHome()}
            className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            FAQ
          </a>
          <button
            onClick={onOpenDashboard}
            className="text-sm font-semibold text-[var(--primary)] hover:opacity-80 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Dashboard</span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-500/10 text-orange-600 rounded-full">
              Live
            </span>
          </button>

          {/* Sign In & Sign Up Navigation Tabs */}
          {!currentUser ? (
            <div className="flex items-center gap-4 border-l border-[var(--border)] pl-4">
              <button
                onClick={() => handleAuthClick('signin')}
                className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => handleAuthClick('signup')}
                className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Sign Up</span>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-orange-500/10 text-orange-600 rounded-full">
                  Tab
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleAuthClick('signin')}
              className="text-sm font-medium text-emerald-600 flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer border-l border-[var(--border)] pl-4"
              title="View Account"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Account</span>
            </button>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Active User Account Badge or Sign Up / In Another Tab */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 py-1 pl-1.5 pr-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:border-orange-500/30 transition-all cursor-pointer shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold text-[var(--foreground)] max-w-[100px] truncate">
                  {currentUser.name}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                    <p className="text-xs font-bold text-[var(--foreground)] truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-[var(--muted-foreground)] truncate">
                      {currentUser.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenDashboard();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[var(--foreground)] hover:bg-[var(--muted)] rounded-lg transition-colors cursor-pointer"
                  >
                    Invoices Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleAuthClick('signin');
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[var(--foreground)] hover:bg-[var(--muted)] rounded-lg transition-colors cursor-pointer"
                  >
                    Account Settings
                  </button>
                  {onLogout && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer mt-1 border-t border-[var(--border)] pt-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAuthClick('signup')}
                className="px-3.5 py-2 text-xs font-semibold rounded-full border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-all cursor-pointer"
              >
                Sign Up
              </button>
              <a
                href="/signup"
                target="_blank"
                rel="noopener noreferrer"
                title="Open Sign Up section in another tab"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">In another tab</span>
              </a>
            </div>
          )}

          {/* Admin Authenticated Badge & CMS Button */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full p-1 pl-3 shadow-xs">
              <button
                onClick={onOpenCms}
                className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                title="Open CMS Editor"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Admin CMS</span>
              </button>
              <button
                onClick={onLockAdmin}
                className="p-1 text-orange-600 hover:text-rose-600 hover:bg-orange-500/20 rounded-full transition-colors cursor-pointer"
                title="Lock / Log Out of Admin Mode"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            showAdminPublicly && (
              <button
                onClick={onOpenCms}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                  isAdminOpen
                    ? 'bg-[var(--foreground)] text-[var(--card)] border-[var(--foreground)]'
                    : 'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
                }`}
                title="Owner Admin Access (Requires PIN)"
              >
                <Lock className="w-3.5 h-3.5 text-orange-500" />
                <span>CMS Admin</span>
              </button>
            )
          )}

          {/* Interactive Micro Mascot in Header */}
          <div className="hidden lg:flex items-center" title="Billnest Animated Mascot">
            <MorphingMascot mode="cycle" size="custom" customSizeClass="w-7 h-7" interactive={true} />
          </div>

          {/* Signature Dark Pill Button with Circular Arrow */}
          <button
            onClick={onOpenGenerator}
            className="btn-pill-dark inline-flex items-center gap-2 pl-4 pr-2.5 py-2 text-xs font-bold cursor-pointer group"
          >
            <span>Create Invoice</span>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          {(isAdminAuthenticated || showAdminPublicly) && (
            <button
              onClick={onOpenCms}
              className="px-2.5 py-1 text-xs font-semibold bg-orange-500/10 border border-orange-500/30 text-orange-600 rounded-full flex items-center gap-1"
            >
              {isAdminAuthenticated ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              <span>CMS</span>
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[var(--foreground)] hover:bg-[var(--muted)] rounded-lg"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[var(--border)] bg-[var(--card)] px-6 py-4 space-y-3 shadow-lg">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--foreground)] py-1.5"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--foreground)] py-1.5"
          >
            How it works
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--muted-foreground)] py-1.5"
          >
            FAQ
          </a>

          {/* Mobile Auth Controls */}
          {currentUser ? (
            <div className="py-2 px-3 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--foreground)] leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{currentUser.email}</p>
                </div>
              </div>
              {onLogout && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  Sign Out
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAuthClick('signin');
                  }}
                  className="py-2 text-center text-xs font-semibold rounded-xl border border-[var(--border)] text-[var(--foreground)]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAuthClick('signup');
                  }}
                  className="py-2 text-center text-xs font-semibold rounded-xl bg-orange-500 text-white font-bold"
                >
                  Sign Up
                </button>
              </div>
              <a
                href="/signup"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 text-center text-xs font-semibold rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-600 flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Sign Up in another tab</span>
              </a>
            </div>
          )}

          <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGenerator();
              }}
              className="btn-pill-dark w-full justify-center inline-flex items-center gap-2 py-2.5 text-xs font-bold"
            >
              <span>Create Invoice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCms();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-orange-600 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center gap-1.5"
            >
              {isAdminAuthenticated ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isAdminAuthenticated ? 'Open CMS Admin' : 'Owner Admin Login'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
