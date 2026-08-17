import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { ReceiptLogoIcon } from './BrandLogo';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
  brandName?: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPin,
  brandName = 'Invoiceify',
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === correctPin.trim()) {
      setError('');
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setPin('');
        onSuccess();
      }, 500);
    } else {
      setError('Incorrect admin security PIN. Access denied.');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl max-w-sm w-full p-7 shadow-2xl relative overflow-hidden text-[var(--foreground)]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-4 mb-6">
          <div className="relative inline-flex items-center justify-center mx-auto">
            <ReceiptLogoIcon sizeClass="w-16 h-16 rounded-3xl" showSparkle={false} />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md border-2 border-[var(--card)]">
              {isSuccess ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-white animate-in zoom-in" />
              ) : (
                <Lock className="w-3 h-3 text-white" />
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black tracking-tight text-[var(--foreground)]">
              {isSuccess ? 'Access Granted' : `${brandName} Admin Gate`}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Enter your master security PIN to open the {brandName} CMS editor.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 text-center">
              Enter Master Security PIN
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={8}
                value={pin}
                autoFocus
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••"
                className="w-full text-center tracking-[0.4em] text-2xl font-black font-mono py-3 px-4 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-orange-500 focus:outline-none text-[var(--foreground)] transition-colors shadow-inner"
              />
            </div>
            {error && (
              <div className="mt-2 text-xs font-semibold text-rose-500 flex items-center justify-center gap-1.5 animate-in fade-in">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!pin.trim() || isSuccess}
              className="btn-pill-primary w-full py-3 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <span>{isSuccess ? 'Unlocking CMS...' : 'Authenticate & Unlock'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Default owner PIN is <span className="font-mono font-bold text-[var(--foreground)]">1234</span> (configurable in CMS Settings)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
