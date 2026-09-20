import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  CreditCard,
  Target,
  Briefcase,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CustomerOnboardingAnswers, UserProfile, BrandSettings } from '../types';

interface CustomerOnboardingSectionProps {
  user: UserProfile;
  brand: BrandSettings;
  onComplete: (answers: CustomerOnboardingAnswers) => void;
  onSkip: () => void;
}

const INDUSTRIES = [
  { id: 'ecommerce', label: 'E-Commerce & Retail', icon: '🛍️' },
  { id: 'web_dev', label: 'Web & Software Development', icon: '💻' },
  { id: 'design', label: 'Creative & Graphic Design', icon: '🎨' },
  { id: 'photo_video', label: 'Photography & Video', icon: '📸' },
  { id: 'marketing', label: 'Marketing & Social Media', icon: '📈' },
  { id: 'consulting', label: 'Consulting & Strategy', icon: '💼' },
  { id: 'freelance', label: 'Independent Freelancer', icon: '✨' },
  { id: 'other', label: 'Other Business Services', icon: '🏢' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' },
  { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$) - Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$) - Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', label: 'SGD (S$) - Singapore Dollar' },
];

const PAYMENT_TERMS_OPTIONS = [
  { id: 'receipt', title: 'Due on Receipt', desc: 'Client pays immediately upon delivery' },
  { id: 'net15', title: 'Net 15 Days', desc: 'Standard 2-week invoicing window' },
  { id: 'net30', title: 'Net 30 Days', desc: 'Corporate standard 30-day payment term' },
  { id: 'deposit50', title: '50% Deposit Upfront', desc: 'Split 50% retainer + 50% completion' },
];

const PAYMENT_METHODS = [
  { id: 'bank', label: 'Bank Transfer / ACH Wire' },
  { id: 'card', label: 'Credit / Debit Cards (Stripe)' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'cash', label: 'Cash or Check' },
];

const PRIMARY_GOALS = [
  { id: 'faster_pay', title: 'Get paid faster', desc: 'Automate reminders & instant payment links' },
  { id: 'branding', title: 'Polished client image', desc: 'Designer invoices with custom logos & colors' },
  { id: 'records', title: 'Track records & taxes', desc: 'Centralized database with status filtering' },
];

export const CustomerOnboardingSection: React.FC<CustomerOnboardingSectionProps> = ({
  user,
  brand,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [businessName, setBusinessName] = useState(
    user.businessName || user.name ? `${user.name}'s Studio` : 'My Studio'
  );
  const [industry, setIndustry] = useState('ecommerce');
  const [businessSize, setBusinessSize] = useState('Solo Freelancer');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [invoiceVolume, setInvoiceVolume] = useState('1-5');
  const [paymentTerms, setPaymentTerms] = useState('Due on Receipt');
  const [acceptedPayments, setAcceptedPayments] = useState<string[]>([
    'Bank Transfer / ACH Wire',
    'Credit / Debit Cards (Stripe)',
  ]);
  const [primaryGoal, setPrimaryGoal] = useState('Get paid faster');
  const [taxInfo, setTaxInfo] = useState('');

  const togglePaymentMethod = (label: string) => {
    setAcceptedPayments((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleFinish = () => {
    const answers: CustomerOnboardingAnswers = {
      businessName: businessName.trim() || user.name || 'My Studio',
      industry,
      businessSize,
      defaultCurrency,
      invoiceVolume,
      paymentTerms,
      acceptedPayments,
      primaryGoal,
      notesOrTaxInfo: taxInfo.trim(),
      completedAt: new Date().toISOString(),
    };
    onComplete(answers);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 relative">
      <div className="max-w-2xl mx-auto w-full">
        {/* Top Header Card */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome Setup · Tailoring Your Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--foreground)]">
            Welcome to {brand.brandName}, {user.name.split(' ')[0]}!
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-lg mx-auto">
            Answer a few quick questions to customize your invoice templates, currency, and payment options.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between gap-2 mb-8 px-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 1
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
              }`}
            >
              1
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step >= 1 ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'
              }`}
            >
              Business Profile
            </span>
          </div>

          <div
            className={`flex-1 h-1 rounded-full transition-colors ${
              step >= 2 ? 'bg-orange-600' : 'bg-[var(--border)]'
            }`}
          />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 2
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
              }`}
            >
              2
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step >= 2 ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'
              }`}
            >
              Invoicing & Currency
            </span>
          </div>

          <div
            className={`flex-1 h-1 rounded-full transition-colors ${
              step === 3 ? 'bg-orange-600' : 'bg-[var(--border)]'
            }`}
          />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 3
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
              }`}
            >
              3
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === 3 ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'
              }`}
            >
              Payment Terms
            </span>
          </div>
        </div>

        {/* Question Container Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden transition-all">
          {/* ================= STEP 1: BUSINESS & INDUSTRY ================= */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">
                  Tell us about your business
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  This information will be pre-filled on your invoice headers.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-2">
                  Company or Studio Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Creative Studio"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-2">
                  What industry best describes your work?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setIndustry(ind.label)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        industry === ind.label
                          ? 'border-orange-500 bg-orange-500/10 text-[var(--foreground)] font-bold shadow-xs'
                          : 'border-[var(--border)] bg-[var(--background)] hover:border-orange-500/30 text-[var(--muted-foreground)]'
                      }`}
                    >
                      <span className="text-lg">{ind.icon}</span>
                      <span className="text-xs">{ind.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-2">
                  Team Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Solo Freelancer', '2-5 Small Team', '6+ Agency'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setBusinessSize(size)}
                      className={`py-2 px-3 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                        businessSize === size
                          ? 'border-orange-500 bg-orange-500/10 text-orange-600 font-bold'
                          : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: INVOICING & CURRENCY ================= */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">
                  Invoicing Preferences
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Choose your default currency and typical billing volume.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-2">
                  Default Billing Currency
                </label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-2">
                  Typical Monthly Invoice Volume
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '1-5', title: '1 - 5 / mo', desc: 'Starting out' },
                    { id: '6-20', title: '6 - 20 / mo', desc: 'Active' },
                    { id: '20+', title: '20+ / mo', desc: 'High volume' },
                  ].map((vol) => (
                    <button
                      key={vol.id}
                      type="button"
                      onClick={() => setInvoiceVolume(vol.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        invoiceVolume === vol.id
                          ? 'border-orange-500 bg-orange-500/10 text-[var(--foreground)] font-bold'
                          : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]'
                      }`}
                    >
                      <div className="text-xs font-bold text-[var(--foreground)]">{vol.title}</div>
                      <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{vol.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-2">
                  Default Payment Terms
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PAYMENT_TERMS_OPTIONS.map((term) => (
                    <button
                      key={term.id}
                      type="button"
                      onClick={() => setPaymentTerms(term.title)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentTerms === term.title
                          ? 'border-orange-500 bg-orange-500/10 text-[var(--foreground)] font-bold'
                          : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]'
                      }`}
                    >
                      <div className="text-xs font-bold text-[var(--foreground)]">{term.title}</div>
                      <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{term.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: PAYMENT METHODS & GOALS ================= */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">
                  Payment Methods & Goals
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Configure how clients can pay you and your top workflow focus.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-2">
                  Accepted Payment Methods (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PAYMENT_METHODS.map((pm) => {
                    const isSelected = acceptedPayments.includes(pm.label);
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => togglePaymentMethod(pm.label)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500/10 text-[var(--foreground)] font-bold'
                            : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]'
                        }`}
                      >
                        <span className="text-xs">{pm.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-2">
                  What is your primary goal right now?
                </label>
                <div className="space-y-2">
                  {PRIMARY_GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setPrimaryGoal(goal.title)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        primaryGoal === goal.title
                          ? 'border-orange-500 bg-orange-500/10 text-[var(--foreground)] font-bold'
                          : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-[var(--foreground)]">{goal.title}</div>
                        <div className="text-[10px] text-[var(--muted-foreground)]">{goal.desc}</div>
                      </div>
                      {primaryGoal === goal.title && (
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-1.5">
                  Tax / VAT Registration ID (Optional)
                </label>
                <input
                  type="text"
                  value={taxInfo}
                  onChange={(e) => setTaxInfo(e.target.value)}
                  placeholder="e.g. US-EIN-987654 or EU-VAT-12345"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[var(--foreground)] hover:bg-[var(--muted)] border border-[var(--border)] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onSkip}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline cursor-pointer"
              >
                Skip setup for now
              </button>
            )}

            <div className="flex items-center gap-3">
              {step < 3 && (
                <button
                  type="button"
                  onClick={onSkip}
                  className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer hidden sm:inline"
                >
                  Skip
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev + 1) as 2 | 3)}
                  className="btn-pill-dark inline-flex items-center gap-2 py-2.5 px-6 text-xs font-bold cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="btn-pill-dark inline-flex items-center gap-2 py-2.5 px-6 text-xs font-bold cursor-pointer bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Launch My Customized Studio</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Security assurance */}
        <div className="mt-6 text-center text-xs text-[var(--muted-foreground)] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Your preferences are stored securely and can be changed anytime in studio settings.</span>
        </div>
      </div>
    </div>
  );
};
