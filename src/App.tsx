import React, { useState, useEffect } from 'react';
import { defaultCmsContent } from './data/defaultCmsContent';
import { initialInvoices } from './data/initialInvoices';
import { CmsContent, InvoiceData, UserProfile } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { AboutSection } from './components/AboutSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FaqSection } from './components/FaqSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AuthSection } from './components/AuthSection';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { InvoiceStudioView } from './components/InvoiceStudioView';
import { DashboardModal } from './components/DashboardModal';
import { EmailModal } from './components/EmailModal';
import { CmsAdminModal } from './components/CmsAdminModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { TermsPrivacyModal } from './components/TermsPrivacyModal';
import { SplashEntranceAnimation } from './components/SplashEntranceAnimation';
import { downloadInvoicePdf } from './utils/pdfExport';

const LOCAL_STORAGE_CMS_KEY = 'billnest_cms_data_v1';
const LOCAL_STORAGE_INVOICES_KEY = 'billnest_invoices_data_v1';
const LOCAL_STORAGE_ADMIN_AUTH_KEY = 'billnest_admin_auth_v1';
const LOCAL_STORAGE_USER_KEY = 'billnest_user_session_v1';

export default function App() {
  const [cms, setCms] = useState<CmsContent>(() => {
    try {
      const saved =
        localStorage.getItem(LOCAL_STORAGE_CMS_KEY) ||
        localStorage.getItem('invoiceify_cms_data_v1') ||
        localStorage.getItem('ledgerly_cms_data_v1');
      if (saved) {
        // Universal clean up of legacy brand name in all stored strings
        const cleansedJson = saved
          .replace(/Invoiceify/g, 'Billnest')
          .replace(/invoiceify/g, 'billnest')
          .replace(/Ledgerly/g, 'Billnest')
          .replace(/ledgerly/g, 'billnest');
        const parsed = JSON.parse(cleansedJson);
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to load saved CMS data from localStorage:', err);
    }
    return defaultCmsContent;
  });

  const [invoices, setInvoices] = useState<InvoiceData[]>(() => {
    try {
      const saved =
        localStorage.getItem(LOCAL_STORAGE_INVOICES_KEY) ||
        localStorage.getItem('invoiceify_invoices_data_v1') ||
        localStorage.getItem('ledgerly_invoices_data_v1');
      if (saved) {
        const cleansedJson = saved
          .replace(/Invoiceify/g, 'Billnest')
          .replace(/invoiceify/g, 'billnest')
          .replace(/Ledgerly/g, 'Billnest')
          .replace(/ledgerly/g, 'billnest');
        const parsed: InvoiceData[] = JSON.parse(cleansedJson);
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to load saved invoices from localStorage:', err);
    }
    return initialInvoices;
  });

  const [currentView, setCurrentView] = useState<'landing' | 'studio' | 'auth'>('landing');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    initialInvoices[0]?.id || 'inv-101'
  );

  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [cmsAdminOpen, setCmsAdminOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [adminAuthModalOpen, setAdminAuthModalOpen] = useState(false);
  const [termsPrivacyModalOpen, setTermsPrivacyModalOpen] = useState(false);
  const [termsPrivacyTab, setTermsPrivacyTab] = useState<'privacy' | 'terms'>('privacy');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [authSectionTab, setAuthSectionTab] = useState<'signin' | 'signup'>('signin');

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
      // If user provided a custom studio/business name, seamlessly brand their invoices
      if (
        user.businessName &&
        user.businessName !== 'Independent Studio' &&
        user.businessName !== 'Creative Studio' &&
        user.businessName !== 'Freelancer'
      ) {
        setCms((prev) => ({
          ...prev,
          brand: {
            ...prev.brand,
            brandName: user.businessName,
          },
        }));
      }
    } catch (err) {
      console.error('Failed to save user session:', err);
    }
    // Transition straight to the Invoice Studio workspace with their new profile active
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    } catch (err) {
      console.error('Failed to clear user session:', err);
    }
    setCurrentView('landing');
  };

  const handleOpenAuth = (tab: 'signin' | 'signup' = 'signin', asDedicatedView: boolean = true) => {
    setAuthSectionTab(tab);
    if (asDedicatedView) {
      setCurrentView('auth');
      try {
        window.history.pushState(null, '', tab === 'signup' ? '/signup' : '/signin');
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (currentView !== 'landing') {
        setCurrentView('landing');
      }
      setTimeout(() => {
        const el = document.getElementById('auth');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Handle CMS open request with security PIN protection
  const handleRequestOpenCms = () => {
    if (isAdminAuthenticated) {
      setCmsAdminOpen(true);
    } else {
      setAdminAuthModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_AUTH_KEY, 'true');
    } catch {}
    setAdminAuthModalOpen(false);
    setCmsAdminOpen(true);
  };

  const handleLockAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem(LOCAL_STORAGE_ADMIN_AUTH_KEY);
    } catch {}
    setCmsAdminOpen(false);
  };

  // Keyboard shortcut (Ctrl+Shift+A or Cmd+Shift+A) & URL Hash #admin listener for hidden owner access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleRequestOpenCms();
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        handleRequestOpenCms();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash === '#admin') {
      handleRequestOpenCms();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isAdminAuthenticated]);

  // Sitemap and Deep-Link URL Router
  useEffect(() => {
    const handleRouteFromUrl = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';

      if (path === '/create' || path === '/studio') {
        setCurrentView('studio');
      } else if (path === '/dashboard') {
        setDashboardOpen(true);
      } else if (path === '/signin' || path === '/login') {
        setCurrentView('auth');
        setAuthSectionTab('signin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '/signup' || path === '/register' || path === '/auth') {
        setCurrentView('auth');
        setAuthSectionTab('signup');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '/privacy') {
        setTermsPrivacyTab('privacy');
        setTermsPrivacyModalOpen(true);
      } else if (path === '/terms') {
        setTermsPrivacyTab('terms');
        setTermsPrivacyModalOpen(true);
      } else if (path === '/features' || path === '/templates') {
        setCurrentView('landing');
        setTimeout(() => {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (path === '/how-it-works') {
        setCurrentView('landing');
        setTimeout(() => {
          document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (path === '/about') {
        setCurrentView('landing');
        setTimeout(() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (path === '/faq') {
        setCurrentView('landing');
        setTimeout(() => {
          document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (path === '/pricing') {
        setCurrentView('landing');
        setTimeout(() => {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }

      // Check hash
      const hash = window.location.hash.toLowerCase();
      if (hash === '#signin' || hash === '#signin-tab') {
        setCurrentView('auth');
        setAuthSectionTab('signin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#signup' || hash === '#signup-tab') {
        setCurrentView('auth');
        setAuthSectionTab('signup');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#auth') {
        setCurrentView('landing');
        setTimeout(() => {
          document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };

    handleRouteFromUrl();
    window.addEventListener('popstate', handleRouteFromUrl);
    return () => window.removeEventListener('popstate', handleRouteFromUrl);
  }, []);

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
    const businessName = currentUser?.businessName || currentUser?.name || cms.brand.brandName || 'Billnest Studio';
    const businessEmail = currentUser?.email || cms.brand.contactEmail || 'billing@billnest.app';
    const businessLogoLetter = (currentUser?.businessName || currentUser?.name || cms.brand.logoLetter || 'B').charAt(0).toUpperCase();

    const newInv: InvoiceData = {
      id: `inv-${Date.now()}`,
      businessName,
      businessEmail,
      businessLogoLetter,
      clientName: 'New Client',
      clientEmail: 'client@example.com',
      invoiceNumber: `INV-00${Math.floor(50 + Math.random() * 45)}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      currency: '₹',
      status: 'Draft',
      taxRate: 5,
      discountAmount: 0,
      themeColor: cms.brand.primaryColor || '#FF5238',
      templateStyle: 'Modern',
      notes: 'Thank you for your business.',
      bankDetails: cms.brand.defaultBankDetails || {
        bankName: 'HDFC Bank Ltd',
        accountName: cms.brand.brandName || 'Billnest Studio',
        accountNumber: '50200084729103',
        routingCode: 'HDFC0001234',
        iban: 'IN50HDFC00012345020008472',
        upiId: 'billnest@hdfcbank',
        paymentInstructions: 'Please specify invoice number in wire transfer reference.',
      },
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
      {/* Full-Screen Website Entrance Splash Intro Animation */}
      <SplashEntranceAnimation
        brandName={cms.brand.brandName || 'Billnest'}
        tagline={cms.brand.tagline || 'Invoices, paid faster'}
      />

      {/* Universal Top Header Bar */}
      <Header
        brand={cms.brand}
        onOpenCms={handleRequestOpenCms}
        onOpenGenerator={handleCreateNewInvoice}
        onOpenDashboard={() => setDashboardOpen(true)}
        isAdminOpen={cmsAdminOpen}
        isAdminAuthenticated={isAdminAuthenticated}
        onLockAdmin={handleLockAdmin}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        currentView={currentView}
        onNavigateHome={() => setCurrentView('landing')}
      />

      {currentView === 'studio' ? (
        /* Full Screen Dedicated Invoice Studio Page */
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
      ) : currentView === 'auth' ? (
        /* Dedicated Standalone Sign Up / Sign In Page View Section */
        <div className="min-h-[85vh] flex flex-col justify-between">
          <AuthSection
            brand={cms.brand}
            currentUser={currentUser}
            onLoginSuccess={(user) => {
              handleLoginSuccess(user);
            }}
            onLogout={handleLogout}
            onOpenDashboard={() => setDashboardOpen(true)}
            onOpenGenerator={handleCreateNewInvoice}
            onOpenPrivacy={() => {
              setTermsPrivacyTab('privacy');
              setTermsPrivacyModalOpen(true);
            }}
            onOpenTerms={() => {
              setTermsPrivacyTab('terms');
              setTermsPrivacyModalOpen(true);
            }}
            activeTab={authSectionTab}
            onTabChange={(tab) => setAuthSectionTab(tab)}
            isStandaloneView={true}
            onBackToLanding={() => setCurrentView('landing')}
          />
          <Footer
            brand={cms.brand}
            onOpenCms={handleRequestOpenCms}
            onOpenGenerator={handleCreateNewInvoice}
            onOpenDashboard={() => setDashboardOpen(true)}
            onOpenPrivacy={() => {
              setTermsPrivacyTab('privacy');
              setTermsPrivacyModalOpen(true);
            }}
            onOpenTerms={() => {
              setTermsPrivacyTab('terms');
              setTermsPrivacyModalOpen(true);
            }}
            isAdminAuthenticated={isAdminAuthenticated}
          />
        </div>
      ) : (
        /* Landing Page View */
        <>
          <HeroSection
            hero={cms.hero}
            brand={cms.brand}
            onOpenGenerator={handleCreateNewInvoice}
            onOpenDashboard={() => setDashboardOpen(true)}
            onOpenCms={handleRequestOpenCms}
          />

          <FeaturesSection
            features={cms.features}
            primaryColor={cms.brand.primaryColor}
          />

          <AboutSection
            about={cms.about}
            brandName={cms.brand?.brandName || 'Billnest'}
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

          {/* Dedicated Sign In & Sign Up Section */}
          <AuthSection
            brand={cms.brand}
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onOpenDashboard={() => setDashboardOpen(true)}
            onOpenGenerator={handleCreateNewInvoice}
            onOpenPrivacy={() => {
              setTermsPrivacyTab('privacy');
              setTermsPrivacyModalOpen(true);
            }}
            onOpenTerms={() => {
              setTermsPrivacyTab('terms');
              setTermsPrivacyModalOpen(true);
            }}
            activeTab={authSectionTab}
            onTabChange={(tab) => setAuthSectionTab(tab)}
          />

          <CtaSection
            cta={cms.cta}
            brand={cms.brand}
            onOpenGenerator={handleCreateNewInvoice}
          />

          <Footer
            brand={cms.brand}
            onOpenCms={handleRequestOpenCms}
            onOpenGenerator={handleCreateNewInvoice}
            onOpenDashboard={() => setDashboardOpen(true)}
            onOpenPrivacy={() => {
              setTermsPrivacyTab('privacy');
              setTermsPrivacyModalOpen(true);
            }}
            onOpenTerms={() => {
              setTermsPrivacyTab('terms');
              setTermsPrivacyModalOpen(true);
            }}
            isAdminAuthenticated={isAdminAuthenticated}
          />
        </>
      )}

      {/* Terms of Service & Privacy Policy Modal */}
      <TermsPrivacyModal
        isOpen={termsPrivacyModalOpen}
        onClose={() => setTermsPrivacyModalOpen(false)}
        initialTab={termsPrivacyTab}
        brandName={cms.brand?.brandName || 'Billnest'}
        contactEmail={cms.brand?.contactEmail || 'hello@billnest.app'}
      />

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

      {/* Master Admin PIN Verification Gate Modal */}
      <AdminAuthModal
        isOpen={adminAuthModalOpen}
        onClose={() => setAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
        correctPin={cms.brand.adminPin || '1234'}
        brandName={cms.brand.brandName || 'Billnest'}
      />

      {/* Protected Live CMS Admin Modal */}
      <CmsAdminModal
        cms={cms}
        isOpen={cmsAdminOpen}
        onClose={() => setCmsAdminOpen(false)}
        onSave={handleSaveCms}
        onReset={handleResetCms}
        onLockAdmin={handleLockAdmin}
      />
    </div>
  );
}
