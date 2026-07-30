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
} from 'lucide-react';

interface CmsAdminModalProps {
  cms: CmsContent;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: CmsContent) => void;
  onReset: () => void;
}

export const CmsAdminModal: React.FC<CmsAdminModalProps> = ({
  cms,
  isOpen,
  onClose,
  onSave,
  onReset,
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
      `ledgerly_cms_backup_${new Date().toISOString().split('T')[0]}.json`
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
    <div className="fixed inset-0 z-50 bg-[#2B2320]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-[#E3DED6] rounded-lg max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* CMS Header Bar */}
        <div className="px-6 py-4 border-b border-[#E3DED6] bg-[#FBF9F6] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#7A1E2B] text-white flex items-center justify-center font-bold text-xs">
              CMS
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#2B2320]">
                Ledgerly Brand Content Manager
              </h3>
              <p className="text-[11px] text-[#8A8177]">
                Live editing, style configuration, and Gemini AI copy generation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveNotification && (
              <span className="text-xs font-semibold text-[#3F7A4E] bg-[#EAF3EC] px-2.5 py-1 rounded flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved Live!</span>
              </span>
            )}

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#7A1E2B] text-white rounded shadow-sm hover:opacity-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Edits</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#8A8177] hover:text-[#2B2320] rounded hover:bg-[#EDEAE5] ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CMS Sidebar + Main Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Tabs Navigation Sidebar */}
          <div className="w-full md:w-56 bg-[#FBF9F6] border-b md:border-b-0 md:border-r border-[#E3DED6] p-3 space-y-1 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col gap-1">
            <button
              onClick={() => setActiveTab('brand')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded text-left transition-colors whitespace-nowrap ${
                activeTab === 'brand'
                  ? 'bg-[#7A1E2B] text-white'
                  : 'text-[#8A8177] hover:bg-[#EDEAE5] hover:text-[#2B2320]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Brand & Styling</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded text-left transition-colors whitespace-nowrap ${
                activeTab === 'hero'
                  ? 'bg-[#7A1E2B] text-white'
                  : 'text-[#8A8177] hover:bg-[#EDEAE5] hover:text-[#2B2320]'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Hero Section</span>
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded text-left transition-colors whitespace-nowrap ${
                activeTab === 'features'
                  ? 'bg-[#7A1E2B] text-white'
                  : 'text-[#8A8177] hover:bg-[#EDEAE5] hover:text-[#2B2320]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Features</span>
            </button>

            <button
              onClick={() => setActiveTab('howItWorks')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded text-left transition-colors whitespace-nowrap ${
                activeTab === 'howItWorks'
                  ? 'bg-[#7A1E2B] text-white'
                  : 'text-[#8A8177] hover:bg-[#EDEAE5] hover:text-[#2B2320]'
              }`}
            >
              <BarChart className="w-3.5 h-3.5" />
              <span>How It Works</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded text-left transition-colors whitespace-nowrap ${
                activeTab === 'about'
                  ? 'bg-[#7A1E2B] text-white'
                  : 'text-[#8A8177] hover:bg-[#EDEAE5] hover:text-[#2B2320]'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>About & Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded text-left transition-colors whitespace-nowrap ${
                activeTab === 'faqs'
                  ? 'bg-[#7A1E2B] text-white'
                  : 'text-[#8A8177] hover:bg-[#EDEAE5] hover:text-[#2B2320]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQs</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded text-left transition-colors whitespace-nowrap ${
                activeTab === 'testimonials'
                  ? 'bg-[#7A1E2B] text-white'
                  : 'text-[#8A8177] hover:bg-[#EDEAE5] hover:text-[#2B2320]'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              <span>Testimonials</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded text-left transition-colors whitespace-nowrap border border-[#E8DCC8] ${
                activeTab === 'ai'
                  ? 'bg-[#2B2320] text-white'
                  : 'bg-[#FBF3E3] text-[#7A1E2B] hover:bg-[#E8DCC8]'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-[#7A1E2B]" />
              <span>Gemini AI Copywriter</span>
            </button>

            <div className="pt-4 mt-auto border-t border-[#E3DED6] space-y-2 hidden md:block">
              <button
                onClick={handleExportJson}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#8A8177] hover:text-[#2B2320]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <label className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#8A8177] hover:text-[#2B2320] cursor-pointer">
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
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#7A1E2B] hover:underline"
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
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#2B2320]">
                  Global Brand & Color Settings
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#8A8177] block mb-1">
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
                      className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#8A8177] block mb-1">
                      Logo Letter
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={formData.brand.logoLetter}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          brand: {
                            ...formData.brand,
                            logoLetter: e.target.value.toUpperCase(),
                          },
                        })
                      }
                      className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#8A8177] block mb-1">
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
                        className="w-8 h-8 rounded border border-[#E3DED6] cursor-pointer"
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
                        className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#8A8177] block mb-1">
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
                        className="w-8 h-8 rounded border border-[#E3DED6] cursor-pointer"
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
                        className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[#8A8177] block mb-1">
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
                      className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* HERO TAB */}
            {activeTab === 'hero' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#2B2320]">
                  Hero Copy & Call to Action Settings
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[#8A8177] block mb-1">
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
                      className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#8A8177] block mb-1">
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
                        className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#8A8177] block mb-1">
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
                        className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#8A8177] block mb-1">
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
                      className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#8A8177] block mb-1">
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
                        className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#8A8177] block mb-1">
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
                        className="w-full p-2 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs text-[#2B2320]"
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
                  <h4 className="text-sm font-bold text-[#2B2320]">
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
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#7A1E2B] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.features.items.map((feat, idx) => (
                    <div
                      key={feat.id}
                      className="p-3 bg-[#FBF9F6] border border-[#E3DED6] rounded flex items-start justify-between gap-3"
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
                          className="p-1.5 bg-white border border-[#E3DED6] rounded text-xs font-semibold text-[#2B2320]"
                        />

                        <input
                          type="text"
                          placeholder="Icon (Eye, FileText, Share2, Activity, RefreshCw, LayoutDashboard, Zap)"
                          value={feat.iconName}
                          onChange={(e) => {
                            const items = [...formData.features.items];
                            items[idx].iconName = e.target.value;
                            setFormData({
                              ...formData,
                              features: { ...formData.features, items },
                            });
                          }}
                          className="p-1.5 bg-white border border-[#E3DED6] rounded text-xs text-[#2B2320]"
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
                          className="sm:col-span-3 p-1.5 bg-white border border-[#E3DED6] rounded text-xs text-[#8A8177]"
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
                        className="text-[#8A8177] hover:text-[#7A1E2B] p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQS TAB */}
            {activeTab === 'faqs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#2B2320]">
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
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#7A1E2B] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.faqs.items.map((faq, idx) => (
                    <div
                      key={faq.id}
                      className="p-3 bg-[#FBF9F6] border border-[#E3DED6] rounded space-y-2"
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
                          className="w-full p-1.5 bg-white border border-[#E3DED6] rounded text-xs font-semibold text-[#2B2320]"
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
                          className="text-[#8A8177] hover:text-[#7A1E2B] p-1"
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
                        className="w-full p-1.5 bg-white border border-[#E3DED6] rounded text-xs text-[#8A8177]"
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GEMINI AI TAB */}
            {activeTab === 'ai' && (
              <div className="space-y-4 bg-[#FBF9F6] p-5 border border-[#E3DED6] rounded-md">
                <div className="flex items-center gap-2 text-[#7A1E2B]">
                  <Sparkles className="w-5 h-5" />
                  <h4 className="text-sm font-bold text-[#2B2320]">
                    Gemini AI Copywriting Assistant
                  </h4>
                </div>
                <p className="text-xs text-[#8A8177]">
                  Use server-side Gemini 3.6 Flash model to refine or generate
                  high-converting copy for your website.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-[#8A8177] block mb-1">
                      Content Target
                    </label>
                    <select
                      value={aiContentType}
                      onChange={(e) => setAiContentType(e.target.value)}
                      className="w-full p-2 bg-white border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                    >
                      <option value="Hero Headline">Hero Subheadline</option>
                      <option value="Feature Description">Feature Description</option>
                      <option value="FAQ Answer">FAQ Response</option>
                      <option value="Marketing Slogan">Brand Slogan</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#8A8177] block mb-1">
                      Prompt Instructions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g., Write a punchy 2-sentence subheadline for Ledgerly targeting high-end design agencies and freelancers."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#E3DED6] rounded text-xs text-[#2B2320]"
                    ></textarea>
                  </div>

                  <button
                    onClick={handleGenerateAiCopy}
                    disabled={aiGenerating || !aiPrompt.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#7A1E2B] rounded hover:opacity-90 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
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
                    <div className="p-4 bg-white border border-[#E8DCC8] rounded space-y-3">
                      <h5 className="text-xs font-bold text-[#7A1E2B]">
                        Generated Output:
                      </h5>
                      <p className="text-xs text-[#2B2320] leading-relaxed italic">
                        "{aiResult}"
                      </p>
                      <button
                        onClick={applyAiToHeroSub}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#E8DCC8] text-[#7A1E2B] rounded hover:bg-[#7A1E2B] hover:text-white transition-colors"
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
