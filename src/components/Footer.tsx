import React from 'react';
import { BrandSettings } from '../types';
import { SlidersHorizontal, Sparkles, Lock, Unlock } from 'lucide-react';

interface FooterProps {
  brand: BrandSettings;
  onOpenCms: () => void;
  onOpenGenerator: () => void;
  isAdminAuthenticated?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  brand,
  onOpenCms,
  onOpenGenerator,
  isAdminAuthenticated = false,
}) => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)] transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF3366] via-[#FF5722] to-[#FFA000] p-0.5 shadow-xs flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>
              <span className="font-extrabold text-[var(--foreground)] text-lg tracking-tight">
                {brand.brandName || 'Invoiceify'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-sm leading-relaxed">
              {brand.tagline ||
                'Branded, trackable invoicing for freelancers, creators, and agencies — built to feel like a real product.'}
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--muted-foreground)]">
              <li>
                <a href="#features" className="hover:text-[var(--foreground)] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[var(--foreground)] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenGenerator}
                  className="hover:text-orange-500 font-semibold transition-colors text-left cursor-pointer"
                >
                  Live Generator →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--muted-foreground)]">
              <li>
                <a href="#how-it-works" className="hover:text-[var(--foreground)] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[var(--foreground)] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${brand.contactEmail || 'hello@invoiceify.app'}`}
                  className="hover:text-[var(--foreground)] transition-colors"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Admin & CMS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-4">
              Owner Access
            </h4>
            <button
              onClick={onOpenCms}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full text-[var(--foreground)] hover:bg-[var(--muted)] transition-all cursor-pointer shadow-xs"
              title="Site Owner Admin Panel (PIN Protected)"
            >
              {isAdminAuthenticated ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Admin CMS (Unlocked)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-orange-500" />
                  <span>Admin Portal</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-[var(--muted-foreground)] mt-2">
              Protected by master PIN
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted-foreground)]">
          <p>© {new Date().getFullYear()} {brand.brandName || 'Invoiceify'}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
