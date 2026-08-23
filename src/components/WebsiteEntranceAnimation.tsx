import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MorphingMascot, MascotMode } from './MorphingMascot';
import { Sparkles, X, Play, RefreshCw, Zap, ArrowRight } from 'lucide-react';

interface WebsiteEntranceAnimationProps {
  onExploreClick?: () => void;
  brandName?: string;
}

export const WebsiteEntranceAnimation: React.FC<WebsiteEntranceAnimationProps> = ({
  onExploreClick,
  brandName = 'Invoiceify',
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [currentMode, setCurrentMode] = useState<MascotMode>('blob');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-minimize after 12 seconds so it doesn't obstruct users, but stays accessible as a floating assistant
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setMinimized(true);
      }
    }, 14000);
    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const modeDescriptions: Record<MascotMode, { title: string; desc: string; badge: string }> = {
    blob: {
      title: 'Smart Invoicing Assistant',
      desc: 'Blinks & reacts to your billing flow with automatic draft generation.',
      badge: 'Live Mascot',
    },
    dots: {
      title: 'Syncing & Audit Engine',
      desc: 'Three-pulse dynamic loader calculating real-time taxes and invoice sums.',
      badge: 'Calculation Loop',
    },
    atom: {
      title: 'Orbital Invoice Network',
      desc: 'Prism core surrounded by multi-colored payment & remittance orbits.',
      badge: 'Prism Multi-Orbit',
    },
    exclamation: {
      title: 'Instant Overdue & Due Reminders',
      desc: 'Bouncy alert pop alerting clients to pending balances.',
      badge: 'Smart Notice',
    },
    rainbow: {
      title: 'Smooth Cashflow Roller',
      desc: 'Rolling along your payment pipelines with automated receipt tracking.',
      badge: 'Cashflow Stream',
    },
    hex: {
      title: 'Secure Ledger Vault',
      desc: 'Faceted polymorphic security shield guarding client data.',
      badge: 'Vault Shield',
    },
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {!minimized ? (
          /* Full Website Entrance Welcome Banner */
          <motion.div
            initial={{ y: -80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm sm:max-w-md w-full p-4 sm:p-5 bg-[var(--card)]/95 backdrop-blur-xl border border-orange-500/30 rounded-2xl shadow-2xl shadow-orange-500/15 overflow-hidden"
          >
            {/* Ambient Background Accent Glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Header / Dismiss */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] font-bold tracking-wide uppercase">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  {modeDescriptions[currentMode].badge}
                </span>
                <span className="text-[11px] text-[var(--muted-foreground)] font-medium">
                  Interactive Mascot
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setMinimized(true);
                    setHasInteracted(true);
                  }}
                  className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors text-xs flex items-center gap-1 px-2 font-medium"
                  title="Minimize mascot to bottom corner"
                >
                  <span>Minimize</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mascot Showcase Grid */}
            <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
              <div className="p-3 bg-gradient-to-b from-orange-500/10 to-red-500/5 border border-orange-500/20 rounded-2xl flex items-center justify-center shrink-0">
                <MorphingMascot
                  mode={currentMode}
                  size="custom"
                  customSizeClass="w-20 h-20 sm:w-24 sm:h-24"
                  interactive={true}
                  onModeChange={(m) => {
                    setCurrentMode(m);
                    setHasInteracted(true);
                  }}
                />
              </div>

              <div className="flex-1 text-left space-y-1.5">
                <h4 className="text-sm sm:text-base font-black text-[var(--foreground)] leading-tight flex items-center gap-1.5">
                  <span>{modeDescriptions[currentMode].title}</span>
                </h4>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  {modeDescriptions[currentMode].desc}
                </p>
                <p className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Click mascot above or tabs below to morph!</span>
                </p>
              </div>
            </div>

            {/* Quick Interactive Switcher Tabs */}
            <div className="mt-3.5 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-1 flex-wrap">
              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                {(['blob', 'atom', 'dots', 'exclamation', 'rainbow', 'hex'] as MascotMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setCurrentMode(m);
                      setHasInteracted(true);
                    }}
                    className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all capitalize whitespace-nowrap ${
                      currentMode === m
                        ? 'bg-[#EE3E38] text-white shadow-xs'
                        : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {onExploreClick && (
                <button
                  onClick={() => {
                    onExploreClick();
                    setMinimized(true);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline px-1 py-1"
                >
                  <span>Launch Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* Minimized Floating Mascot Assistant */
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-2 bg-[var(--card)]/90 backdrop-blur-xl border border-orange-500/30 rounded-full shadow-xl shadow-orange-500/20 cursor-pointer"
            onClick={() => setMinimized(false)}
            title="Click to expand animated mascot controls"
          >
            <MorphingMascot
              mode={currentMode}
              size="sm"
              interactive={false}
            />
            <div className="hidden sm:flex flex-col pr-3 text-left">
              <span className="text-[11px] font-black text-[var(--foreground)] leading-tight">
                {modeDescriptions[currentMode].title}
              </span>
              <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400">
                Click to expand mascot
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
