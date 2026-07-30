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
  HelpCircle,
} from 'lucide-react';

interface FeaturesSectionProps {
  features: CmsContent['features'];
  primaryColor: string;
}

const renderIcon = (name: string, primaryColor: string) => {
  const props = { className: 'w-5 h-5', style: { color: primaryColor } };
  switch (name) {
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
  primaryColor,
}) => {
  return (
    <section id="features" className="py-20 border-t border-[#E3DED6]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B2320] mb-3">
            {features.title || 'Everything included. Nothing gated.'}
          </h2>
          <p className="text-[#8A8177] text-sm sm:text-base leading-relaxed">
            {features.subtitle ||
              'No tiers, no locked features. Every account gets the full toolkit from day one.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(features.items || []).map((feature: FeatureItem) => (
            <div
              key={feature.id}
              className="bg-white border border-[#E3DED6] rounded-md p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md group"
            >
              <div className="w-10 h-10 rounded bg-[#FBF9F6] border border-[#E3DED6] flex items-center justify-center mb-4 transition-colors group-hover:border-[#7A1E2B]">
                {renderIcon(feature.iconName, primaryColor)}
              </div>
              <h3 className="text-base font-bold text-[#2B2320] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#8A8177] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
