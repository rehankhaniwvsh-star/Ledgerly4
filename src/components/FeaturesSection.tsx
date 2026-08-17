import React from 'react';
import { CmsContent, FeatureItem } from '../types';
import {
  Eye,
  FileText,
  Share2,
  Activity,
  RefreshCw,
  LayoutDashboard,
  CheckCircle,
  Zap,
  Shield,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowUpRight,
  BellRing,
  Layers,
  Globe2,
} from 'lucide-react';
import RocketIcon from './icons/RocketIcon';
import BookmarkIcon from './icons/BookmarkIcon';
import MagnifierIcon from './icons/MagnifierIcon';
import BrainCircuitIcon from './icons/BrainCircuitIcon';

interface FeaturesSectionProps {
  features: CmsContent['features'];
  primaryColor: string;
}

const renderIcon = (name: string) => {
  switch (name) {
    case 'Rocket':
      return <RocketIcon size={22} color="#FF5722" strokeWidth={2} />;
    case 'Bookmark':
      return <BookmarkIcon size={22} color="#FF5722" strokeWidth={2} />;
    case 'Magnifier':
      return <MagnifierIcon size={22} color="#FF5722" strokeWidth={2} />;
    case 'BrainCircuit':
      return <BrainCircuitIcon size={22} color="#FF5722" strokeWidth={2} />;
    case 'Eye':
      return <Eye className="w-5 h-5 text-orange-500" />;
    case 'FileText':
      return <FileText className="w-5 h-5 text-orange-500" />;
    case 'Share2':
      return <Share2 className="w-5 h-5 text-orange-500" />;
    case 'Activity':
      return <Activity className="w-5 h-5 text-orange-500" />;
    case 'RefreshCw':
      return <RefreshCw className="w-5 h-5 text-orange-500" />;
    case 'LayoutDashboard':
      return <LayoutDashboard className="w-5 h-5 text-orange-500" />;
    case 'Zap':
      return <Zap className="w-5 h-5 text-orange-500" />;
    case 'Shield':
      return <Shield className="w-5 h-5 text-orange-500" />;
    default:
      return <CheckCircle className="w-5 h-5 text-orange-500" />;
  }
};

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features,
}) => {
  return (
    <section id="features" className="py-24 border-t border-[var(--border)] relative bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 space-y-24">
        {/* Section 1: Main Core Features */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Everything You Need</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
              {features.title || 'Everything included. Nothing gated.'}
            </h2>
            <p className="text-[var(--muted-foreground)] text-base leading-relaxed">
              {features.subtitle ||
                'No tiers, no locked features. Every account gets the full toolkit from day one.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(features.items || []).map((feature: FeatureItem) => (
              <div
                key={feature.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-orange-500/30 group relative overflow-hidden"
              >
                {/* Subtle orange corner glow on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/15 transition-all pointer-events-none" />

                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                  {renderIcon(feature.iconName)}
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2.5 flex items-center justify-between">
                  <span>{feature.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 group-hover:text-orange-500 transition-all" />
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Dark "Insights in Real Time" Bento Showcase (Matches Screenshots) */}
        <div id="insights" className="relative rounded-3xl bg-[#0f0f14] border border-[#23232f] p-8 sm:p-12 md:p-14 overflow-hidden text-white shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 ambient-glow-dark pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-72 h-72 ambient-glow-warm opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-Time Intelligence</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Insights & Telemetry in Real Time
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Stay in absolute control with live read receipts, instant client payment reconciliation, and automated smart cashflow summaries.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-[#171721] border border-[#2a2a38] rounded-2xl p-6 hover:border-orange-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4 text-orange-400">
                <BellRing className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white mb-2">Live View Notifications</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Know the exact second a client opens and views your invoice link via browser or smartphone.
              </p>
            </div>

            <div className="bg-[#171721] border border-[#2a2a38] rounded-2xl p-6 hover:border-orange-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4 text-orange-400">
                <Globe2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white mb-2">Multi-Currency Engine</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Bill globally in USD, EUR, GBP, INR, and 30+ currencies with real-time automatic conversion.
              </p>
            </div>

            <div className="bg-[#171721] border border-[#2a2a38] rounded-2xl p-6 hover:border-orange-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4 text-orange-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white mb-2">Cash Flow Forecasting</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Predict incoming receivables and identify overdue payments before they hurt monthly operations.
              </p>
            </div>

            <div className="bg-[#171721] border border-[#2a2a38] rounded-2xl p-6 hover:border-orange-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4 text-orange-400">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white mb-2">Automated Recurring</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Set monthly retainer billing cycles with zero manual intervention and automatic receipt delivery.
              </p>
            </div>

            <div className="bg-[#171721] border border-[#2a2a38] rounded-2xl p-6 hover:border-orange-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4 text-orange-400">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white mb-2">Cryptographic Verification</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every exported PDF is tamper-evident with cryptographic verification hashes and timestamps.
              </p>
            </div>

            <div className="bg-[#171721] border border-[#2a2a38] rounded-2xl p-6 hover:border-orange-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4 text-orange-400">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white mb-2">Seamless Exports</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                One-click synchronization with QuickBooks, Xero, Stripe, or CSV spreadsheet exports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
