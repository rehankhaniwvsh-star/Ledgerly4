import React, { useState } from 'react';
import { HeroData, BrandSettings } from '../types';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import RocketIcon from './icons/RocketIcon';
import BookmarkIcon from './icons/BookmarkIcon';
import MagnifierIcon from './icons/MagnifierIcon';
import BrainCircuitIcon from './icons/BrainCircuitIcon';

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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAudited, setAiAudited] = useState(false);

  const toggleStatus = () => {
    if (invoiceStatus === 'Paid') setInvoiceStatus('Sent');
    else if (invoiceStatus === 'Sent') setInvoiceStatus('Draft');
    else setInvoiceStatus('Paid');
  };

  return (
    <section className="px-6 pt-6 pb-16 md:pb-24">
      <div className="max-w-6xl mx-auto bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 sm:p-10 md:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        {/* Left Copy Column */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-semibold px-3 py-1.5 rounded-[var(--radius)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{hero.eyebrow || 'Free · No card required'}</span>
            </div>
            
            <div 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="inline-flex items-center gap-1.5 bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-xs font-medium px-2.5 py-1 rounded-[var(--radius)] cursor-pointer hover:bg-[var(--muted)] transition-all"
              title="Bookmark template"
            >
              <BookmarkIcon size={16} color={isBookmarked ? "var(--primary)" : "var(--muted-foreground)"} strokeWidth={2} />
              <span>{isBookmarked ? 'Bookmarked' : 'Save Template'}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--foreground)] leading-[1.18] tracking-tight">
            {hero.headlineMain}{' '}
            <span className="text-[var(--primary)]">
              {hero.headlineAccent}
            </span>
          </h1>

          <p className="text-[var(--muted-foreground)] text-base sm:text-lg leading-relaxed max-w-lg">
            {hero.subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenGenerator}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-[var(--primary-foreground)] bg-[var(--primary)] rounded-[var(--radius)] transition-all shadow-sm hover:opacity-95 active:scale-[0.98] group cursor-pointer"
            >
              <RocketIcon size={18} color="var(--primary-foreground)" strokeWidth={2} />
              <span>{hero.primaryCtaText || 'Create your first invoice'}</span>
            </button>

            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] hover:bg-[var(--muted)] transition-all cursor-pointer shadow-sm"
            >
              <span>{hero.secondaryCtaText || 'See the dashboard'}</span>
              <ArrowRight className="w-4 h-4 text-[var(--primary)]" />
            </button>
          </div>

          {/* Micro social proof badges */}
          <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[var(--muted-foreground)]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#4ac885]" />
              <span>Unlimited Invoices</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MagnifierIcon size={16} color="var(--primary)" strokeWidth={2} />
              <span>Instant Client Search</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BrainCircuitIcon size={16} color="var(--primary)" strokeWidth={2} />
              <span>AI Invoice Audit</span>
            </div>
          </div>
        </div>

        {/* Right Invoice Card Widget */}
        <div className="relative group">
          {/* Subtle accent backdrop card effect */}
          <div
            className="absolute -inset-2 rounded-[var(--radius)] opacity-40 blur-sm transition-all group-hover:opacity-60 bg-[var(--accent)]"
          ></div>

          <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 sm:p-7 shadow-sm transition-transform duration-300 hover:-translate-y-1">
            {/* Interactive Demo Search & AI Toolbar */}
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[var(--border)]">
              <div className="relative flex-1">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                  <MagnifierIcon size={15} color="var(--muted-foreground)" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  placeholder="Quick search items or client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] text-[11px] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <button
                onClick={() => setAiAudited(!aiAudited)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius)] text-[11px] font-semibold transition-all cursor-pointer border ${
                  aiAudited
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]'
                    : 'bg-[var(--card)] text-[var(--primary)] border-[var(--border)] hover:bg-[var(--muted)]'
                }`}
                title="Toggle AI Audit Check"
              >
                <BrainCircuitIcon size={15} color={aiAudited ? 'var(--primary-foreground)' : 'var(--primary)'} strokeWidth={2} />
                <span>{aiAudited ? 'AI Audited' : 'Run AI Audit'}</span>
              </button>
            </div>

            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-[var(--radius)] bg-[var(--primary)] text-[var(--primary-foreground)] font-bold flex items-center justify-center text-sm shadow-sm"
                >
                  {hero.previewInvoice.clientName?.charAt(0) || 'N'}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--foreground)]">
                    {hero.previewInvoice.clientName || 'Nova Studio'}
                  </p>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {hero.previewInvoice.clientEmail || 'hello@novastudio.com'}
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold text-[var(--muted-foreground)] bg-[var(--background)] border border-[var(--border)] px-2.5 py-1 rounded-[var(--radius)]">
                {hero.previewInvoice.invoiceNumber || 'INV-0042'}
              </span>
            </div>

            {/* Line Items */}
            <div className="py-4 space-y-2.5">
              {(hero.previewInvoice.items || []).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs text-[var(--muted-foreground)]"
                >
                  <span className="font-medium text-[var(--foreground)]">
                    {item.description}
                  </span>
                  <span className="font-mono text-[var(--foreground)]">
                    {hero.previewInvoice.currencySymbol}
                    {item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-[var(--border)] my-2"></div>

            {/* Total Row */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-semibold text-[var(--muted-foreground)]">Total</span>
              <span className="text-xl font-bold font-mono text-[var(--foreground)]">
                {hero.previewInvoice.currencySymbol}
                {(hero.previewInvoice.total || 57820).toLocaleString()}
              </span>
            </div>

            {/* Status Switcher Badge */}
            <div className="mt-5 flex items-center justify-between bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--muted-foreground)]">Status:</span>
                <button
                  onClick={toggleStatus}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius)] text-xs font-semibold cursor-pointer transition-colors ${
                    invoiceStatus === 'Paid'
                      ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                      : invoiceStatus === 'Sent'
                      ? 'bg-[var(--secondary)] text-[var(--primary)]'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                  }`}
                  title="Click to toggle status demo"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      invoiceStatus === 'Paid'
                        ? 'bg-[var(--accent-foreground)] animate-pulse'
                        : invoiceStatus === 'Sent'
                        ? 'bg-[var(--primary)]'
                        : 'bg-[var(--muted-foreground)]'
                    }`}
                  ></span>
                  <span>{invoiceStatus}</span>
                </button>
              </div>

              <button
                onClick={onOpenGenerator}
                className="text-[11px] font-semibold text-[var(--primary)] hover:underline"
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
