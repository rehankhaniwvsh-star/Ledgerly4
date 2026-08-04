import React from 'react';
import { CmsContent, FeatureItem } from '../types';
import {
  Eye,
  FileText,
  Share2,
  Activity,
  RefreshCw,
  LayoutDashboard,
  CheckCircle,
  Zap,
  Shield,
} from 'lucide-react';
import RocketIcon from './icons/RocketIcon';
import BookmarkIcon from './icons/BookmarkIcon';
import MagnifierIcon from './icons/MagnifierIcon';
import BrainCircuitIcon from './icons/BrainCircuitIcon';

interface FeaturesSectionProps {
  features: CmsContent['features'];
  primaryColor: string;
}

const renderIcon = (name: string, primaryColor: string) => {
  const props = { className: 'w-5 h-5', style: { color: 'var(--primary)' } };
  switch (name) {
    case 'Rocket':
      return <RocketIcon size={20} color="var(--primary)" strokeWidth={2} />;
    case 'Bookmark':
      return <BookmarkIcon size={20} color="var(--primary)" strokeWidth={2} />;
    case 'Magnifier':
      return <MagnifierIcon size={20} color="var(--primary)" strokeWidth={2} />;
    case 'BrainCircuit':
      return <BrainCircuitIcon size={20} color="var(--primary)" strokeWidth={2} />;
    case 'Eye':
      return <Eye {...props} />;
    case 'FileText':
      return <FileText {...props} />;
    case 'Share2':
      return <Share2 {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'RefreshCw':
      return <RefreshCw {...props} />;
    case 'LayoutDashboard':
      return <LayoutDashboard {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Shield':
      return <Shield {...props} />;
    default:
      return <CheckCircle {...props} />;
  }
};

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features,
}) => {
  return (
    <section id="features" className="py-20 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-3">
            {features.title || 'Everything included. Nothing gated.'}
          </h2>
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base leading-relaxed">
            {features.subtitle ||
              'No tiers, no locked features. Every account gets the full toolkit from day one.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(features.items || []).map((feature: FeatureItem) => (
            <div
              key={feature.id}
              className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md group"
            >
              <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--background)] border border-[var(--border)] flex items-center justify-center mb-4 transition-colors group-hover:border-[var(--primary)]">
                {renderIcon(feature.iconName, 'var(--primary)')}
              </div>
              <h3 className="text-base font-bold text-[var(--foreground)] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
