import React, { useState, useRef } from 'react';
import { InvoiceData, InvoiceItem, BrandSettings } from '../types';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Copy,
  Check,
  X,
  Sparkles,
  Download,
  Mail,
  Maximize2,
  Minimize2,
  Save,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface InvoiceGeneratorDemoProps {
  brand: BrandSettings;
  isOpen: boolean;
  onClose: () => void;
  initialInvoice?: InvoiceData | null;
  onSaveInvoice: (invoice: InvoiceData) => void;
  onOpenEmail: (invoice: InvoiceData) => void;
  isFullscreenInitially?: boolean;
}

export const InvoiceGeneratorDemo: React.FC<InvoiceGeneratorDemoProps> = ({
  brand,
  isOpen,
  onClose,
  initialInvoice,
  onSaveInvoice,
  onOpenEmail,
  isFullscreenInitially = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(isFullscreenInitially);

  const printableRef = useRef<HTMLDivElement>(null);

  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    if (initialInvoice) return initialInvoice;
    return {
      id: `inv-${Date.now()}`,
      businessName: brand.brandName || 'Ledgerly Studio',
      businessEmail: brand.contactEmail || 'billing@ledgerly.app',
      businessLogoLetter: brand.logoLetter || 'L',
      clientName: 'Acme Corporation',
      clientEmail: 'billing@acme.corp',
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      currency: '₹',
      status: 'Paid',
      taxRate: 18,
      discountAmount: 0,
      themeColor: brand.primaryColor || '#7A1E2B',
      templateStyle: 'Modern',
      notes: 'Thank you for your business! Payment is due within 14 days.',
      items: [
        { id: '1', description: 'Brand Strategy & Identity System', quantity: 1, rate: 35000 },
        { id: '2', description: 'Responsive Web Application Development', quantity: 1, rate: 45000 },
      ],
    };
  });

  // Keep state updated if props change
  React.useEffect(() => {
    if (initialInvoice) {
      setInvoice(initialInvoice);
    }
    setIsFullscreen(isFullscreenInitially);
  }, [initialInvoice, isFullscreenInitially]);

  if (!isOpen) return null;

  // Invoice Math
  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.quantity * item.rate,
    0
  );
  const taxAmount = (subtotal * (invoice.taxRate || 0)) / 100;
  const grandTotal = Math.max(0, subtotal + taxAmount - (invoice.discountAmount || 0));

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: 'New Deliverable / Service',
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
      items: invoice.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleRemoveItem = (id: string) => {
    if (invoice.items.length <= 1) return;
    setInvoice({
      ...invoice,
      items: invoice.items.filter((item) => item.id !== id),
    });
  };

  // PDF Download powered by html2canvas + jsPDF
  const handleDownloadPdf = async () => {
    if (!printableRef.current) return;
    setDownloadingPdf(true);

    try {
      const element = printableRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.invoiceNumber}_${invoice.clientName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF canvas, falling back to print dialog:', err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleSave = () => {
    onSaveInvoice(invoice);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/#invoice-${invoice.invoiceNumber}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2320]/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div
        className={`bg-white border border-[#E3DED6] rounded-lg w-full flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'fixed inset-0 z-50 rounded-none h-screen'
            : 'max-w-5xl h-[92vh] max-h-[92vh] my-auto'
        }`}
      >
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 border-b border-[#E3DED6] bg-[#FBF9F6] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded text-white font-bold flex items-center justify-center text-xs"
              style={{ backgroundColor: invoice.themeColor || brand.primaryColor }}
            >
              {invoice.businessLogoLetter}
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#2B2320]">
                Invoice {invoice.invoiceNumber} — Live Editor
              </h3>
              <p className="text-[11px] text-[#8A8177]">
                Fully editable, customizable theme & downloadable PDF
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isSavedNotice && (
              <span className="text-xs font-semibold text-[#3F7A4E] bg-[#EAF3EC] px-2.5 py-1 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved to Dashboard!</span>
              </span>
            )}

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white rounded bg-[#7A1E2B] shadow-sm hover:opacity-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Invoice</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-[#E3DED6] text-[#2B2320] rounded hover:bg-[#EDEAE5] shadow-sm"
              title="Download crisp PDF file"
            >
              <Download className="w-3.5 h-3.5 text-[#3F7A4E]" />
              <span>{downloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={() => onOpenEmail(invoice)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-[#E3DED6] text-[#2B2320] rounded hover:bg-[#EDEAE5]"
              title="Send Invoice via Email"
            >
              <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Email Invoice</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-[#E3DED6] text-[#2B2320] rounded hover:bg-[#EDEAE5]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#3F7A4E]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>

            {/* Short vs Full Screen Toggle Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#EDEAE5] text-[#2B2320] rounded hover:bg-[#E3DED6]"
              title={isFullscreen ? 'Switch to Compact Short View' : 'Switch to Fullscreen View'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Short View</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#8A8177] hover:text-[#2B2320] rounded hover:bg-[#EDEAE5]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FBF9F6] space-y-6">
          {/* Controls Bar: Theme & Style selector */}
          <div className="bg-white border border-[#E3DED6] rounded-md p-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
            <div>
              <label className="text-xs font-semibold text-[#8A8177] block mb-1">
                Invoice Color Theme
              </label>
              <div className="flex items-center gap-2">
                {[
                  { name: 'Ruby', hex: '#7A1E2B' },
                  { name: 'Blue', hex: '#2563EB' },
                  { name: 'Green', hex: '#3F7A4E' },
                  { name: 'Gold', hex: '#A67C3D' },
                  { name: 'Charcoal', hex: '#2B2320' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setInvoice({ ...invoice, themeColor: c.hex })}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      invoice.themeColor === c.hex
                        ? 'border-black scale-110'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  ></button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8A8177] block mb-1">
                Template Layout Style
              </label>
              <select
                value={invoice.templateStyle || 'Modern'}
                onChange={(e) =>
                  setInvoice({
                    ...invoice,
                    templateStyle: e.target.value as InvoiceData['templateStyle'],
                  })
                }
                className="w-full p-1.5 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
              >
                <option value="Modern">Modern Branded</option>
                <option value="Classic">Classic Corporate</option>
                <option value="Minimal">Minimalist Clean</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8A8177] block mb-1">
                Invoice Status
              </label>
              <select
                value={invoice.status}
                onChange={(e) =>
                  setInvoice({
                    ...invoice,
                    status: e.target.value as InvoiceData['status'],
                  })
                }
                className="w-full p-1.5 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320] font-semibold"
              >
                <option value="Paid">Paid</option>
                <option value="Sent">Sent</option>
                <option value="Draft">Draft</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Printable Invoice Document Preview & Form Fields */}
          <div
            ref={printableRef}
            className="print-invoice-modal bg-white border border-[#E3DED6] rounded-lg p-6 sm:p-10 shadow-md max-w-4xl mx-auto space-y-8"
          >
            {/* Header / Brand Banner */}
            <div
              className="p-6 rounded-md flex flex-wrap items-center justify-between gap-4 text-white"
              style={{ backgroundColor: invoice.themeColor || brand.primaryColor }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-white text-[#2B2320] font-extrabold flex items-center justify-center text-base shadow">
                  {invoice.businessLogoLetter}
                </div>
                <div>
                  <input
                    type="text"
                    value={invoice.businessName}
                    onChange={(e) =>
                      setInvoice({ ...invoice, businessName: e.target.value })
                    }
                    className="bg-transparent font-bold text-lg text-white border-b border-white/30 focus:outline-none w-full"
                  />
                  <input
                    type="text"
                    value={invoice.businessEmail}
                    onChange={(e) =>
                      setInvoice({ ...invoice, businessEmail: e.target.value })
                    }
                    className="bg-transparent text-xs text-white/80 border-b border-white/20 focus:outline-none w-full mt-1"
                  />
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase font-semibold text-white/70 block">
                  INVOICE
                </span>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) =>
                    setInvoice({ ...invoice, invoiceNumber: e.target.value })
                  }
                  className="bg-transparent font-mono font-bold text-lg text-white text-right border-b border-white/30 focus:outline-none"
                />
              </div>
            </div>

            {/* Bill To & Dates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <span className="font-bold uppercase tracking-wider text-[#8A8177] block">
                  Billed To
                </span>
                <input
                  type="text"
                  value={invoice.clientName}
                  onChange={(e) =>
                    setInvoice({ ...invoice, clientName: e.target.value })
                  }
                  placeholder="Client Company Name"
                  className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded font-semibold text-[#2B2320]"
                />
                <input
                  type="email"
                  value={invoice.clientEmail}
                  onChange={(e) =>
                    setInvoice({ ...invoice, clientEmail: e.target.value })
                  }
                  placeholder="Client Email Address"
                  className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-[#8A8177]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[#8A8177] block mb-1">
                    Issue Date
                  </span>
                  <input
                    type="date"
                    value={invoice.issueDate}
                    onChange={(e) =>
                      setInvoice({ ...invoice, issueDate: e.target.value })
                    }
                    className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-[#2B2320]"
                  />
                </div>

                <div>
                  <span className="font-bold uppercase tracking-wider text-[#8A8177] block mb-1">
                    Due Date
                  </span>
                  <input
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) =>
                      setInvoice({ ...invoice, dueDate: e.target.value })
                    }
                    className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-[#2B2320]"
                  />
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase text-[#8A8177] tracking-wider">
                  Services & Deliverables
                </span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#7A1E2B] hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="border border-[#E3DED6] rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FBF9F6] border-b border-[#E3DED6] font-semibold text-[#8A8177]">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 w-20">Qty</th>
                      <th className="p-3 w-28">Rate</th>
                      <th className="p-3 w-28 text-right">Amount</th>
                      <th className="p-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3DED6]">
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FBF9F6]/50">
                        <td className="p-2.5">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                'description',
                                e.target.value
                              )
                            }
                            className="w-full p-1.5 bg-white border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                          />
                        </td>
                        <td className="p-2.5">
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
                            className="w-full p-1.5 bg-white border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                          />
                        </td>
                        <td className="p-2.5">
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
                            className="w-full p-1.5 bg-white border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                          />
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-[#2B2320]">
                          {invoice.currency}
                          {(item.quantity * item.rate).toLocaleString()}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-[#8A8177] hover:text-[#7A1E2B] p-1 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Math Totals & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E3DED6]">
              <div>
                <label className="text-xs font-semibold text-[#8A8177] block mb-1">
                  Payment Terms / Notes
                </label>
                <textarea
                  rows={3}
                  value={invoice.notes}
                  onChange={(e) =>
                    setInvoice({ ...invoice, notes: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                ></textarea>
              </div>

              <div className="space-y-2 bg-[#FBF9F6] p-4 border border-[#E3DED6] rounded text-xs">
                <div className="flex justify-between text-[#8A8177]">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-[#2B2320]">
                    {invoice.currency}
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#8A8177]">
                  <span>Tax Rate (%):</span>
                  <input
                    type="number"
                    min={0}
                    value={invoice.taxRate}
                    onChange={(e) =>
                      setInvoice({
                        ...invoice,
                        taxRate: Number(e.target.value) || 0,
                      })
                    }
                    className="w-16 p-1 bg-white border border-[#E3DED6] rounded text-right text-xs"
                  />
                </div>

                <div className="flex justify-between items-center text-[#8A8177]">
                  <span>Discount:</span>
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
                    className="w-20 p-1 bg-white border border-[#E3DED6] rounded text-right text-xs"
                  />
                </div>

                <div className="h-px bg-[#E3DED6] my-2"></div>

                <div className="flex justify-between text-base font-bold text-[#2B2320]">
                  <span>Total Amount:</span>
                  <span className="font-mono">
                    {invoice.currency}
                    {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
