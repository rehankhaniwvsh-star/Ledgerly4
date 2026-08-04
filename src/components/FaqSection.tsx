import React, { useState } from 'react';
import { CmsContent, FaqItem } from '../types';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';

interface FaqSectionProps {
  faqs: CmsContent['faqs'];
  primaryColor: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  faqs,
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
    <section id="faq" className="py-20 border-t border-[var(--border)] bg-[var(--card)]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-3">
            {faqs.title || 'Frequently Asked Questions'}
          </h2>
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base">
            {faqs.subtitle || 'Everything you need to know before you get started.'}
          </p>
        </div>

        {/* Search & Category Controls */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search FAQ questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] text-xs sm:text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-[var(--radius)] text-xs font-semibold transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'bg-[var(--background)] text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-[var(--muted)]'
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
            <div className="text-center py-10 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] text-sm text-[var(--muted-foreground)]">
              No questions found matching "{searchQuery}".
            </div>
          ) : (
            filteredFaqs.map((item: FaqItem) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`border rounded-[var(--radius)] overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? 'border-[var(--primary)] bg-[var(--accent)]'
                      : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-[var(--foreground)] flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span>{item.question}</span>
                    <span
                      className={`text-lg transition-transform duration-200 font-bold text-[var(--primary)] ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed border-t border-[var(--primary)]/10">
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
