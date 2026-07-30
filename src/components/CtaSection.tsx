import React from 'react';
import { CmsContent, BrandSettings } from '../types';
import { FileText, ArrowRight } from 'lucide-react';

interface CtaSectionProps {
  cta: CmsContent['cta'];
  brand: BrandSettings;
  onOpenGenerator: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  cta,
  brand,
  onOpenGenerator,
}) => {
  return (
    <section className="px-6 py-12">
      <div
        className="max-w-6xl mx-auto rounded-md p-10 sm:p-16 text-center text-white shadow-md relative overflow-hidden"
        style={{ backgroundColor: brand.primaryColor }}
      >
        {/* Subtle decorative background ring */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-60 h-60 rounded-full bg-white/5 pointer-events-none"></div>

        <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 relative z-10">
          {cta.headline || 'Send your first invoice in two minutes.'}
        </h2>

        <div className="relative z-10 flex flex-wrap justify-center items-center gap-4">
          <button
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-2 px-8 py-4 text-xs sm:text-sm font-bold bg-white text-[#7A1E2B] rounded shadow hover:bg-opacity-95 transition-all active:scale-95"
            style={{ color: brand.primaryColor }}
          >
            <FileText className="w-4 h-4" />
            <span>{cta.buttonText || "Create invoice — it's free"}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
