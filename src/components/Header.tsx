import React, { useState } from 'react';
import { BrandSettings } from '../types';
import { SlidersHorizontal, Sparkles, Menu, X, ArrowRight, Lock, Unlock, LogOut } from 'lucide-react';

interface HeaderProps {
  brand: BrandSettings;
  onOpenCms: () => void;
  onOpenGenerator: () => void;
  onOpenDashboard: () => void;
  isAdminOpen: boolean;
  isAdminAuthenticated: boolean;
  onLockAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  brand,
  onOpenCms,
  onOpenGenerator,
  onOpenDashboard,
  isAdminOpen,
  isAdminAuthenticated,
  onLockAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showAdminPublicly = brand.showAdminButtonInHeader ?? false;

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/85 backdrop-blur-xl border-b border-[var(--border)] transition-all">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Animated Coral Sparkle Logo */}
        <a href="#" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF3366] via-[#FF5722] to-[#FFA000] p-0.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white sparkle-icon-animated"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
          <span className="font-extrabold text-[var(--foreground)] text-lg tracking-tight font-sans">
            {brand.brandName || 'Invoiceify'}
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          <a
            href="#features"
            className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
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
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
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
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--foreground)] py-1.5"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--foreground)] py-1.5"
          >
            FAQ
          </a>
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
