import React from 'react';
import { StepItem } from '../types';

interface HowItWorksSectionProps {
  howItWorks: {
    title: string;
    steps: StepItem[];
  };
  primaryColor: string;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  howItWorks,
}) => {
  const getThemeClasses = (theme: StepItem['theme']) => {
    switch (theme) {
      case 'ruby':
        return {
          bg: 'bg-[#F7E9EA]',
          numColor: 'text-[#7A1E2B]',
          dotColor: '#7A1E2B',
        };
      case 'rust':
        return {
          bg: 'bg-[#FBEDE6]',
          numColor: 'text-[#B5502E]',
          dotColor: '#B5502E',
        };
      case 'gold':
      default:
        return {
          bg: 'bg-[#FBF3E3]',
          numColor: 'text-[#A67C3D]',
          dotColor: '#A67C3D',
        };
    }
  };

  return (
    <section id="how-it-works" className="py-20 border-t border-[#E3DED6]">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B2320] text-center mb-16">
          {howItWorks.title || 'How It Works'}
        </h2>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-repeat-y bg-[linear-gradient(to_bottom,#E3DED6_0_8px,transparent_8px_16px)] hidden md:block"></div>

          <div className="space-y-12 md:space-y-16">
            {(howItWorks.steps || []).map((step, index) => {
              const isLeft = index % 2 === 0;
              const theme = getThemeClasses(step.theme);

              return (
                <div
                  key={step.id}
                  className={`relative flex items-center ${
                    isLeft ? 'md:justify-start' : 'md:justify-end'
                  }`}
                >
                  {/* Timeline Node Dot */}
                  <div
                    className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 z-10 shadow-sm"
                    style={{ borderColor: theme.dotColor }}
                  ></div>

                  {/* Card */}
                  <div
                    className={`w-full md:w-[380px] p-6 rounded-md border border-[#E3DED6] ${
                      theme.bg
                    } shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md ${
                      isLeft
                        ? 'md:-rotate-1 md:hover:rotate-0'
                        : 'md:rotate-1 md:hover:rotate-0'
                    }`}
                  >
                    <span
                      className={`block font-extrabold text-3xl mb-2 ${theme.numColor}`}
                    >
                      {step.stepNumber}
                    </span>
                    <h3 className="text-base font-bold text-[#2B2320] mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8A8177] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
