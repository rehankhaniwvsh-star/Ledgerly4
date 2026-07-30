import React, { useState } from 'react';
import { InvoiceData, BrandSettings } from '../types';
import {
  X,
  Plus,
  Search,
  Filter,
  FileText,
  Download,
  Mail,
  Copy,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Palette,
  Eye,
  Maximize2,
  Sparkles,
} from 'lucide-react';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: InvoiceData[];
  brand: BrandSettings;
  onSelectInvoice: (invoice: InvoiceData, openFullscreen?: boolean) => void;
  onCreateNewInvoice: () => void;
  onUpdateInvoiceStatus: (id: string, status: InvoiceData['status']) => void;
  onDeleteInvoice: (id: string) => void;
  onDuplicateInvoice: (invoice: InvoiceData) => void;
  onDownloadPdf: (invoice: InvoiceData) => void;
  onEmailInvoice: (invoice: InvoiceData) => void;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  invoices,
  brand,
  onSelectInvoice,
  onCreateNewInvoice,
  onUpdateInvoiceStatus,
  onDeleteInvoice,
  onDuplicateInvoice,
  onDownloadPdf,
  onEmailInvoice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Paid' | 'Sent' | 'Draft' | 'Overdue'>('All');

  if (!isOpen) return null;

  // Compute Metrics
  const calculateTotal = (inv: InvoiceData) => {
    const subtotal = inv.items.reduce((acc, i) => acc + i.quantity * i.rate, 0);
    const tax = (subtotal * (inv.taxRate || 0)) / 100;
    return Math.max(0, subtotal + tax - (inv.discountAmount || 0));
  };

  const totalInvoiced = invoices.reduce((acc, inv) => acc + calculateTotal(inv), 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((acc, inv) => acc + calculateTotal(inv), 0);
  const totalPending = invoices
    .filter((inv) => inv.status === 'Sent')
    .reduce((acc, inv) => acc + calculateTotal(inv), 0);
  const totalOverdue = invoices
    .filter((inv) => inv.status === 'Overdue')
    .reduce((acc, inv) => acc + calculateTotal(inv), 0);

  // Filtered List
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || inv.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: InvoiceData['status']) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-[#EAF3EC] text-[#3F7A4E]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Paid</span>
          </span>
        );
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-[#EBF3FA] text-[#2563EB]">
            <Clock className="w-3.5 h-3.5" />
            <span>Sent</span>
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-[#FEE2E2] text-[#DC2626]">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Overdue</span>
          </span>
        );
      case 'Draft':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-[#F5F0EA] text-[#8A8177]">
            <FileText className="w-3.5 h-3.5" />
            <span>Draft</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2320]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-[#E3DED6] rounded-lg max-w-6xl w-full h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#E3DED6] bg-[#FBF9F6] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded text-white font-bold flex items-center justify-center text-sm shadow-sm"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {brand.logoLetter || 'L'}
            </div>
            <div>
              <h2 className="font-bold text-base text-[#2B2320]">
                {brand.brandName || 'Ledgerly'} Invoices Dashboard
              </h2>
              <p className="text-xs text-[#8A8177]">
                Manage existing invoices, track payments, filter statuses & themes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCreateNewInvoice}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded shadow-sm hover:opacity-95 transition-all"
              style={{ backgroundColor: brand.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Create New Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#8A8177] hover:text-[#2B2320] rounded hover:bg-[#EDEAE5]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FBF9F6]">
          {/* Metrics Summary Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E3DED6] rounded-md p-4 shadow-sm">
              <span className="text-xs text-[#8A8177] font-semibold uppercase tracking-wider block mb-1">
                Total Invoiced
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#2B2320]">
                ₹{totalInvoiced.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#8A8177] mt-1 block">
                {invoices.length} total records
              </span>
            </div>

            <div className="bg-white border border-[#E3DED6] rounded-md p-4 shadow-sm">
              <span className="text-xs text-[#3F7A4E] font-semibold uppercase tracking-wider block mb-1">
                Paid Revenue
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#3F7A4E]">
                ₹{totalPaid.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#3F7A4E] mt-1 block">
                {invoices.filter((i) => i.status === 'Paid').length} paid invoices
              </span>
            </div>

            <div className="bg-white border border-[#E3DED6] rounded-md p-4 shadow-sm">
              <span className="text-xs text-[#2563EB] font-semibold uppercase tracking-wider block mb-1">
                Pending / Sent
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#2563EB]">
                ₹{totalPending.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#2563EB] mt-1 block">
                {invoices.filter((i) => i.status === 'Sent').length} awaiting payment
              </span>
            </div>

            <div className="bg-white border border-[#E3DED6] rounded-md p-4 shadow-sm">
              <span className="text-xs text-[#DC2626] font-semibold uppercase tracking-wider block mb-1">
                Overdue Total
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#DC2626]">
                ₹{totalOverdue.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#DC2626] mt-1 block">
                {invoices.filter((i) => i.status === 'Overdue').length} requiring follow-up
              </span>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white border border-[#E3DED6] rounded-md p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {(['All', 'Paid', 'Sent', 'Draft', 'Overdue'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    activeFilter === filter
                      ? 'bg-[#7A1E2B] text-white shadow-sm'
                      : 'bg-[#FBF9F6] text-[#8A8177] border border-[#E3DED6] hover:bg-[#EDEAE5]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8177]" />
              <input
                type="text"
                placeholder="Search client, invoice #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320] focus:outline-none focus:border-[#7A1E2B]"
              />
            </div>
          </div>

          {/* Invoices List Table */}
          <div className="bg-white border border-[#E3DED6] rounded-md shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FBF9F6] border-b border-[#E3DED6] font-semibold text-[#8A8177] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Invoice #</th>
                    <th className="p-3.5">Client & Email</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date / Due</th>
                    <th className="p-3.5">Theme / Style</th>
                    <th className="p-3.5 text-right">Amount</th>
                    <th className="p-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3DED6]">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-[#8A8177] text-sm">
                        No invoices found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => {
                      const total = calculateTotal(inv);
                      return (
                        <tr
                          key={inv.id || inv.invoiceNumber}
                          className="hover:bg-[#FBF9F6]/80 transition-colors"
                        >
                          {/* Invoice # */}
                          <td className="p-3.5 font-mono font-bold text-[#2B2320]">
                            {inv.invoiceNumber}
                          </td>

                          {/* Client */}
                          <td className="p-3.5">
                            <div className="font-semibold text-[#2B2320]">
                              {inv.clientName}
                            </div>
                            <div className="text-[11px] text-[#8A8177]">
                              {inv.clientEmail}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-3.5">
                            <select
                              value={inv.status}
                              onChange={(e) =>
                                onUpdateInvoiceStatus(
                                  inv.id || inv.invoiceNumber,
                                  e.target.value as InvoiceData['status']
                                )
                              }
                              className="px-2 py-1 rounded text-xs font-semibold bg-transparent border border-[#E3DED6] cursor-pointer"
                            >
                              <option value="Paid">Paid</option>
                              <option value="Sent">Sent</option>
                              <option value="Draft">Draft</option>
                              <option value="Overdue">Overdue</option>
                            </select>
                          </td>

                          {/* Dates */}
                          <td className="p-3.5 text-[#8A8177]">
                            <div>Issued: {inv.issueDate}</div>
                            <div className="text-[11px] text-[#2B2320] font-medium">
                              Due: {inv.dueDate}
                            </div>
                          </td>

                          {/* Theme & Style */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                                style={{ backgroundColor: inv.themeColor || brand.primaryColor }}
                              ></span>
                              <span className="text-xs text-[#8A8177]">
                                {inv.templateStyle || 'Modern'}
                              </span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="p-3.5 text-right font-mono font-bold text-sm text-[#2B2320]">
                            {inv.currency}
                            {total.toLocaleString()}
                          </td>

                          {/* Actions */}
                          <td className="p-3.5">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => onSelectInvoice(inv, false)}
                                className="p-1.5 text-[#8A8177] hover:text-[#7A1E2B] rounded hover:bg-[#EDEAE5]"
                                title="Open Short Preview/Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => onSelectInvoice(inv, true)}
                                className="p-1.5 text-[#8A8177] hover:text-[#7A1E2B] rounded hover:bg-[#EDEAE5]"
                                title="Open Fullscreen View"
                              >
                                <Maximize2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => onDownloadPdf(inv)}
                                className="p-1.5 text-[#8A8177] hover:text-[#3F7A4E] rounded hover:bg-[#EDEAE5]"
                                title="Download PDF"
                              >
                                <Download className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => onEmailInvoice(inv)}
                                className="p-1.5 text-[#8A8177] hover:text-[#2563EB] rounded hover:bg-[#EDEAE5]"
                                title="Share via Email"
                              >
                                <Mail className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => onDuplicateInvoice(inv)}
                                className="p-1.5 text-[#8A8177] hover:text-[#2B2320] rounded hover:bg-[#EDEAE5]"
                                title="Duplicate Invoice"
                              >
                                <Copy className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => onDeleteInvoice(inv.id || inv.invoiceNumber)}
                                className="p-1.5 text-[#8A8177] hover:text-red-600 rounded hover:bg-[#EDEAE5]"
                                title="Delete Invoice"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
