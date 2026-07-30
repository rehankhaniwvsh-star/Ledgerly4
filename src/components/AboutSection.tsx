import React from 'react';
import { CmsContent } from '../types';
import { Sparkles, Award } from 'lucide-react';

interface AboutSectionProps {
  about: CmsContent['about'];
  primaryColor: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  about,
  primaryColor,
}) => {
  return (
    <section id="about" className="py-20 border-t border-[#E3DED6] bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Narrative Column */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 bg-[#E8DCC8] text-[#7A1E2B] text-xs font-semibold px-3 py-1.5 rounded-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{about.eyebrow || 'About Ledgerly'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B2320]">
              {about.title || 'Built for people who invoice on their own.'}
            </h2>

            <p className="text-sm sm:text-base text-[#8A8177] leading-relaxed">
              {about.paragraph1}
            </p>

            <p className="text-sm sm:text-base text-[#8A8177] leading-relaxed">
              {about.paragraph2}
            </p>
          </div>

          {/* Stats Grid Box */}
          <div className="bg-[#FBF9F6] border border-[#E3DED6] rounded-md p-6 sm:p-8 grid grid-cols-2 gap-6 shadow-sm">
            {(about.stats || []).map((stat) => (
              <div
                key={stat.id}
                className="bg-white border border-[#E3DED6] rounded p-5 text-center transition-transform hover:scale-[1.02]"
              >
                <div
                  className="text-2xl sm:text-3xl font-extrabold mb-1"
                  style={{ color: primaryColor }}
                >
                  {stat.number}
                </div>
                <div className="text-xs text-[#8A8177] font-medium uppercase tracking-wider">
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
