import React, { useState } from 'react';
import { BrandSettings } from '../types';
import { SlidersHorizontal, Sparkles, Menu, X, FileText } from 'lucide-react';

interface HeaderProps {
  brand: BrandSettings;
  onOpenCms: () => void;
  onOpenGenerator: () => void;
  onOpenDashboard: () => void;
  isAdminOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  brand,
  onOpenCms,
  onOpenGenerator,
  onOpenDashboard,
  isAdminOpen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-[var(--radius)] flex items-center justify-center font-bold text-white text-sm shadow-sm transition-transform group-hover:scale-105 bg-[var(--primary)]"
          >
            {brand.logoLetter || 'L'}
          </div>
          <span className="font-bold text-[var(--foreground)] text-lg tracking-tight">
            {brand.brandName || 'Ledgerly'}
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={onOpenDashboard}
            className="text-sm font-semibold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Invoices Dashboard</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-[var(--accent)] rounded text-[var(--primary)]">
              Live
            </span>
          </button>
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
            href="#faq"
            className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-[var(--radius)] border bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--muted)] transition-all cursor-pointer"
            title="Open Invoices Dashboard"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={onOpenCms}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-[var(--radius)] border transition-all cursor-pointer ${
              isAdminOpen
                ? 'bg-[var(--foreground)] text-[var(--card)] border-[var(--foreground)]'
                : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--muted)]'
            }`}
            title="Open CMS Content Management Editor"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>CMS Admin</span>
          </button>

          <button
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[var(--primary-foreground)] bg-[var(--primary)] rounded-[var(--radius)] transition-all shadow-sm hover:opacity-95 active:scale-[0.98] cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenCms}
            className="p-2 text-xs font-semibold bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--foreground)]"
          >
            CMS
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[var(--foreground)] hover:bg-[var(--muted)] rounded-[var(--radius)]"
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
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--foreground)] py-1.5"
          >
            About
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
              className="w-full py-2.5 text-center text-xs font-semibold text-[var(--primary-foreground)] bg-[var(--primary)] rounded-[var(--radius)] shadow-sm"
            >
              Create Invoice Demo
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCms();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-[var(--foreground)] bg-[var(--muted)] border border-[var(--border)] rounded-[var(--radius)]"
            >
              Open CMS Editor
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
