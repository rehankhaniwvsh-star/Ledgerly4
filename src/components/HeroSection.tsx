import React, { useState } from 'react';
import { HeroData, BrandSettings } from '../types';
import { FileText, ArrowRight, CheckCircle2, Clock, Check, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  hero: HeroData;
  brand: BrandSettings;
  onOpenGenerator: () => void;
  onOpenDashboard: () => void;
  onOpenCms: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  hero,
  brand,
  onOpenGenerator,
  onOpenDashboard,
  onOpenCms,
}) => {
  const [invoiceStatus, setInvoiceStatus] = useState<'Paid' | 'Sent' | 'Draft'>(
    (hero.previewInvoice.status as any) || 'Paid'
  );

  const toggleStatus = () => {
    if (invoiceStatus === 'Paid') setInvoiceStatus('Sent');
    else if (invoiceStatus === 'Sent') setInvoiceStatus('Draft');
    else setInvoiceStatus('Paid');
  };

  return (
    <section className="px-6 pt-6 pb-16 md:pb-24">
      <div className="max-w-6xl mx-auto bg-white border border-[#E3DED6] rounded-md p-6 sm:p-10 md:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        {/* Left Copy Column */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#E8DCC8] text-[#7A1E2B] text-xs font-semibold px-3 py-1.5 rounded-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hero.eyebrow || 'Free · No card required'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2B2320] leading-[1.18] tracking-tight">
            {hero.headlineMain}{' '}
            <span style={{ color: brand.primaryColor }}>
              {hero.headlineAccent}
            </span>
          </h1>

          <p className="text-[#8A8177] text-base sm:text-lg leading-relaxed max-w-lg">
            {hero.subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenGenerator}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white rounded transition-all shadow-sm hover:opacity-95 active:scale-[0.98]"
              style={{ backgroundColor: brand.primaryColor }}
            >
              <FileText className="w-4 h-4" />
              <span>{hero.primaryCtaText || 'Create your first invoice'}</span>
            </button>

            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#2B2320] bg-white border border-[#E3DED6] rounded hover:bg-[#EDEAE5] transition-all cursor-pointer shadow-sm"
            >
              <span>{hero.secondaryCtaText || 'See the dashboard'}</span>
              <ArrowRight className="w-4 h-4 text-[#7A1E2B]" />
            </button>
          </div>

          {/* Micro social proof badges */}
          <div className="pt-4 border-t border-[#EDEAE5] flex items-center gap-6 text-xs text-[#8A8177]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3F7A4E]" />
              <span>Unlimited Invoices</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3F7A4E]" />
              <span>Instant PDF Export</span>
            </div>
          </div>
        </div>

        {/* Right Invoice Card Widget */}
        <div className="relative group">
          {/* Subtle accent backdrop card effect */}
          <div
            className="absolute -inset-2 rounded-lg opacity-40 blur-sm transition-all group-hover:opacity-60"
            style={{ backgroundColor: brand.accentColor }}
          ></div>

          <div className="relative bg-[#FBF9F6] border border-[#E3DED6] rounded p-6 sm:p-7 shadow-sm transition-transform duration-300 hover:-translate-y-1">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E3DED6]">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded bg-[#7A1E2B] text-white font-bold flex items-center justify-center text-sm shadow-sm"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  {hero.previewInvoice.clientName?.charAt(0) || 'N'}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#2B2320]">
                    {hero.previewInvoice.clientName || 'Nova Studio'}
                  </p>
                  <span className="text-xs text-[#8A8177]">
                    {hero.previewInvoice.clientEmail || 'hello@novastudio.com'}
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold text-[#8A8177] bg-white border border-[#E3DED6] px-2.5 py-1 rounded">
                {hero.previewInvoice.invoiceNumber || 'INV-0042'}
              </span>
            </div>

            {/* Line Items */}
            <div className="py-4 space-y-2.5">
              {(hero.previewInvoice.items || []).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs text-[#8A8177]"
                >
                  <span className="font-medium text-[#2B2320]">
                    {item.description}
                  </span>
                  <span className="font-mono text-[#2B2320]">
                    {hero.previewInvoice.currencySymbol}
                    {item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-[#E3DED6] my-2"></div>

            {/* Total Row */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-semibold text-[#8A8177]">Total</span>
              <span className="text-xl font-bold font-mono text-[#2B2320]">
                {hero.previewInvoice.currencySymbol}
                {(hero.previewInvoice.total || 57820).toLocaleString()}
              </span>
            </div>

            {/* Status Switcher Badge */}
            <div className="mt-5 flex items-center justify-between bg-white border border-[#E3DED6] rounded p-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#8A8177]">Status:</span>
                <button
                  onClick={toggleStatus}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    invoiceStatus === 'Paid'
                      ? 'bg-[#EAF3EC] text-[#3F7A4E]'
                      : invoiceStatus === 'Sent'
                      ? 'bg-[#EBF3FA] text-[#2563EB]'
                      : 'bg-[#F5F0EA] text-[#8A8177]'
                  }`}
                  title="Click to toggle status demo"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      invoiceStatus === 'Paid'
                        ? 'bg-[#3F7A4E] animate-pulse'
                        : invoiceStatus === 'Sent'
                        ? 'bg-[#2563EB]'
                        : 'bg-[#8A8177]'
                    }`}
                  ></span>
                  <span>{invoiceStatus}</span>
                </button>
              </div>

              <button
                onClick={onOpenGenerator}
                className="text-[11px] font-semibold text-[#7A1E2B] hover:underline"
              >
                Customise →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
