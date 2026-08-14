import React from 'react';
import { TestimonialItem } from '../types';
import { Star, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
  primaryColor: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  return (
    <section className="py-20 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-3">
            Loved by independent professionals
          </h2>
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base">
            Here is what freelancers and agencies say about Invoiceify.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(testimonials || []).map((t) => (
            <div
              key={t.id}
              className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4 text-[var(--primary)]">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                <div
                  className="w-9 h-9 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-xs flex items-center justify-center shrink-0"
                >
                  {t.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--foreground)]">{t.author}</h4>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
