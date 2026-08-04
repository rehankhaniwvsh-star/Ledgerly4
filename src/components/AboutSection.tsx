import React from 'react';
import { CmsContent } from '../types';
import { Sparkles, Award } from 'lucide-react';

interface AboutSectionProps {
  about: CmsContent['about'];
  primaryColor: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  about,
}) => {
  return (
    <section id="about" className="py-20 border-t border-[var(--border)] bg-[var(--card)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Narrative Column */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-semibold px-3 py-1.5 rounded-[var(--radius)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{about.eyebrow || 'About Ledgerly'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
              {about.title || 'Built for people who invoice on their own.'}
            </h2>

            <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
              {about.paragraph1}
            </p>

            <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
              {about.paragraph2}
            </p>
          </div>

          {/* Stats Grid Box */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] p-6 sm:p-8 grid grid-cols-2 gap-6 shadow-sm">
            {(about.stats || []).map((stat) => (
              <div
                key={stat.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-5 text-center transition-transform hover:scale-[1.02]"
              >
                <div
                  className="text-2xl sm:text-3xl font-extrabold mb-1 text-[var(--primary)]"
                >
                  {stat.number}
                </div>
                <div className="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
