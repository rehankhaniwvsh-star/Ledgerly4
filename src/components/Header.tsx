import React, { useState } from 'react';
import { BrandSettings } from '../types';
import { SlidersHorizontal, ChevronDown, Menu, X, ArrowRight, Lock, Unlock, LogOut } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

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
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [trackingDropdownOpen, setTrackingDropdownOpen] = useState(false);
  const showAdminPublicly = brand.showAdminButtonInHeader ?? false;

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/85 backdrop-blur-xl border-b border-[var(--border)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo with exact Receipt Icon & Tagline */}
        <a href="#" className="cursor-pointer">
          <BrandLogo
            brandName={brand.brandName || 'Invoiceify'}
            tagline={brand.tagline || 'Invoices, paid faster'}
            size="md"
            showTagline={false}
          />
        </a>

        {/* Desktop Nav Links matching inspiration navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <a
            href="#features"
            className="text-sm font-semibold text-[var(--foreground)] hover:text-[#FF5722] transition-colors"
          >
            Features
          </a>

          {/* Invoicing & Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setServicesDropdownOpen(!servicesDropdownOpen);
                setTrackingDropdownOpen(false);
              }}
              className="text-sm font-semibold text-[var(--foreground)] hover:text-[#FF5722] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Invoicing & Services</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {servicesDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    setServicesDropdownOpen(false);
                    onOpenGenerator();
                  }}
                  className="w-full text-left p-2.5 text-xs font-semibold rounded-xl hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
                >
                  ⚡ Instant Invoice Builder
                </button>
                <a
                  href="#how-it-works"
                  onClick={() => setServicesDropdownOpen(false)}
                  className="block p-2.5 text-xs font-semibold rounded-xl hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
                >
                  📄 PDF & Print Engine
                </a>
                <a
                  href="#features"
                  onClick={() => setServicesDropdownOpen(false)}
                  className="block p-2.5 text-xs font-semibold rounded-xl hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
                >
                  🏦 Bank Wire & Remittance
                </a>
              </div>
            )}
          </div>

          {/* Tracking & Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setTrackingDropdownOpen(!trackingDropdownOpen);
                setServicesDropdownOpen(false);
              }}
              className="text-sm font-semibold text-[var(--foreground)] hover:text-[#FF5722] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Tracking</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {trackingDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    setTrackingDropdownOpen(false);
                    onOpenDashboard();
                  }}
                  className="w-full text-left p-2.5 text-xs font-semibold rounded-xl hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors flex items-center justify-between"
                >
                  <span>Real-time Dashboard</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-600 rounded">Live</span>
                </button>
                <a
                  href="#features"
                  onClick={() => setTrackingDropdownOpen(false)}
                  className="block p-2.5 text-xs font-semibold rounded-xl hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
                >
                  Status Lifecycle (Paid/Sent)
                </a>
                <a
                  href="#features"
                  onClick={() => setTrackingDropdownOpen(false)}
                  className="block p-2.5 text-xs font-semibold rounded-xl hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
                >
                  Payment Reminder Emails
                </a>
              </div>
            )}
          </div>

          <a
            href="#pricing"
            className="text-sm font-semibold text-[var(--foreground)] hover:text-[#FF5722] transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* Action Buttons matching inspiration layout (Login, Options pill, Dark primary button) */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Login text button */}
          <button
            onClick={onOpenDashboard}
            className="text-sm font-semibold text-[var(--foreground)] hover:text-[#FF5722] px-3 py-2 cursor-pointer transition-colors"
          >
            Login
          </button>

          {/* Options / Templates soft peach pill button */}
          <button
            onClick={onOpenDashboard}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-full bg-[#FFF0E6] hover:bg-[#FFE3D1] text-[#E65100] border border-[#FFDCC4] transition-all cursor-pointer shadow-xs"
          >
            Options
          </button>

          {/* Admin CMS Badge if authenticated */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full p-1 pl-3 shadow-xs">
              <button
                onClick={onOpenCms}
                className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                title="Open CMS Editor"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>CMS Admin</span>
              </button>
              <button
                onClick={onLockAdmin}
                className="p-1 text-orange-600 hover:text-rose-600 hover:bg-orange-500/20 rounded-full transition-colors cursor-pointer"
                title="Lock Admin Mode"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            showAdminPublicly && (
              <button
                onClick={onOpenCms}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                  isAdminOpen
                    ? 'bg-[var(--foreground)] text-[var(--card)] border-[var(--foreground)]'
                    : 'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-orange-500" />
                <span>Admin</span>
              </button>
            )
          )}

          {/* Signature Dark Pill CTA Button */}
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
        <div className="flex lg:hidden items-center gap-2">
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
            className="p-2 text-[var(--foreground)] hover:bg-[var(--muted)] rounded-lg cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--card)] px-6 py-4 space-y-3 shadow-lg">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--foreground)] py-1.5"
          >
            Features
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDashboard();
            }}
            className="block w-full text-left text-sm font-medium text-[var(--foreground)] py-1.5"
          >
            Invoicing & Tracking Dashboard
          </button>
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

