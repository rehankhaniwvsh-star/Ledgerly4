import React, { useState, useEffect } from 'react';
import { QrCode, Smartphone, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';
import { buildUpiUri, generateUpiQrDataUrl } from '../utils/upi';

interface UpiInvoiceWidgetProps {
  upiId: string;
  payeeName: string;
  amount: number;
  currency?: string;
  invoiceNumber: string;
  onOpenUpiModal?: () => void;
  compact?: boolean;
}

export const UpiInvoiceWidget: React.FC<UpiInvoiceWidgetProps> = ({
  upiId,
  payeeName,
  amount,
  currency = '₹',
  invoiceNumber,
  onOpenUpiModal,
  compact = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const cleanUpiId = upiId?.trim() || '';

  const upiUri = buildUpiUri({
    upiId: cleanUpiId,
    payeeName: payeeName || 'Merchant',
    amount,
    currency,
    invoiceNumber,
  });

  useEffect(() => {
    let isMounted = true;
    if (cleanUpiId) {
      generateUpiQrDataUrl(upiUri, 200).then((url) => {
        if (isMounted) setQrDataUrl(url);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [upiUri, cleanUpiId]);

  if (!cleanUpiId) return null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cleanUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/30 rounded-xl p-3 sm:p-4 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 w-full sm:w-auto">
        {/* Clickable Mini QR */}
        <div
          onClick={onOpenUpiModal}
          className="relative bg-white p-1.5 rounded-lg border border-orange-300 shadow-xs shrink-0 cursor-pointer group hover:border-orange-500 transition-all"
          title="Click to expand QR Code & Pay"
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="UPI QR Code"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-100 flex items-center justify-center rounded">
              <QrCode className="w-6 h-6 text-zinc-400" />
            </div>
          )}
          <span className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[8px] font-bold text-center py-0.5 rounded-b opacity-0 group-hover:opacity-100 transition-opacity">
            ENLARGE
          </span>
        </div>

        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase tracking-wider text-[10px] text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-2 py-0.5 rounded">
              UPI Instant Payment
            </span>
            <span className="text-[10px] text-[var(--muted-foreground)]">0% Fee</span>
          </div>

          <div className="font-mono font-bold text-xs text-[var(--foreground)] truncate flex items-center gap-1.5">
            <span>{cleanUpiId}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 hover:bg-orange-500/10 text-orange-600 rounded transition-colors cursor-pointer"
              title="Copy UPI ID"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          <p className="text-[11px] text-[var(--muted-foreground)] leading-tight">
            Scan with Google Pay, PhonePe, Paytm, CRED, or BHIM.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
        <button
          type="button"
          onClick={onOpenUpiModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-colors cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Pay via UPI</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
