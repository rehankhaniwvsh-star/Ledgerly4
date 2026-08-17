import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, Zap, Shield } from 'lucide-react';

interface PricingSectionProps {
  onOpenGenerator: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onOpenGenerator,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <section id="pricing" className="py-24 border-t border-[var(--border)] relative bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent & Honest</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
            Choose the Perfect Plan for Your Business
          </h2>
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base leading-relaxed">
            Start completely free or unlock enterprise power with automated bookkeeping and dedicated team seats.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="bg-[var(--card)] border border-[var(--border)] p-1 rounded-full flex items-center shadow-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#111116] text-white shadow-xs'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-[#111116] text-white shadow-xs'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <span>Yearly</span>
                <span className="px-1.5 py-0.2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-[10px] font-black">
                  Save 30%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card 1: Free Starter Plan */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-500/10 px-3 py-1 rounded-full">
                  Free Forever
                </span>
                <span className="text-xs font-semibold text-[var(--muted-foreground)]">Solo Creators</span>
              </div>

              <h3 className="text-2xl font-extrabold text-[var(--foreground)] mb-2">Starter</h3>
              <p className="text-xs text-[var(--muted-foreground)] mb-6">
                Everything you need to create and send gorgeous branded invoices with no setup required.
              </p>

              <div className="flex items-baseline gap-1.5 mb-8 pb-6 border-b border-[var(--border)]">
                <span className="text-4xl sm:text-5xl font-black font-mono text-[var(--foreground)] tracking-tight">$0</span>
                <span className="text-xs font-semibold text-[var(--muted-foreground)]">/ forever free</span>
              </div>

              <ul className="space-y-3.5 text-xs text-[var(--foreground)] font-medium mb-8">
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Unlimited standard invoice generation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Custom logo & color palette branding</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Instant high-res vector PDF downloads</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Direct client payment share links</span>
                </li>
                <li className="flex items-center gap-2.5 text-[var(--muted-foreground)]">
                  <span className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                    -
                  </span>
                  <span>AI Smart Copilot auditing</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenGenerator}
              className="w-full py-3 px-4 rounded-full border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-[var(--foreground)] text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Get Started Free
            </button>
          </div>

          {/* Card 2: Professional Midnight Obsidian Plan (Featured in Screenshot) */}
          <div className="bg-[#111116] border-2 border-orange-500/40 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden text-white group">
            {/* Top right Most Popular Pill */}
            <div className="absolute top-6 right-6">
              <span className="bg-gradient-to-r from-[#FF3366] via-[#FF5722] to-[#FFA000] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md shadow-orange-500/25">
                Most Popular
              </span>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
                  Agencies & Fast Growing
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-2">Professional</h3>
              <p className="text-xs text-zinc-400 mb-6">
                Automated recurring subscriptions, team management, and multi-currency AI bookkeeping.
              </p>

              <div className="flex items-baseline gap-1.5 mb-8 pb-6 border-b border-zinc-800">
                <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                  {billingCycle === 'yearly' ? '$14' : '$19'}
                </span>
                <span className="text-xs font-semibold text-zinc-400">/ per month, billed {billingCycle}</span>
              </div>

              <ul className="space-y-3.5 text-xs text-zinc-200 font-medium mb-8">
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Everything in Starter, plus:</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>AI Smart Copilot description generator</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Automated recurring invoices & auto-pay</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Real-time client read receipts & telemetry</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Multi-currency real-time exchange rates</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenGenerator}
              className="btn-pill-primary relative z-10 w-full py-3.5 px-4 text-center text-xs font-extrabold uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2 group-hover:shadow-orange-500/50 transition-all"
            >
              <span>Upgrade to Professional</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
