import React, { useState } from 'react';
import { CmsContent, FeatureItem, FaqItem, StepItem } from '../types';
import {
  X,
  Save,
  RotateCcw,
  Download,
  Upload,
  Sparkles,
  Plus,
  Trash2,
  Sliders,
  Type,
  Layout,
  HelpCircle,
  BarChart,
  Quote,
  Palette,
  Check,
  Bot,
  Lock,
  Shield,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
} from 'lucide-react';
import { BrandLogo, ReceiptLogoIcon } from './BrandLogo';

interface CmsAdminModalProps {
  cms: CmsContent;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: CmsContent) => void;
  onReset: () => void;
  onLockAdmin?: () => void;
}

export const CmsAdminModal: React.FC<CmsAdminModalProps> = ({
  cms,
  isOpen,
  onClose,
  onSave,
  onReset,
  onLockAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'brand'
    | 'hero'
    | 'features'
    | 'howItWorks'
    | 'about'
    | 'faqs'
    | 'testimonials'
    | 'ai'
  >('brand');

  const [formData, setFormData] = useState<CmsContent>(cms);
  const [saveNotification, setSaveNotification] = useState(false);

  // Gemini AI Copywriting State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiContentType, setAiContentType] = useState('Hero Headline');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiError, setAiError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = {
      ...formData,
      lastUpdated: new Date().toISOString(),
    };
    onSave(updated);
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2500);
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `invoiceify_cms_backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setFormData(parsed);
        alert('CMS data successfully imported!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  // Call Gemini Server Endpoint
  const handleGenerateAiCopy = async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    setAiError('');
    setAiResult('');

    try {
      const res = await fetch('/api/cms/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          contentType: aiContentType,
          currentText: formData.hero.subheadline,
        }),
      });

      const data = await res.json();
      if (data.success && data.generatedText) {
        setAiResult(data.generatedText);
      } else {
        setAiError(data.error || 'Failed to generate copy.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Error connecting to Gemini API server.');
    } finally {
      setAiGenerating(false);
    }
  };

  const applyAiToHeroSub = () => {
    if (!aiResult) return;
    setFormData({
      ...formData,
      hero: { ...formData.hero, subheadline: aiResult },
    });
    alert('Applied generated copy to Hero Subheadline!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* CMS Header Bar */}
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--muted)]/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <ReceiptLogoIcon sizeClass="w-9 h-9 rounded-xl" showSparkle={false} />
            <div>
              <h3 className="font-bold text-sm text-[var(--foreground)]">
                {formData.brand.brandName || 'Invoiceify'} Brand Content Manager
              </h3>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Live editing, style configuration, and Gemini AI copy generation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveNotification && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved Live!</span>
              </span>
            )}

            <button
              onClick={handleSave}
              className="btn-shader-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-[var(--radius)] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 btn-icon-hover-bounce" />
              <span>Save Edits</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded hover:bg-[var(--muted)] ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CMS Sidebar + Main Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Tabs Navigation Sidebar */}
          <div className="w-full md:w-56 bg-[var(--sidebar)] border-b md:border-b-0 md:border-r border-[var(--border)] p-3 space-y-1 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col gap-1">
            <button
              onClick={() => setActiveTab('brand')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-[var(--radius)] text-left transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'brand'
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Brand & Styling</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-[var(--radius)] text-left transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'hero'
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Hero Section</span>
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-[var(--radius)] text-left transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'features'
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Features</span>
            </button>

            <button
              onClick={() => setActiveTab('howItWorks')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-[var(--radius)] text-left transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'howItWorks'
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <BarChart className="w-3.5 h-3.5" />
              <span>How It Works</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-[var(--radius)] text-left transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>About & Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-[var(--radius)] text-left transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'faqs'
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQs</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-[var(--radius)] text-left transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'testimonials'
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              <span>Testimonials</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-[var(--radius)] text-left transition-colors whitespace-nowrap border border-[var(--border)] cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-[var(--foreground)] text-[var(--background)]'
                  : 'bg-[var(--accent)] text-[var(--primary)] hover:bg-[var(--muted)]'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Gemini AI Copywriter</span>
            </button>

            <div className="pt-4 mt-auto border-t border-[var(--border)] space-y-2 hidden md:block">
              <button
                onClick={handleExportJson}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <label className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  if (
                    confirm(
                      'Are you sure you want to reset all CMS content back to default values?'
                    )
                  ) {
                    onReset();
                    onClose();
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* Active Workspace Editor Panel */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* BRAND TAB */}
            {activeTab === 'brand' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[var(--foreground)]">
                    Global Brand & Identity Configuration
                  </h4>
                  <span className="text-[11px] text-[var(--muted-foreground)]">
                    Real-time live updates
                  </span>
                </div>

                {/* Live Brand Logo Preview Box */}
                <div className="p-4 bg-[var(--muted)]/40 border border-[var(--border)] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">
                      Live Brand Logo & Tagline Preview
                    </span>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      This enchanted receipt mark and pill badge appear in your header, footer, and brand touchpoints.
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xs">
                    <BrandLogo
                      brandName={formData.brand.brandName || 'Invoiceify'}
                      tagline={formData.brand.tagline || 'Invoices, paid faster'}
                      size="md"
                      showTagline={true}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={formData.brand.brandName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          brand: { ...formData.brand, brandName: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs font-bold text-[var(--foreground)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Brand Tagline (Pill Badge)
                    </label>
                    <input
                      type="text"
                      value={formData.brand.tagline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          brand: { ...formData.brand, tagline: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                      placeholder="Invoices, paid faster"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Primary Theme Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.brand.primaryColor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brand: {
                              ...formData.brand,
                              primaryColor: e.target.value,
                            },
                          })
                        }
                        className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.brand.primaryColor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brand: {
                              ...formData.brand,
                              primaryColor: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.brand.accentColor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brand: {
                              ...formData.brand,
                              accentColor: e.target.value,
                            },
                          })
                        }
                        className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.brand.accentColor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brand: {
                              ...formData.brand,
                              accentColor: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.brand.tagline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          brand: { ...formData.brand, tagline: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                    />
                  </div>

                  {/* Google Search Console & SEO Section */}
                  <div className="sm:col-span-2 pt-4 border-t border-[var(--border)] space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                        Google Search Console & SEO Verification
                      </h5>
                      <span className="text-[10px] bg-[var(--accent)] text-[var(--primary)] px-2 py-0.5 rounded font-bold">
                        SEO Integration
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                        Google Site Verification Code / Meta Tag Content
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. google1234567890abcdef OR full meta tag"
                        value={formData.brand.googleSiteVerification || ''}
                        onChange={(e) => {
                          let val = e.target.value;
                          const match = val.match(/content=["']([^"']+)["']/i);
                          if (match && match[1]) {
                            val = match[1];
                          }
                          setFormData({
                            ...formData,
                            brand: { ...formData.brand, googleSiteVerification: val },
                          });
                        }}
                        className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)] font-mono"
                      />
                      <p className="text-[11px] text-[var(--muted-foreground)] mt-1 leading-relaxed">
                        Paste either your Google Search Console verification code or the full HTML meta tag. Invoiceify will automatically inject: <br />
                        <code className="text-[var(--primary)] font-mono text-[10px]">
                          &lt;meta name="google-site-verification" content="{formData.brand.googleSiteVerification || 'YOUR_CODE'}" /&gt;
                        </code>
                      </p>
                    </div>

                    <div className="bg-[var(--muted)]/50 border border-[var(--border)] p-3 rounded text-xs space-y-1.5 text-[var(--foreground)]">
                      <span className="font-bold text-[var(--primary)] block text-[11px]">
                        💡 How to verify in Google Search Console:
                      </span>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] text-[var(--muted-foreground)]">
                        <li>Go to <strong>Google Search Console</strong> and select <strong>HTML Tag</strong> verification method.</li>
                        <li>Copy the <code className="bg-[var(--card)] px-1 py-0.5 border border-[var(--border)] rounded font-mono">content="..."</code> value or the full tag.</li>
                        <li>Paste it in the box above and click <strong>Save Edits</strong>.</li>
                      </ol>
                    </div>
                  </div>

                  {/* Master Security PIN & Admin Protection Controls */}
                  <div className="sm:col-span-2 pt-4 border-t border-[var(--border)] space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-orange-500" />
                        Admin Security & Access Protection
                      </h5>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded font-bold">
                        Owner Only
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                          Master Security PIN Code
                        </label>
                        <input
                          type="text"
                          maxLength={8}
                          value={formData.brand.adminPin || '1234'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              brand: { ...formData.brand, adminPin: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs font-mono font-bold text-[var(--foreground)] tracking-widest"
                          placeholder="1234"
                        />
                        <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
                          Required to open and edit the CMS admin panel.
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                          Public Header CMS Button Visibility
                        </label>
                        <div className="flex items-center gap-3 pt-1">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!formData.brand.showAdminButtonInHeader}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  brand: {
                                    ...formData.brand,
                                    showAdminButtonInHeader: e.target.checked,
                                  },
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                            <span className="ml-2 text-xs font-semibold text-[var(--foreground)]">
                              {formData.brand.showAdminButtonInHeader
                                ? 'Visible in Header'
                                : 'Hidden from Visitors'}
                            </span>
                          </label>
                        </div>
                        <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
                          When hidden, open anytime via shortcut <kbd className="px-1 py-0.5 bg-[var(--muted)] rounded font-mono text-[9px]">Ctrl+Shift+A</kbd> or the footer lock.
                        </p>
                      </div>
                    </div>

                    {onLockAdmin && (
                      <div className="flex items-center justify-between p-3 bg-[var(--muted)]/40 border border-[var(--border)] rounded-xl">
                        <div className="text-xs">
                          <p className="font-bold text-[var(--foreground)]">Currently Authenticated as Owner</p>
                          <p className="text-[11px] text-[var(--muted-foreground)]">Lock your session before leaving the browser.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onLockAdmin();
                            onClose();
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Lock Admin Mode</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* HERO TAB */}
            {activeTab === 'hero' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[var(--foreground)]">
                  Hero Copy & Call to Action Settings
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Eyebrow Badge
                    </label>
                    <input
                      type="text"
                      value={formData.hero.eyebrow}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, eyebrow: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                        Main Headline Text
                      </label>
                      <input
                        type="text"
                        value={formData.hero.headlineMain}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: {
                              ...formData.hero,
                              headlineMain: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                        Headline Accent Word (Styled in Brand Color)
                      </label>
                      <input
                        type="text"
                        value={formData.hero.headlineAccent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: {
                              ...formData.hero,
                              headlineAccent: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Subheadline
                    </label>
                    <textarea
                      rows={3}
                      value={formData.hero.subheadline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: {
                            ...formData.hero,
                            subheadline: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                        Primary CTA Text
                      </label>
                      <input
                        type="text"
                        value={formData.hero.primaryCtaText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: {
                              ...formData.hero,
                              primaryCtaText: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                        Secondary CTA Text
                      </label>
                      <input
                        type="text"
                        value={formData.hero.secondaryCtaText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: {
                              ...formData.hero,
                              secondaryCtaText: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FEATURES TAB */}
            {activeTab === 'features' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[var(--foreground)]">
                    Manage Features List
                  </h4>
                  <button
                    onClick={() => {
                      const newFeat: FeatureItem = {
                        id: `feat-${Date.now()}`,
                        title: 'New Feature',
                        description: 'Feature description goes here.',
                        iconName: 'Zap',
                      };
                      setFormData({
                        ...formData,
                        features: {
                          ...formData.features,
                          items: [...formData.features.items, newFeat],
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.features.items.map((feat, idx) => (
                    <div
                      key={feat.id}
                      className="p-3 bg-[var(--background)] border border-[var(--border)] rounded flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Title"
                          value={feat.title}
                          onChange={(e) => {
                            const items = [...formData.features.items];
                            items[idx].title = e.target.value;
                            setFormData({
                              ...formData,
                              features: { ...formData.features, items },
                            });
                          }}
                          className="p-1.5 bg-[var(--card)] border border-[var(--border)] rounded text-xs font-semibold text-[var(--foreground)]"
                        />

                        <input
                          type="text"
                          placeholder="Icon (Rocket, Bookmark, Eye, FileText, Share2, Activity, RefreshCw, LayoutDashboard, Zap)"
                          value={feat.iconName}
                          onChange={(e) => {
                            const items = [...formData.features.items];
                            items[idx].iconName = e.target.value;
                            setFormData({
                              ...formData,
                              features: { ...formData.features, items },
                            });
                          }}
                          className="p-1.5 bg-[var(--card)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                        />

                        <input
                          type="text"
                          placeholder="Description"
                          value={feat.description}
                          onChange={(e) => {
                            const items = [...formData.features.items];
                            items[idx].description = e.target.value;
                            setFormData({
                              ...formData,
                              features: { ...formData.features, items },
                            });
                          }}
                          className="sm:col-span-3 p-1.5 bg-[var(--card)] border border-[var(--border)] rounded text-xs text-[var(--muted-foreground)]"
                        />
                      </div>

                      <button
                        onClick={() => {
                          const items = formData.features.items.filter(
                            (i) => i.id !== feat.id
                          );
                          setFormData({
                            ...formData,
                            features: { ...formData.features, items },
                          });
                        }}
                        className="text-[var(--muted-foreground)] hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HOW IT WORKS TAB */}
            {activeTab === 'howItWorks' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                    Section Main Title
                  </label>
                  <input
                    type="text"
                    value={formData.howItWorks.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        howItWorks: {
                          ...formData.howItWorks,
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs font-bold text-[var(--foreground)]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <h4 className="text-sm font-bold text-[var(--foreground)]">
                    Manage Step-by-Step Execution Steps
                  </h4>
                  <button
                    onClick={() => {
                      const nextStepNum = String(
                        formData.howItWorks.steps.length + 1
                      ).padStart(2, '0');
                      const newStep: StepItem = {
                        id: `step-${Date.now()}`,
                        stepNumber: nextStepNum,
                        title: 'New Plan Step',
                        description: 'Describe this execution stage.',
                        theme: 'ruby',
                      };
                      setFormData({
                        ...formData,
                        howItWorks: {
                          ...formData.howItWorks,
                          steps: [...formData.howItWorks.steps, newStep],
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.howItWorks.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="p-3 bg-[var(--background)] border border-[var(--border)] rounded space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={step.stepNumber}
                          onChange={(e) => {
                            const steps = [...formData.howItWorks.steps];
                            steps[idx].stepNumber = e.target.value;
                            setFormData({
                              ...formData,
                              howItWorks: { ...formData.howItWorks, steps },
                            });
                          }}
                          className="w-14 p-1.5 bg-[var(--card)] border border-[var(--border)] rounded text-xs font-mono font-bold text-center text-[var(--foreground)]"
                          placeholder="01"
                        />
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const steps = [...formData.howItWorks.steps];
                            steps[idx].title = e.target.value;
                            setFormData({
                              ...formData,
                              howItWorks: { ...formData.howItWorks, steps },
                            });
                          }}
                          className="flex-1 p-1.5 bg-[var(--card)] border border-[var(--border)] rounded text-xs font-semibold text-[var(--foreground)]"
                          placeholder="Step Title"
                        />
                        <button
                          onClick={() => {
                            const steps = formData.howItWorks.steps.filter(
                              (s) => s.id !== step.id
                            );
                            setFormData({
                              ...formData,
                              howItWorks: { ...formData.howItWorks, steps },
                            });
                          }}
                          className="text-[var(--muted-foreground)] hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={step.description}
                        onChange={(e) => {
                          const steps = [...formData.howItWorks.steps];
                          steps[idx].description = e.target.value;
                          setFormData({
                            ...formData,
                            howItWorks: { ...formData.howItWorks, steps },
                          });
                        }}
                        className="w-full p-1.5 bg-[var(--card)] border border-[var(--border)] rounded text-xs text-[var(--muted-foreground)]"
                        placeholder="Step description..."
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABOUT & STATS TAB */}
            {activeTab === 'about' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[var(--foreground)]">
                  About Section & Impact Statistics
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Eyebrow Badge Text
                    </label>
                    <input
                      type="text"
                      value={formData.about?.eyebrow || ''}
                      placeholder={`About ${formData.brand.brandName || 'Invoiceify'}`}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: {
                            ...formData.about,
                            eyebrow: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={formData.about?.title || ''}
                      placeholder="Built for people who invoice on their own."
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: {
                            ...formData.about,
                            title: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs font-bold text-[var(--foreground)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Paragraph 1 (Narrative / Mission)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.about?.paragraph1 || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: {
                            ...formData.about,
                            paragraph1: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                    ></textarea>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Paragraph 2 (Features & Non-Copyright / Royalty-Free Guarantee)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.about?.paragraph2 || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: {
                            ...formData.about,
                            paragraph2: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <h5 className="text-xs font-bold text-[var(--foreground)] mb-2">
                      Key Highlights & Statistics (4 Cards)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(formData.about?.stats || []).map((stat, idx) => (
                        <div
                          key={stat.id || idx}
                          className="p-3 bg-[var(--background)] border border-[var(--border)] rounded space-y-2"
                        >
                          <div>
                            <label className="text-[10px] font-semibold text-[var(--muted-foreground)] block mb-0.5">
                              Stat Metric / Number
                            </label>
                            <input
                              type="text"
                              value={stat.number}
                              onChange={(e) => {
                                const stats = [...(formData.about?.stats || [])];
                                stats[idx].number = e.target.value;
                                setFormData({
                                  ...formData,
                                  about: { ...formData.about, stats },
                                });
                              }}
                              className="w-full p-1.5 bg-[var(--card)] border border-[var(--border)] rounded text-xs font-mono font-bold text-[var(--primary)]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-[var(--muted-foreground)] block mb-0.5">
                              Stat Description Label
                            </label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const stats = [...(formData.about?.stats || [])];
                                stats[idx].label = e.target.value;
                                setFormData({
                                  ...formData,
                                  about: { ...formData.about, stats },
                                });
                              }}
                              className="w-full p-1.5 bg-[var(--card)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQS TAB */}
            {activeTab === 'faqs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[var(--foreground)]">
                    Manage FAQ Items
                  </h4>
                  <button
                    onClick={() => {
                      const newFaq: FaqItem = {
                        id: `faq-${Date.now()}`,
                        question: 'New Question?',
                        answer: 'Answer goes here.',
                        category: 'General',
                      };
                      setFormData({
                        ...formData,
                        faqs: {
                          ...formData.faqs,
                          items: [...formData.faqs.items, newFaq],
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.faqs.items.map((faq, idx) => (
                    <div
                      key={faq.id}
                      className="p-3 bg-[var(--background)] border border-[var(--border)] rounded space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const items = [...formData.faqs.items];
                            items[idx].question = e.target.value;
                            setFormData({
                              ...formData,
                              faqs: { ...formData.faqs, items },
                            });
                          }}
                          className="w-full p-1.5 bg-[var(--card)] border border-[var(--border)] rounded text-xs font-semibold text-[var(--foreground)]"
                        />
                        <button
                          onClick={() => {
                            const items = formData.faqs.items.filter(
                              (i) => i.id !== faq.id
                            );
                            setFormData({
                              ...formData,
                              faqs: { ...formData.faqs, items },
                            });
                          }}
                          className="text-[var(--muted-foreground)] hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          const items = [...formData.faqs.items];
                          items[idx].answer = e.target.value;
                          setFormData({
                            ...formData,
                            faqs: { ...formData.faqs, items },
                          });
                        }}
                        className="w-full p-1.5 bg-[var(--card)] border border-[var(--border)] rounded text-xs text-[var(--muted-foreground)]"
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GEMINI AI TAB */}
            {activeTab === 'ai' && (
              <div className="space-y-4 bg-[var(--background)] p-5 border border-[var(--border)] rounded-md">
                <div className="flex items-center gap-2 text-[var(--primary)]">
                  <Sparkles className="w-5 h-5" />
                  <h4 className="text-sm font-bold text-[var(--foreground)]">
                    Gemini AI Copywriting Assistant
                  </h4>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Use server-side Gemini 3.6 Flash model to refine or generate
                  high-converting copy for your website.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Content Target
                    </label>
                    <select
                      value={aiContentType}
                      onChange={(e) => setAiContentType(e.target.value)}
                      className="w-full p-2 bg-[var(--card)] border border-[var(--border)] rounded text-xs text-[var(--foreground)] cursor-pointer"
                    >
                      <option value="Hero Headline">Hero Subheadline</option>
                      <option value="Feature Description">Feature Description</option>
                      <option value="FAQ Answer">FAQ Response</option>
                      <option value="Marketing Slogan">Brand Slogan</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                      Prompt Instructions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g., Write a punchy 2-sentence subheadline for Invoiceify targeting high-end design agencies and freelancers."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full p-2.5 bg-[var(--card)] border border-[var(--border)] rounded text-xs text-[var(--foreground)]"
                    ></textarea>
                  </div>

                  <button
                    onClick={handleGenerateAiCopy}
                    disabled={aiGenerating || !aiPrompt.trim()}
                    className="btn-shader-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 btn-icon-hover-bounce" />
                    <span>
                      {aiGenerating
                        ? 'Generating with Gemini...'
                        : 'Generate Copy'}
                    </span>
                  </button>

                  {aiError && (
                    <p className="text-xs text-red-600 font-medium">{aiError}</p>
                  )}

                  {aiResult && (
                    <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded space-y-3">
                      <h5 className="text-xs font-bold text-[var(--primary)]">
                        Generated Output:
                      </h5>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed italic">
                        "{aiResult}"
                      </p>
                      <button
                        onClick={applyAiToHeroSub}
                        className="px-3 py-1.5 text-xs font-semibold bg-[var(--accent)] text-[var(--primary)] rounded hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors cursor-pointer"
                      >
                        Apply to Hero Subheadline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
