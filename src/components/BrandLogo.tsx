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
}> = ({ className = '', sizeClass = 'w-10 h-10' }) => {
  return (
    <div
      className={`relative ${sizeClass} rounded-[26%] bg-gradient-to-b from-[#FFA726] via-[#FF6D00] to-[#FF3D00] shadow-md shadow-orange-500/20 flex items-center justify-center transition-all duration-300 shrink-0 select-none overflow-hidden ${className}`}
    >
      {/* Mathematically exact SVG vector reproducing the uploaded logo */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[84%] h-[84%] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.18)]"
      >
        {/* Top bar with smooth top-left curve, horizontal edge, and top-right leaf curl */}
        <path
          d="M 20.5 32 C 20.5 23 25.5 19 34 19 H 72 C 75 19 77 18 78.5 16.5"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Main receipt body: Right vertical wall (with top notch), 3 identical smooth downward wave scallops, and left vertical wall */}
        <path
          d="M 78.5 25 V 59 C 75 67.5 62.5 67.5 59 59 C 55.5 67.5 42.5 67.5 39 59 C 35.5 67.5 23.5 67.5 20.5 59 V 32"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Bold crisp dollar currency symbol */}
        <text
          x="49"
          y="34.5"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#FFFFFF"
          fontSize="18"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          letterSpacing="-0.5px"
        >
          $
        </text>

        {/* Upper horizontal data bar */}
        <line
          x1="32"
          y1="48"
          x2="66"
          y2="48"
          stroke="#FFFFFF"
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/* Lower shorter horizontal data bar */}
        <line
          x1="32"
          y1="58"
          x2="51"
          y2="58"
          stroke="#FFFFFF"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
      </svg>
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
  // Sizing configurations matching the exact uploaded logo composition
  const sizeMap = {
    sm: {
      icon: 'w-8 h-8',
      title: 'text-xl font-black tracking-[-0.03em]',
      tagline: 'text-[10px] px-2.5 py-0.5 mt-0.5',
      gap: 'gap-2.5',
    },
    md: {
      icon: 'w-11 h-11 sm:w-12 sm:h-12',
      title: 'text-2xl sm:text-[28px] font-black tracking-[-0.035em]',
      tagline: 'text-xs font-bold px-3.5 py-0.5 mt-1',
      gap: 'gap-3.5',
    },
    lg: {
      icon: 'w-14 h-14 sm:w-16 sm:h-16',
      title: 'text-3xl sm:text-4xl font-black tracking-[-0.035em]',
      tagline: 'text-sm font-bold px-4 py-1 mt-1.5',
      gap: 'gap-4',
    },
    xl: {
      icon: 'w-20 h-20',
      title: 'text-4xl sm:text-5xl font-black tracking-[-0.04em]',
      tagline: 'text-base font-bold px-5 py-1.5 mt-2',
      gap: 'gap-5',
    },
  };

  const currentSize = sizeMap[size];

  if (iconOnly) {
    return <ReceiptLogoIcon sizeClass={currentSize.icon} className={className} />;
  }

  return (
    <div
      className={`inline-flex items-center ${currentSize.gap} group cursor-pointer select-none transition-transform active:scale-[0.98] ${className}`}
    >
      {/* Exact Gradient Squircle Receipt Icon */}
      <ReceiptLogoIcon sizeClass={currentSize.icon} />

      {/* Typography: Solid Dark Midnight Brand Name + Soft Peach Tagline Pill */}
      <div className="flex flex-col items-start justify-center">
        <span
          className={`${currentSize.title} text-[#0A1128] dark:text-[#F3F4F6] leading-none font-sans font-black transition-colors group-hover:text-[#FF5722]`}
        >
          {brandName}
        </span>

        {showTagline && tagline && (
          <div
            className={`inline-flex items-center justify-center rounded-full bg-[#FFF0E6] dark:bg-[#2A1712] text-[#E65100] dark:text-[#FF8A65] font-bold tracking-normal whitespace-nowrap ${currentSize.tagline}`}
          >
            <span>{tagline}</span>
          </div>
        )}
      </div>
    </div>
  );
};


