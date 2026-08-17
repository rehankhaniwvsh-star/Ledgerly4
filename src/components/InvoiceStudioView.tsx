import React, { useState, useEffect } from 'react';
import { InvoiceData, InvoiceItem, BrandSettings } from '../types';
import {
  ArrowLeft,
  Plus,
  Printer,
  Download,
  Share2,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Eye,
  Copy,
  Check,
  Mail,
  Sparkles,
} from 'lucide-react';
import { downloadInvoicePdf } from '../utils/pdfExport';
import { BrandLogo, ReceiptLogoIcon } from './BrandLogo';

interface InvoiceStudioViewProps {
  brand: BrandSettings;
  invoices: InvoiceData[];
  selectedInvoiceId: string | null;
  onBackToLanding: () => void;
  onSaveInvoice: (invoice: InvoiceData) => void;
  onDeleteInvoice: (id: string) => void;
  onSelectInvoiceById: (id: string) => void;
  onCreateNew: () => void;
  onOpenEmail: (invoice: InvoiceData) => void;
}

export const InvoiceStudioView: React.FC<InvoiceStudioViewProps> = ({
  brand,
  invoices,
  selectedInvoiceId,
  onBackToLanding,
  onSaveInvoice,
  onDeleteInvoice,
  onSelectInvoiceById,
  onCreateNew,
  onOpenEmail,
}) => {
  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    const found = invoices.find(
      (i) => i.id === selectedInvoiceId || i.invoiceNumber === selectedInvoiceId
    );
    if (found) return found;
    return invoices[0] || {
      id: `inv-${Date.now()}`,
      businessName: brand.brandName || 'Alex.sam.co',
      businessEmail: brand.contactEmail || 'hello@alex.sam.co',
      businessLogoLetter: brand.logoLetter || 'A',
      clientName: 'Vionne',
      clientEmail: 'billing@vionne.co',
      invoiceNumber: 'INV-0042',
      issueDate: '2026-07-01',
      dueDate: '2026-07-02',
      currency: '₹',
      status: 'Paid',
      taxRate: 5,
      discountAmount: 10,
      themeColor: brand.primaryColor || '#7A1E2B',
      templateStyle: 'Modern',
      notes: 'Thank you for choosing Payment received with thanks.',
      items: [
        { id: 'item-1', description: 'Management & marketing', quantity: 1, rate: 31999 },
        { id: 'item-2', description: 'Landing page dev & responsive setup', quantity: 1, rate: 29999 },
      ],
    };
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isClientViewMode, setIsClientViewMode] = useState(false);

  // Sync state when selected invoice ID changes or external list updates
  useEffect(() => {
    if (selectedInvoiceId) {
      const found = invoices.find(
        (i) => i.id === selectedInvoiceId || i.invoiceNumber === selectedInvoiceId
      );
      if (found) {
        setInvoice(found);
      }
    }
  }, [selectedInvoiceId, invoices]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculations
  const subtotal = (invoice.items || []).reduce(
    (acc, i) => acc + (i.quantity || 1) * (i.rate || 0),
    0
  );
  const taxAmount = (subtotal * (invoice.taxRate || 0)) / 100;
  const discount = invoice.discountAmount || 0;
  const grandTotal = Math.max(0, subtotal + taxAmount - discount);

  // Item modifications
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: 'New Project Deliverable',
      quantity: 1,
      rate: 5000,
    };
    setInvoice({ ...invoice, items: [...invoice.items, newItem] });
  };

  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setInvoice({
      ...invoice,
      items: invoice.items.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    });
  };

  const handleRemoveItem = (id: string) => {
    if (invoice.items.length <= 1) {
      showToast('Invoice must have at least one line item');
      return;
    }
    setInvoice({
      ...invoice,
      items: invoice.items.filter((i) => i.id !== id),
    });
  };

  // Actions
  const handleSave = () => {
    onSaveInvoice(invoice);
    showToast('Invoice saved successfully!');
  };

  const handleDownloadPdf = () => {
    try {
      downloadInvoicePdf(invoice, brand.brandName);
      showToast('Downloading PDF file...');
    } catch (err) {
      console.error('PDF error:', err);
      showToast('Printing document...');
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareLink = () => {
    const link = `${window.location.origin}/#invoice-${invoice.invoiceNumber}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showToast('Invoice link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleStatusChange = (newStatus: InvoiceData['status']) => {
    const updated = { ...invoice, status: newStatus };
    setInvoice(updated);
    onSaveInvoice(updated);
    showToast(`Status updated to ${newStatus}`);
  };

  const calculateInvoiceTotalFormatted = (inv: InvoiceData) => {
    const sub = inv.items.reduce((a, b) => a + b.quantity * b.rate, 0);
    const tax = (sub * (inv.taxRate || 0)) / 100;
    const tot = Math.max(0, sub + tax - (inv.discountAmount || 0));
    return `${inv.currency || '₹'}${tot.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pb-16">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[var(--foreground)] text-[var(--background)] text-xs px-4 py-2.5 rounded shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 space-y-6">
        {/* Top Navigation & Action Toolbar */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left group: Brand Icon, Back button, Dropdown Selector, New Button */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-2 text-xs font-bold text-[var(--foreground)] hover:text-orange-600 px-2.5 py-1.5 rounded hover:bg-[var(--muted)] transition-colors cursor-pointer group"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-orange-600" />
              <ReceiptLogoIcon sizeClass="w-6 h-6 rounded-lg" showSparkle={false} />
              <span className="font-extrabold">{brand.brandName || 'Invoiceify'}</span>
            </button>

            <div className="h-4 w-px bg-[var(--border)] hidden sm:block" />

            {/* Dropdown Invoice Selector */}
            <select
              value={invoice.id || invoice.invoiceNumber}
              onChange={(e) => onSelectInvoiceById(e.target.value)}
              className="px-3 py-1.5 bg-[var(--background)] border border-[var(--border)] rounded text-xs font-bold text-[var(--foreground)] cursor-pointer focus:outline-none focus:border-[var(--primary)]"
            >
              {invoices.map((inv) => (
                <option key={inv.id || inv.invoiceNumber} value={inv.id || inv.invoiceNumber}>
                  {inv.invoiceNumber} — {inv.clientName} ({calculateInvoiceTotalFormatted(inv)})
                </option>
              ))}
            </select>

            <button
              onClick={onCreateNew}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--muted)] rounded transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          {/* Right group: Status Badges & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            {/* Status Selector Pills */}
            <div className="flex items-center gap-1 bg-[var(--background)] p-1 rounded border border-[var(--border)]">
              <span className="text-[10px] font-bold text-[var(--muted-foreground)] px-1 uppercase tracking-wider hidden sm:inline">
                Status:
              </span>
              {(['Draft', 'Sent', 'Overdue', 'Paid'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    invoice.status === st
                      ? st === 'Paid'
                        ? 'bg-emerald-600 text-white'
                        : st === 'Sent'
                        ? 'bg-blue-600 text-white'
                        : st === 'Overdue'
                        ? 'bg-red-600 text-white'
                        : 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleShareLink}
              className="btn-shader-secondary inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer"
              title="Copy shareable invoice link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500 btn-icon-hover-bounce" /> : <Share2 className="w-3.5 h-3.5 btn-icon-hover-bounce" />}
              <span>Share Link</span>
            </button>

            <button
              onClick={() => setIsClientViewMode(!isClientViewMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border cursor-pointer ${
                isClientViewMode
                  ? 'btn-shader-primary'
                  : 'btn-shader-secondary'
              }`}
            >
              <Eye className="w-3.5 h-3.5 btn-icon-hover-bounce" />
              <span>{isClientViewMode ? 'Editor View' : 'Client View'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn-shader-secondary inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[var(--primary)] btn-icon-hover-bounce" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="btn-shader-emerald inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold shadow-sm cursor-pointer"
              title="Download PDF file directly"
            >
              <Download className="w-3.5 h-3.5 btn-icon-hover-bounce" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleSave}
              className="btn-shader-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 btn-icon-hover-bounce" />
              <span>Save</span>
            </button>

            <button
              onClick={() => onDeleteInvoice(invoice.id || invoice.invoiceNumber)}
              className="p-1.5 text-[#8A8177] hover:text-red-600 rounded hover:bg-[#F8F6F0]"
              title="Delete Invoice"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isClientViewMode && (
          /* Form Editor Section: "Invoice Details Editor" */
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--primary)]" />
                <h2 className="font-bold text-sm text-[var(--foreground)]">
                  Invoice Details Editor
                </h2>
              </div>
              <span className="font-mono text-xs text-[var(--muted-foreground)] font-semibold">
                {invoice.invoiceNumber}
              </span>
            </div>

            {/* Grid 1: Invoice Number, Currency, Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="font-semibold text-[var(--muted-foreground)] block mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) =>
                    setInvoice({ ...invoice, invoiceNumber: e.target.value })
                  }
                  className="w-full p-2.5 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)] font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-[var(--muted-foreground)] block mb-1">
                  Currency Symbol
                </label>
                <select
                  value={invoice.currency}
                  onChange={(e) =>
                    setInvoice({ ...invoice, currency: e.target.value })
                  }
                  className="w-full p-2.5 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)] font-semibold"
                >
                  <option value="₹">₹ (INR)</option>
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[var(--muted-foreground)] block mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={invoice.issueDate}
                  onChange={(e) =>
                    setInvoice({ ...invoice, issueDate: e.target.value })
                  }
                  className="w-full p-2.5 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="font-semibold text-[var(--muted-foreground)] block mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) =>
                    setInvoice({ ...invoice, dueDate: e.target.value })
                  }
                  className="w-full p-2.5 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)]"
                />
              </div>
            </div>

            {/* Grid 2: Sender & Client info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <label className="font-semibold text-[var(--muted-foreground)] block">
                  Your Company (Sender)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={invoice.businessName}
                    placeholder="Sender Name"
                    onChange={(e) =>
                      setInvoice({ ...invoice, businessName: e.target.value })
                    }
                    className="p-2.5 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)]"
                  />
                  <input
                    type="email"
                    value={invoice.businessEmail}
                    placeholder="Sender Email"
                    onChange={(e) =>
                      setInvoice({ ...invoice, businessEmail: e.target.value })
                    }
                    className="p-2.5 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-[var(--muted-foreground)] block">
                  Client Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={invoice.clientName}
                    placeholder="Client Name"
                    onChange={(e) =>
                      setInvoice({ ...invoice, clientName: e.target.value })
                    }
                    className="p-2.5 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)]"
                  />
                  <input
                    type="email"
                    value={invoice.clientEmail}
                    placeholder="Client Email"
                    onChange={(e) =>
                      setInvoice({ ...invoice, clientEmail: e.target.value })
                    }
                    className="p-2.5 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)]"
                  />
                </div>
              </div>
            </div>

            {/* Line Items Editor */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[var(--muted-foreground)] uppercase text-[11px] tracking-wider">
                  Line Items
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {invoice.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[var(--background)] border border-[var(--border)] p-3 rounded space-y-2"
                  >
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, 'description', e.target.value)
                      }
                      className="w-full p-2 bg-[var(--card)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                      placeholder="Item Description / Service Name"
                    />

                    <div className="grid grid-cols-3 sm:grid-cols-12 gap-2 items-center text-xs">
                      <div className="col-span-1 sm:col-span-4">
                        <span className="text-[10px] text-[var(--muted-foreground)] block">Qty</span>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              'quantity',
                              Number(e.target.value) || 1
                            )
                          }
                          className="w-full p-1.5 bg-[var(--card)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-4">
                        <span className="text-[10px] text-[var(--muted-foreground)] block">
                          Rate ({invoice.currency})
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              'rate',
                              Number(e.target.value) || 0
                            )
                          }
                          className="w-full p-1.5 bg-[var(--card)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-3 text-right">
                        <span className="text-[10px] text-[var(--muted-foreground)] block">Amount</span>
                        <div className="font-mono font-bold text-sm text-[var(--foreground)]">
                          {invoice.currency}
                          {(item.quantity * item.rate).toLocaleString()}
                        </div>
                      </div>

                      <div className="col-span-1 text-center pt-3 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-[var(--muted-foreground)] hover:text-red-600 rounded hover:bg-[var(--muted)] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid 3: Tax, Discount, Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="font-semibold text-[var(--muted-foreground)] block mb-1">
                  Tax (%)
                </label>
                <input
                  type="number"
                  min={0}
                  value={invoice.taxRate}
                  onChange={(e) =>
                    setInvoice({ ...invoice, taxRate: Number(e.target.value) || 0 })
                  }
                  className="w-full p-2.5 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="font-semibold text-[var(--muted-foreground)] block mb-1">
                  Discount ({invoice.currency})
                </label>
                <input
                  type="number"
                  min={0}
                  value={invoice.discountAmount}
                  onChange={(e) =>
                    setInvoice({
                      ...invoice,
                      discountAmount: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2.5 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-[var(--muted-foreground)] block mb-1">
                  Invoice Terms / Notes
                </label>
                <textarea
                  rows={2}
                  value={invoice.notes}
                  onChange={(e) =>
                    setInvoice({ ...invoice, notes: e.target.value })
                  }
                  className="w-full p-2.5 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Live Printable Document Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 sm:p-10 shadow-md space-y-8 print-invoice-modal">
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded text-[var(--primary-foreground)] font-extrabold flex items-center justify-center text-lg shadow-sm bg-[var(--primary)]"
              >
                {invoice.businessLogoLetter || brand.logoLetter || 'A'}
              </div>
              <div>
                <h1 className="font-bold text-lg text-[var(--foreground)]">
                  {invoice.businessName || 'Alex.sam.co'}
                </h1>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {invoice.businessEmail || 'hello@alex.sam.co'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono font-bold text-lg text-[var(--foreground)]">
                {invoice.invoiceNumber}
              </div>
              <span
                className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 ${
                  invoice.status === 'Paid'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : invoice.status === 'Sent'
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : invoice.status === 'Overdue'
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                    : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                }`}
              >
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Billed To & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">
                BILLED TO
              </span>
              <div className="font-bold text-[var(--foreground)] text-sm">
                {invoice.clientName}
              </div>
              <div className="text-[var(--muted-foreground)]">{invoice.clientEmail}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-right sm:text-right">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">
                  ISSUE DATE
                </span>
                <div className="font-mono text-[var(--foreground)] font-semibold">
                  {invoice.issueDate}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">
                  DUE DATE
                </span>
                <div className="font-mono text-[var(--foreground)] font-semibold">
                  {invoice.dueDate}
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-[var(--border)] rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--muted)]/50 border-b border-[var(--border)] font-bold text-[var(--muted-foreground)] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">DESCRIPTION</th>
                  <th className="p-3 text-center w-16">QTY</th>
                  <th className="p-3 text-right w-28">RATE</th>
                  <th className="p-3 text-right w-32">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--muted)]/30">
                    <td className="p-3 font-semibold text-[var(--foreground)]">
                      {item.description}
                    </td>
                    <td className="p-3 text-center text-[var(--muted-foreground)]">
                      {item.quantity}
                    </td>
                    <td className="p-3 text-right font-mono text-[var(--foreground)]">
                      {invoice.currency}
                      {item.rate.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[var(--foreground)]">
                      {invoice.currency}
                      {(item.quantity * item.rate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col items-end space-y-2 text-xs pt-2">
            <div className="w-full sm:w-72 space-y-2">
              <div className="flex justify-between text-[var(--muted-foreground)]">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-[var(--foreground)]">
                  {invoice.currency}
                  {subtotal.toLocaleString()}
                </span>
              </div>

              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span className="font-mono text-[var(--foreground)]">
                    +{invoice.currency}
                    {taxAmount.toLocaleString()}
                  </span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono font-semibold">
                    -{invoice.currency}
                    {discount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="h-px bg-[var(--border)] my-2"></div>

              <div className="flex justify-between text-base font-bold text-[var(--foreground)]">
                <span>Total Due</span>
                <span className="font-mono text-lg text-[var(--primary)]">
                  {invoice.currency}
                  {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          {invoice.notes && (
            <div className="bg-[var(--muted)]/50 p-4 border border-[var(--border)] rounded text-xs space-y-1">
              <span className="font-bold text-[var(--muted-foreground)] block text-[11px]">
                Notes & Terms:
              </span>
              <p className="text-[var(--foreground)] leading-relaxed">{invoice.notes}</p>
            </div>
          )}

          {/* Footer Watermark */}
          <div className="text-center pt-4 border-t border-[var(--border)] text-[11px] text-[var(--muted-foreground)]">
            Powered by {brand.brandName || 'Invoiceify'} • Professional Branded Invoicing
          </div>
        </div>
      </div>
    </div>
  );
};
