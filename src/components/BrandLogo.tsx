import React from 'react';

interface BrandLogoProps {
  brandName?: string;
  tagline?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export const ReceiptLogoIcon: React.FC<{
  className?: string;
  sizeClass?: string;
  showSparkle?: boolean;
}> = ({ className = '', sizeClass = 'w-10 h-10', showSparkle = true }) => {
  return (
    <div
      className={`relative ${sizeClass} rounded-2xl bg-gradient-to-tr from-[#FF3366] via-[#FF5722] to-[#FFA000] border border-white/25 flex items-center justify-center shadow-md shadow-orange-500/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-orange-500/40 shrink-0 ${className}`}
    >
      {/* Exquisite Receipt Vector with Orange Gradient Theme & Wavy Bottom */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[72%] h-[72%] text-white transition-transform duration-300 drop-shadow-xs"
      >
        {/* Receipt Paper Silhouette with Crisp White Outline and Translucent White Paper Fill */}
        <path
          d="M10 8.5C10 7.11929 11.1193 6 12.5 6H27.5C28.8807 6 30 7.11929 30 8.5V30.5C29 32 27.5 32 26.5 30.5C25.5 29 24 29 23 30.5C22 32 20.5 32 19.5 30.5C18.5 29 17 29 16 30.5C15 32 13.5 32 12.5 30.5C11.5 29 10.5 29.5 10 30.5V8.5Z"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="rgba(255, 255, 255, 0.16)"
        />

        {/* Currency Symbol: Dollar Sign with Crisp White Contrast */}
        <text
          x="20"
          y="15"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#FFFFFF"
          fontSize="9"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.5px"
        >
          $
        </text>

        {/* Invoice Item Dash Line 1 */}
        <line
          x1="14"
          y1="20"
          x2="26"
          y2="20"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Invoice Item Dash Line 2 */}
        <line
          x1="14"
          y1="24.5"
          x2="21"
          y2="24.5"
          stroke="rgba(255, 255, 255, 0.85)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Enchantment: Subtle animated micro-sparkle accent on top-right */}
      {showSparkle && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white shadow-xs border border-orange-200"></span>
        </span>
      )}
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brandName = 'Invoiceify',
  tagline = 'Invoices, paid faster',
  size = 'md',
  showTagline = true,
  className = '',
  iconOnly = false,
}) => {
  // Size configurations
  const sizeMap = {
    sm: {
      icon: 'w-8 h-8 rounded-xl',
      title: 'text-base font-black tracking-tight',
      tagline: 'text-[10px] px-2 py-0.5 mt-0.5',
      gap: 'gap-2.5',
    },
    md: {
      icon: 'w-11 h-11 rounded-2xl',
      title: 'text-xl font-black tracking-tight',
      tagline: 'text-[11px] px-2.5 py-0.5 mt-1',
      gap: 'gap-3',
    },
    lg: {
      icon: 'w-14 h-14 rounded-3xl',
      title: 'text-2xl sm:text-3xl font-black tracking-tight',
      tagline: 'text-xs font-semibold px-3 py-1 mt-1.5',
      gap: 'gap-3.5',
    },
    xl: {
      icon: 'w-18 h-18 rounded-[28px]',
      title: 'text-3xl sm:text-4xl font-black tracking-tight',
      tagline: 'text-sm font-semibold px-4 py-1.5 mt-2',
      gap: 'gap-4',
    },
  };

  const currentSize = sizeMap[size];

  if (iconOnly) {
    return <ReceiptLogoIcon sizeClass={currentSize.icon} className={className} />;
  }

  return (
    <div className={`inline-flex items-center ${currentSize.gap} group cursor-pointer select-none ${className}`}>
      {/* Orange Gradient Enchanted Receipt Icon */}
      <ReceiptLogoIcon sizeClass={currentSize.icon} />

      {/* Brand Title & Tagline Pill Badge */}
      <div className="flex flex-col items-start justify-center">
        <span
          className={`${currentSize.title} text-[var(--foreground)] leading-none transition-colors group-hover:text-orange-600 font-sans`}
        >
          {brandName}
        </span>

        {showTagline && tagline && (
          <div
            className={`inline-flex items-center rounded-full bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 text-orange-600 dark:text-orange-400 font-bold tracking-normal whitespace-nowrap shadow-2xs ${currentSize.tagline}`}
          >
            <span>{tagline}</span>
          </div>
        )}
      </div>
    </div>
  );
};
