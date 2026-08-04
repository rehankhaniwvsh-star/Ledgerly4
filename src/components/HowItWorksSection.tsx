import React, { useState } from 'react';
import { StepItem } from '../types';
import {
  ClipboardList,
  Zap,
  Rocket,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Palette,
  FileSpreadsheet,
  Send,
  BarChart3,
  LayoutGrid,
  ListOrdered,
} from 'lucide-react';

interface HowItWorksSectionProps {
  howItWorks: {
    title: string;
    steps: StepItem[];
  };
  primaryColor?: string;
}

// Preset plan colors & icons for steps
const STEP_THEME_PRESETS = [
  {
    icon: '📋',
    lucideIcon: ClipboardList,
    badgeText: 'Step 1 • Onboarding',
    colorClass: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    numberBg: 'bg-emerald-500 text-white',
    hoverBorder: 'hover:border-emerald-500/60',
    accentGlow: 'bg-emerald-500/10',
  },
  {
    icon: '⚡',
    lucideIcon: Zap,
    badgeText: 'Step 2 • Setup',
    colorClass: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
    numberBg: 'bg-indigo-500 text-white',
    hoverBorder: 'hover:border-indigo-500/60',
    accentGlow: 'bg-indigo-500/10',
  },
  {
    icon: '🚀',
    lucideIcon: Rocket,
    badgeText: 'Step 3 • Generation',
    colorClass: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    numberBg: 'bg-amber-500 text-white',
    hoverBorder: 'hover:border-amber-500/60',
    accentGlow: 'bg-amber-500/10',
  },
  {
    icon: '✅',
    lucideIcon: CheckCircle2,
    badgeText: 'Step 4 • Results',
    colorClass: 'from-blue-500/20 to-sky-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
    numberBg: 'bg-blue-500 text-white',
    hoverBorder: 'hover:border-blue-500/60',
    accentGlow: 'bg-blue-500/10',
  },
  {
    icon: '📊',
    lucideIcon: BarChart3,
    badgeText: 'Step 5 • Analytics',
    colorClass: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400',
    numberBg: 'bg-rose-500 text-white',
    hoverBorder: 'hover:border-rose-500/60',
    accentGlow: 'bg-rose-500/10',
  },
];

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  howItWorks,
}) => {
  const steps = howItWorks.steps || [];

  return (
    <section className="how-it-works py-20 bg-[var(--background)] border-t border-[var(--border)] relative overflow-hidden">
      {/* Decorative background glow elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[var(--accent)] text-[var(--primary)] border border-[var(--border)] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Simple Execution Plan</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
            {howItWorks.title || 'How It Works'}
          </h2>

          <p className="subtitle text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
            Follow these simple steps to get started and manage your brand billing effortlessly.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="steps grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const theme = STEP_THEME_PRESETS[index % STEP_THEME_PRESETS.length];
            const StepIcon = theme.lucideIcon;

            return (
              <div
                key={step.id || index}
                className={`step-card group relative bg-[var(--card)] border border-[var(--border)] ${theme.hoverBorder} rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden`}
              >
                {/* Background Accent Pill Gradient */}
                <div className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${theme.colorClass} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

                <div className="space-y-4 relative z-10">
                  {/* Top Bar: Step Number Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className={`step-number w-9 h-9 rounded-xl ${theme.numberBg} font-extrabold text-sm flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      {step.stepNumber || index + 1}
                    </div>

                    <div className="icon text-2xl p-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center shadow-inner">
                      <StepIcon className={`w-5 h-5 ${theme.colorClass.split(' ').pop()}`} />
                    </div>
                  </div>

                  {/* Step Title & Description */}
                  <div className="space-y-2 pt-1">
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest block ${theme.colorClass.split(' ').pop()}`}>
                      {theme.badgeText}
                    </span>
                    <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer Step Indicator */}
                <div className="pt-4 mt-6 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)] relative z-10">
                  <span className="font-semibold text-[11px] flex items-center gap-1 text-[var(--foreground)]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Verified Step
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold text-[var(--primary)] text-[11px]">
                    Phase {index + 1} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto space-y-3 shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500" />
          <h3 className="text-lg font-bold text-[var(--foreground)]">
            Ready to generate your first invoice?
          </h3>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            No credit card required. Experience live editing, custom PDF exports, and instant sharing.
          </p>
          <div className="pt-2">
            <a
              href="#generator"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Started Now</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
