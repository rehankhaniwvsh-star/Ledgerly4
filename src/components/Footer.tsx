import React from 'react';
import { BrandSettings } from '../types';
import { SlidersHorizontal } from 'lucide-react';

interface FooterProps {
  brand: BrandSettings;
  onOpenCms: () => void;
  onOpenGenerator: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  brand,
  onOpenCms,
  onOpenGenerator,
}) => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
          {/* Column 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-6 h-6 rounded-[var(--radius)] flex items-center justify-center font-bold bg-[var(--primary)] text-[var(--primary-foreground)] text-xs"
              >
                {brand.logoLetter || 'L'}
              </div>
              <span className="font-bold text-[var(--foreground)] text-base">
                {brand.brandName || 'Ledgerly'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-sm leading-relaxed">
              {brand.tagline ||
                'Free, branded invoicing for freelancers, creators, and agencies. No tiers, no watermarks.'}
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--muted-foreground)]">
              <li>
                <a href="#features" className="hover:text-[var(--foreground)] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[var(--foreground)] transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenGenerator}
                  className="hover:text-[var(--foreground)] transition-colors text-left cursor-pointer"
                >
                  Live Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--muted-foreground)]">
              <li>
                <a href="#about" className="hover:text-[var(--foreground)] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[var(--foreground)] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${brand.contactEmail || 'hello@ledgerly.app'}`}
                  className="hover:text-[var(--foreground)] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Admin & CMS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
              Management
            </h4>
            <button
              onClick={onOpenCms}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>CMS Admin Panel</span>
            </button>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--muted-foreground)]">
          <p>
            © {new Date().getFullYear()} {brand.brandName || 'Ledgerly'}. Invoicing
            for freelancers, creators, and agencies.
          </p>
        </div>
      </div>
    </footer>
  );
};
