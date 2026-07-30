import React, { useState } from 'react';
import { CmsContent, FaqItem } from '../types';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';

interface FaqSectionProps {
  faqs: CmsContent['faqs'];
  primaryColor: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  faqs,
  primaryColor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>(faqs.items?.[0]?.id || null);

  // Collect unique categories
  const categories = [
    'All',
    ...Array.from(
      new Set(
        (faqs.items || [])
          .map((item) => item.category)
          .filter((cat): cat is string => Boolean(cat))
      )
    ),
  ];

  const filteredFaqs = (faqs.items || []).filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="faq" className="py-20 border-t border-[#E3DED6] bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B2320] mb-3">
            {faqs.title || 'Frequently Asked Questions'}
          </h2>
          <p className="text-[#8A8177] text-sm sm:text-base">
            {faqs.subtitle || 'Everything you need to know before you get started.'}
          </p>
        </div>

        {/* Search & Category Controls */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8177]" />
            <input
              type="text"
              placeholder="Search FAQ questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FBF9F6] border border-[#E3DED6] rounded text-xs sm:text-sm text-[#2B2320] focus:outline-none focus:border-[#7A1E2B]"
            />
          </div>

          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#7A1E2B] text-white'
                      : 'bg-[#FBF9F6] text-[#8A8177] border border-[#E3DED6] hover:bg-[#EDEAE5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-[#FBF9F6] border border-[#E3DED6] rounded text-sm text-[#8A8177]">
              No questions found matching "{searchQuery}".
            </div>
          ) : (
            filteredFaqs.map((item: FaqItem) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`border rounded-md overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? 'border-[#7A1E2B] bg-[#FBF3F4]'
                      : 'border-[#E3DED6] bg-white hover:border-[#8A8177]'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-[#2B2320] flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span>{item.question}</span>
                    <span
                      className={`text-lg transition-transform duration-200 font-bold ${
                        isOpen ? 'rotate-45 text-[#7A1E2B]' : 'text-[#7A1E2B]'
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#8A8177] leading-relaxed border-t border-[#7A1E2B]/10">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
