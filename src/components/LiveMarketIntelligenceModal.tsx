import React, { useState } from 'react';
import {
  X,
  Search,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Percent,
  FileCheck,
  Coins,
  Globe,
  Loader2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface GroundingSource {
  uri: string;
  title: string;
}

interface LiveMarketIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  currencySymbol?: string;
}

const PRESET_QUERIES = [
  {
    label: 'GST Rates for Digital Services',
    icon: Percent,
    topic: 'Tax Compliance',
    query: 'What are the current GST rates and exemptions for freelance software and graphic design services in India?',
  },
  {
    label: 'Freelance Tech & Design Rates 2026',
    icon: TrendingUp,
    topic: 'Market Rates',
    query: 'What are the current average hourly and project market rates for senior freelance web developers and UI/UX designers?',
  },
  {
    label: 'Statutory Late Payment Fees',
    icon: Coins,
    topic: 'Payment Terms',
    query: 'What are standard statutory interest penalties and legal late payment fee rules for overdue commercial B2B invoices?',
  },
  {
    label: 'EU VAT & Cross-Border Invoicing',
    icon: Globe,
    topic: 'International Tax',
    query: 'What are the mandatory invoice requirements and reverse-charge VAT rules when invoicing European Union business clients?',
  },
];

export const LiveMarketIntelligenceModal: React.FC<LiveMarketIntelligenceModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  currencySymbol = '₹',
}) => {
  const [query, setQuery] = useState(initialQuery || PRESET_QUERIES[0].query);
  const [activeTopic, setActiveTopic] = useState<string>(PRESET_QUERIES[0].topic);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Client-side cache to avoid repeated network calls when switching presets
  const [localCache, setLocalCache] = useState<
    Record<string, { answer: string; sources: GroundingSource[]; searchQueries: string[]; notice?: string }>
  >({});

  if (!isOpen) return null;

  const handleSearch = async (targetQuery?: string, topic?: string) => {
    if (loading) return; // Prevent concurrent requests

    const q = (targetQuery || query).trim();
    if (!q) return;

    const cacheKey = q.toLowerCase();
    if (localCache[cacheKey]) {
      const cached = localCache[cacheKey];
      setAnswer(cached.answer);
      setSources(cached.sources);
      setSearchQueries(cached.searchQueries);
      setNotice(cached.notice || null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);
    setAnswer(null);
    setSources([]);
    setSearchQueries([]);

    try {
      const res = await fetch('/api/gemini/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, topic: topic || activeTopic }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to retrieve grounded search intelligence.');
      }

      setAnswer(data.answer);
      setSources(data.sources || []);
      setSearchQueries(data.searchQueries || []);
      if (data.notice) {
        setNotice(data.notice);
      }

      // Save to client cache
      setLocalCache((prev) => ({
        ...prev,
        [cacheKey]: {
          answer: data.answer,
          sources: data.sources || [],
          searchQueries: data.searchQueries || [],
          notice: data.notice,
        },
      }));
    } catch (err: any) {
      setError(err.message || 'An error occurred while querying Google Search data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Live Market &amp; Tax Intelligence
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <Globe className="w-3 h-3" />
                  Google Search Grounded
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Powered by Gemini 3.5 Flash with real-time web search verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Query Preset Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Quick Research Topics
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_QUERIES.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = query === item.query;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setQuery(item.query);
                      setActiveTopic(item.topic);
                      handleSearch(item.query, item.topic);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 font-semibold shadow-xs'
                        : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-white dark:bg-zinc-700 shadow-xs shrink-0">
                      <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
              Ask Any Billing, Tax, or Market Rate Question
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                  placeholder="e.g. Current GST rate for web consulting or UK VAT invoice requirements..."
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching Web...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Grounded Response View */}
          {answer && (
            <div className="space-y-4 animate-fadeIn">
              {notice && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{notice}</span>
                </div>
              )}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200/60 dark:border-zinc-700/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Grounded Answer
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Answer</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {answer}
                </div>

                {/* Web Citations & Sources */}
                {sources.length > 0 && (
                  <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-700/60 space-y-2">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                      Google Search Sources ({sources.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 text-[11px] text-blue-600 dark:text-blue-400 transition-colors shadow-xs group"
                        >
                          <Globe className="w-3 h-3 text-zinc-400 group-hover:text-blue-500" />
                          <span className="max-w-[200px] truncate">{src.title || src.uri}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-blue-500" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Initial Helper Banner */}
          {!answer && !loading && (
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <span className="font-bold block">Live Information Guaranteed</span>
                <p className="text-blue-700 dark:text-blue-300">
                  Unlike traditional static AI models, this research assistant executes live Google Search queries to verify official tax codes, government notifications, inflation indices, and current freelancer market benchmarks.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
