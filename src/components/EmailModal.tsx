import React, { useState } from 'react';
import { InvoiceData, BrandSettings } from '../types';
import { X, Mail, Send, Check, Copy, Sparkles } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
  brand: BrandSettings;
  onSendSuccess: (invoiceId: string) => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  invoice,
  brand,
  onSendSuccess,
}) => {
  const [recipient, setRecipient] = useState(invoice?.clientEmail || '');
  const [subject, setSubject] = useState(
    `Invoice ${invoice?.invoiceNumber || ''} from ${brand.brandName || 'Ledgerly'}`
  );
  const [message, setMessage] = useState(
    `Hi ${invoice?.clientName || 'there'},\n\nPlease find attached your invoice ${
      invoice?.invoiceNumber
    } for ${invoice?.currency}${invoice?.items
      .reduce((a, b) => a + b.quantity * b.rate, 0)
      .toLocaleString()}.\n\nDue Date: ${invoice?.dueDate}\n\nYou can view and pay your invoice online at:\n${
      window.location.origin
    }/#invoice-${invoice?.invoiceNumber}\n\nThank you for your business!\nBest regards,\n${
      brand.brandName || 'Ledgerly'
    }`
  );

  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state when invoice changes
  React.useEffect(() => {
    if (invoice) {
      setRecipient(invoice.clientEmail);
      setSubject(`Invoice ${invoice.invoiceNumber} from ${brand.brandName}`);
      const total = invoice.items.reduce((a, b) => a + b.quantity * b.rate, 0);
      setMessage(
        `Hi ${invoice.clientName},\n\nPlease find attached your invoice ${
          invoice.invoiceNumber
        } for ${invoice.currency}${total.toLocaleString()}.\n\nDue Date: ${
          invoice.dueDate
        }\n\nYou can review your invoice online at:\n${
          window.location.origin
        }/#invoice-${invoice.invoiceNumber}\n\nThank you for your business!\nBest regards,\n${
          brand.brandName
        }`
      );
    }
  }, [invoice, brand]);

  if (!isOpen || !invoice) return null;

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      onSendSuccess(invoice.id || invoice.invoiceNumber);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/#invoice-${invoice.invoiceNumber}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2320]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E3DED6] rounded-lg max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E3DED6] bg-[#FBF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#7A1E2B]" />
            <h3 className="font-bold text-sm text-[#2B2320]">
              Email Invoice {invoice.invoiceNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8A8177] hover:text-[#2B2320] rounded hover:bg-[#EDEAE5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {sentSuccess ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 bg-[#EAF3EC] text-[#3F7A4E] rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#2B2320]">
                Invoice Email Sent Successfully!
              </h4>
              <p className="text-[#8A8177]">
                Marked invoice status as <strong>Sent</strong>.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="font-semibold text-[#8A8177] block mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full p-2.5 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#8A8177] block mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#8A8177] block mb-1">
                  Email Message Body
                </label>
                <textarea
                  rows={7}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320] font-sans"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-[#E3DED6] flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E3DED6] rounded text-[#2B2320] hover:bg-[#EDEAE5] font-semibold"
                >
                  {copiedLink ? (
                    <Check className="w-3.5 h-3.5 text-[#3F7A4E]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedLink ? 'Link Copied' : 'Copy Direct Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || !recipient}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded bg-[#7A1E2B] shadow hover:opacity-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? 'Sending Email...' : 'Send Invoice Now'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
