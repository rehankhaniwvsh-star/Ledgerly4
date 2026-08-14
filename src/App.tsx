import React, { useState, useEffect } from 'react';
import { defaultCmsContent } from './data/defaultCmsContent';
import { initialInvoices } from './data/initialInvoices';
import { CmsContent, InvoiceData } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { AboutSection } from './components/AboutSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FaqSection } from './components/FaqSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { InvoiceStudioView } from './components/InvoiceStudioView';
import { DashboardModal } from './components/DashboardModal';
import { EmailModal } from './components/EmailModal';
import { CmsAdminModal } from './components/CmsAdminModal';
import { downloadInvoicePdf } from './utils/pdfExport';

const LOCAL_STORAGE_CMS_KEY = 'invoiceify_cms_data_v1';
const LOCAL_STORAGE_INVOICES_KEY = 'invoiceify_invoices_data_v1';

export default function App() {
  const [cms, setCms] = useState<CmsContent>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CMS_KEY) || localStorage.getItem('ledgerly_cms_data_v1');
      if (saved) {
        let parsed = JSON.parse(saved);
        // Clean up legacy brand name if present
        if (parsed.brand?.brandName === 'Ledgerly') {
          parsed.brand.brandName = 'Invoiceify';
          if (parsed.brand.contactEmail === 'hello@ledgerly.app') {
            parsed.brand.contactEmail = 'hello@invoiceify.app';
          }
          if (parsed.brand.logoLetter === 'L') {
            parsed.brand.logoLetter = 'I';
          }
          if (parsed.about?.eyebrow === 'About Ledgerly') {
            parsed.about.eyebrow = 'About Invoiceify';
          }
          if (typeof parsed.about?.paragraph1 === 'string') {
            parsed.about.paragraph1 = parsed.about.paragraph1.replace(/Ledgerly/g, 'Invoiceify');
          }
          if (typeof parsed.faqs?.subtitle === 'string') {
            parsed.faqs.subtitle = parsed.faqs.subtitle.replace(/Ledgerly/g, 'Invoiceify');
          }
        }
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to load saved CMS data from localStorage:', err);
    }
    return defaultCmsContent;
  });

  const [invoices, setInvoices] = useState<InvoiceData[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_INVOICES_KEY) || localStorage.getItem('ledgerly_invoices_data_v1');
      if (saved) {
        let parsed: InvoiceData[] = JSON.parse(saved);
        parsed = parsed.map((inv) => ({
          ...inv,
          businessName: inv.businessName === 'Ledgerly Studio' ? 'Invoiceify Studio' : inv.businessName,
          businessEmail: inv.businessEmail === 'billing@ledgerly.app' ? 'billing@invoiceify.app' : inv.businessEmail,
          businessLogoLetter: inv.businessLogoLetter === 'L' ? 'I' : inv.businessLogoLetter,
        }));
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to load saved invoices from localStorage:', err);
    }
    return initialInvoices;
  });

  const [currentView, setCurrentView] = useState<'landing' | 'studio'>('landing');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    initialInvoices[0]?.id || 'inv-101'
  );

  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [cmsAdminOpen, setCmsAdminOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  // Synchronize browser tab title and Google Search Console meta tag with CMS brand settings
  useEffect(() => {
    if (cms.brand?.brandName) {
      document.title = `${cms.brand.brandName} — ${
        cms.brand.tagline || 'Branded invoicing for freelancers and agencies'
      }`;
    }

    // Dynamic Google Search Console meta tag injection
    if (cms.brand?.googleSiteVerification) {
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', cms.brand.googleSiteVerification);
    }
  }, [cms.brand]);

  // Persist invoices to localStorage
  const saveInvoicesToStorage = (updatedList: InvoiceData[]) => {
    setInvoices(updatedList);
    try {
      localStorage.setItem(LOCAL_STORAGE_INVOICES_KEY, JSON.stringify(updatedList));
    } catch (err) {
      console.error('Failed to save invoices to localStorage:', err);
    }
  };

  const handleSaveInvoice = (updatedInvoice: InvoiceData) => {
    const existingIndex = invoices.findIndex(
      (i) => i.id === updatedInvoice.id || i.invoiceNumber === updatedInvoice.invoiceNumber
    );

    let updatedList: InvoiceData[];
    if (existingIndex >= 0) {
      updatedList = [...invoices];
      updatedList[existingIndex] = updatedInvoice;
    } else {
      updatedList = [updatedInvoice, ...invoices];
    }

    saveInvoicesToStorage(updatedList);
    setSelectedInvoiceId(updatedInvoice.id || updatedInvoice.invoiceNumber);
  };

  const handleUpdateInvoiceStatus = (id: string, newStatus: InvoiceData['status']) => {
    const updatedList = invoices.map((inv) =>
      inv.id === id || inv.invoiceNumber === id ? { ...inv, status: newStatus } : inv
    );
    saveInvoicesToStorage(updatedList);
  };

  const handleDeleteInvoice = (id: string) => {
    const updatedList = invoices.filter(
      (inv) => inv.id !== id && inv.invoiceNumber !== id
    );
    saveInvoicesToStorage(updatedList);
    if (updatedList.length > 0) {
      setSelectedInvoiceId(updatedList[0].id || updatedList[0].invoiceNumber);
    } else {
      handleCreateNewInvoice();
    }
  };

  const handleDuplicateInvoice = (invoice: InvoiceData) => {
    const newInvoice: InvoiceData = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-00${Math.floor(40 + Math.random() * 50)}`,
      status: 'Draft',
      clientName: `${invoice.clientName} (Copy)`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    };
    saveInvoicesToStorage([newInvoice, ...invoices]);
    setSelectedInvoiceId(newInvoice.id);
    setCurrentView('studio');
  };

  const handleSelectInvoiceForEdit = (invoice: InvoiceData) => {
    setSelectedInvoiceId(invoice.id || invoice.invoiceNumber);
    setDashboardOpen(false);
    setCurrentView('studio');
  };

  const handleCreateNewInvoice = () => {
    const newInv: InvoiceData = {
      id: `inv-${Date.now()}`,
      businessName: cms.brand.brandName || 'Alex.sam.co',
      businessEmail: cms.brand.contactEmail || 'hello@alex.sam.co',
      businessLogoLetter: cms.brand.logoLetter || 'A',
      clientName: 'New Client',
      clientEmail: 'client@example.com',
      invoiceNumber: `INV-00${Math.floor(50 + Math.random() * 45)}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      currency: '₹',
      status: 'Draft',
      taxRate: 5,
      discountAmount: 0,
      themeColor: cms.brand.primaryColor || '#7A1E2B',
      templateStyle: 'Modern',
      notes: 'Thank you for your business.',
      items: [
        { id: `item-${Date.now()}`, description: 'Web design & Development', quantity: 1, rate: 25000 },
      ],
    };

    saveInvoicesToStorage([newInv, ...invoices]);
    setSelectedInvoiceId(newInv.id);
    setDashboardOpen(false);
    setCurrentView('studio');
  };

  const handleOpenEmailModal = (invoice: InvoiceData) => {
    setSelectedInvoiceId(invoice.id || invoice.invoiceNumber);
    setEmailModalOpen(true);
  };

  const handleEmailSuccess = (invoiceId: string) => {
    handleUpdateInvoiceStatus(invoiceId, 'Sent');
  };

  const handleDownloadPdf = (invoice: InvoiceData) => {
    downloadInvoicePdf(invoice, cms.brand.brandName);
  };

  const handleSaveCms = (updated: CmsContent) => {
    setCms(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_CMS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save CMS state to localStorage:', err);
    }
  };

  const handleResetCms = () => {
    setCms(defaultCmsContent);
    try {
      localStorage.removeItem(LOCAL_STORAGE_CMS_KEY);
    } catch (err) {
      console.error('Failed to clear CMS localStorage:', err);
    }
  };

  const activeInvoice =
    invoices.find((i) => i.id === selectedInvoiceId || i.invoiceNumber === selectedInvoiceId) ||
    invoices[0];

  return (
    <div
      className="min-h-screen text-[var(--foreground)] bg-[var(--background)] selection:bg-[var(--accent)] selection:text-[var(--primary)]"
    >
      {/* Universal Top Header Bar */}
      <Header
        brand={cms.brand}
        onOpenCms={() => setCmsAdminOpen(true)}
        onOpenGenerator={handleCreateNewInvoice}
        onOpenDashboard={() => setDashboardOpen(true)}
        isAdminOpen={cmsAdminOpen}
      />

      {currentView === 'studio' ? (
        /* Full Screen Dedicated Invoice Studio Page (Matches User Screenshot!) */
        <InvoiceStudioView
          brand={cms.brand}
          invoices={invoices}
          selectedInvoiceId={selectedInvoiceId}
          onBackToLanding={() => setCurrentView('landing')}
          onSaveInvoice={handleSaveInvoice}
          onDeleteInvoice={handleDeleteInvoice}
          onSelectInvoiceById={(id) => setSelectedInvoiceId(id)}
          onCreateNew={handleCreateNewInvoice}
          onOpenEmail={handleOpenEmailModal}
        />
      ) : (
        /* Landing Page View */
        <>
          <HeroSection
            hero={cms.hero}
            brand={cms.brand}
            onOpenGenerator={handleCreateNewInvoice}
            onOpenDashboard={() => setDashboardOpen(true)}
            onOpenCms={() => setCmsAdminOpen(true)}
          />

          <FeaturesSection
            features={cms.features}
            primaryColor={cms.brand.primaryColor}
          />

          <AboutSection
            about={cms.about}
            primaryColor={cms.brand.primaryColor}
          />

          <HowItWorksSection
            howItWorks={cms.howItWorks}
            primaryColor={cms.brand.primaryColor}
          />

          <FaqSection
            faqs={cms.faqs}
            primaryColor={cms.brand.primaryColor}
          />

          <TestimonialsSection
            testimonials={cms.testimonials}
            primaryColor={cms.brand.primaryColor}
          />

          <CtaSection
            cta={cms.cta}
            brand={cms.brand}
            onOpenGenerator={handleCreateNewInvoice}
          />

          <Footer
            brand={cms.brand}
            onOpenCms={() => setCmsAdminOpen(true)}
            onOpenGenerator={handleCreateNewInvoice}
          />
        </>
      )}

      {/* Live Invoices Dashboard Modal */}
      <DashboardModal
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        invoices={invoices}
        brand={cms.brand}
        onSelectInvoice={handleSelectInvoiceForEdit}
        onCreateNewInvoice={handleCreateNewInvoice}
        onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
        onDeleteInvoice={handleDeleteInvoice}
        onDuplicateInvoice={handleDuplicateInvoice}
        onDownloadPdf={handleDownloadPdf}
        onEmailInvoice={handleOpenEmailModal}
      />

      {/* Email Invoice Share Modal */}
      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        invoice={activeInvoice || null}
        brand={cms.brand}
        onSendSuccess={handleEmailSuccess}
      />

      {/* Live CMS Admin Modal */}
      <CmsAdminModal
        cms={cms}
        isOpen={cmsAdminOpen}
        onClose={() => setCmsAdminOpen(false)}
        onSave={handleSaveCms}
        onReset={handleResetCms}
      />
    </div>
  );
}
