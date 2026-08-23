import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type MascotMode = 'blob' | 'dots' | 'atom' | 'exclamation' | 'rainbow' | 'hex';

interface MorphingMascotProps {
  mode?: MascotMode | 'cycle';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customSizeClass?: string;
  interactive?: boolean;
  showControls?: boolean;
  className?: string;
  color?: string;
  onModeChange?: (mode: MascotMode) => void;
}

export const MorphingMascot: React.FC<MorphingMascotProps> = ({
  mode = 'cycle',
  size = 'md',
  customSizeClass,
  interactive = true,
  showControls = false,
  className = '',
  color = '#EE3E38',
  onModeChange,
}) => {
  const [activeMode, setActiveMode] = useState<MascotMode>(mode === 'cycle' ? 'blob' : mode);
  const [isHovered, setIsHovered] = useState(false);
  const [eyeState, setEyeState] = useState<'open' | 'blink' | 'squint' | 'look-right'>('open');

  const modesList: MascotMode[] = ['blob', 'dots', 'atom', 'exclamation', 'rainbow', 'hex'];

  // Handle auto-cycling if mode is set to 'cycle' and not manually hovered
  useEffect(() => {
    if (mode !== 'cycle') {
      setActiveMode(mode);
      return;
    }

    const interval = setInterval(() => {
      if (!isHovered) {
        setActiveMode((prev) => {
          const currentIndex = modesList.indexOf(prev);
          const nextIndex = (currentIndex + 1) % modesList.length;
          const nextMode = modesList[nextIndex];
          if (onModeChange) onModeChange(nextMode);
          return nextMode;
        });
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [mode, isHovered]);

  // Natural blinking effect for blob & hex modes
  useEffect(() => {
    if (activeMode !== 'blob' && activeMode !== 'hex') return;

    const blinkInterval = setInterval(() => {
      setEyeState('blink');
      setTimeout(() => {
        setEyeState('open');
      }, 220);
    }, 2800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [activeMode]);

  const handleNextMode = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMode((prev) => {
      const currentIndex = modesList.indexOf(prev);
      const nextIndex = (currentIndex + 1) % modesList.length;
      const next = modesList[nextIndex];
      if (onModeChange) onModeChange(next);
      return next;
    });
  };

  const sizeStyles = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
    custom: customSizeClass || 'w-16 h-16',
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <motion.div
        className={`relative ${sizeStyles[size]} flex items-center justify-center cursor-pointer`}
        onClick={interactive ? handleNextMode : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        title={interactive ? "Click to morph mascot state!" : undefined}
      >
        <AnimatePresence mode="wait">
          {/* 1. CLOUD BLOB CHARACTER */}
          {activeMode === 'blob' && (
            <motion.div
              key="mascot-blob"
              className="relative w-full h-full flex items-center justify-center"
              initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, rotate: 15, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            >
              {/* Organic 5-lobe cloud blob body */}
              <motion.svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-md"
                animate={{
                  scale: [1, 1.03, 0.98, 1],
                  rotate: [-1, 1.5, -1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  ease: 'easeInOut',
                }}
              >
                {/* Cloud body path */}
                <path
                  d="M 50 18 C 62 18 72 26 75 37 C 86 39 93 49 90 60 C 88 71 78 79 66 79 C 60 79 40 79 34 79 C 22 79 12 71 10 60 C 7 49 14 39 25 37 C 28 26 38 18 50 18 Z"
                  fill={color}
                />
                
                {/* Little blue satellite dot in corner if hovered */}
                <motion.circle
                  cx="82"
                  cy="26"
                  r="6.5"
                  fill="#2563EB"
                  animate={{
                    scale: isHovered ? [1, 1.2, 1] : 1,
                    y: [0, -3, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />

                {/* Left Eye */}
                <motion.rect
                  x="38"
                  y={eyeState === 'blink' ? '50' : '44'}
                  width="7.5"
                  height={eyeState === 'blink' ? '2.5' : '11'}
                  rx="3.5"
                  fill="#FFFFFF"
                  animate={{
                    transformOrigin: '41px 50px',
                    rotate: isHovered ? -12 : 0,
                  }}
                  transition={{ duration: 0.15 }}
                />

                {/* Right Eye */}
                <motion.rect
                  x="56"
                  y={eyeState === 'blink' ? '50' : '44'}
                  width="7.5"
                  height={eyeState === 'blink' ? '2.5' : '11'}
                  rx="3.5"
                  fill="#FFFFFF"
                  animate={{
                    transformOrigin: '59px 50px',
                    rotate: isHovered ? 12 : 0,
                  }}
                  transition={{ duration: 0.15 }}
                />
              </motion.svg>
            </motion.div>
          )}

          {/* 2. THREE PULSING DOTS / LOADER WAVE */}
          {activeMode === 'dots' && (
            <motion.div
              key="mascot-dots"
              className="relative w-full h-full flex items-center justify-center gap-2"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`dot-${i}`}
                  className="rounded-full shadow-sm"
                  style={{
                    backgroundColor: i === 1 ? color : '#F87171',
                    width: i === 1 ? '34%' : '24%',
                    height: i === 1 ? '34%' : '24%',
                  }}
                  animate={{
                    y: [-6, 6, -6],
                    scale: [0.88, 1.15, 0.88],
                    opacity: i === 1 ? [0.9, 1, 0.9] : [0.65, 0.95, 0.65],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.1,
                    delay: i * 0.18,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* 3. ATOM / PRISM WITH COLORFUL ORBITING RINGS */}
          {activeMode === 'atom' && (
            <motion.div
              key="mascot-atom"
              className="relative w-full h-full flex items-center justify-center"
              initial={{ scale: 0.4, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, rotate: 90, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                {/* Orbit Ring 1 (Cyan/Blue) */}
                <motion.ellipse
                  cx="50"
                  cy="50"
                  rx="44"
                  ry="18"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                  style={{ transformOrigin: '50px 50px' }}
                />

                {/* Orbit Ring 2 (Purple/Violet) */}
                <motion.ellipse
                  cx="50"
                  cy="50"
                  rx="44"
                  ry="18"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  animate={{ rotate: [60, 420] }}
                  transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
                  style={{ transformOrigin: '50px 50px' }}
                />

                {/* Orbit Ring 3 (Lime/Green) */}
                <motion.ellipse
                  cx="50"
                  cy="50"
                  rx="44"
                  ry="18"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  animate={{ rotate: [-60, 300] }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                  style={{ transformOrigin: '50px 50px' }}
                />

                {/* Orbit Ring 4 (Amber/Pink) */}
                <motion.ellipse
                  cx="50"
                  cy="50"
                  rx="44"
                  ry="18"
                  fill="none"
                  stroke="#FB923C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  animate={{ rotate: [120, 480] }}
                  transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
                  style={{ transformOrigin: '50px 50px' }}
                />

                {/* Central Rounded Triangle / Prism Body */}
                <motion.path
                  d="M 50 20 C 53 20 56 22 58 26 L 82 66 C 85 71 82 77 76 77 L 24 77 C 18 77 15 71 18 66 L 42 26 C 44 22 47 20 50 20 Z"
                  fill={color}
                  className="drop-shadow-md"
                  animate={{
                    scale: [0.96, 1.04, 0.96],
                  }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                  style={{ transformOrigin: '50px 50px' }}
                />

                {/* Two cute white pupil dots inside prism */}
                <circle cx="44" cy="52" r="3.5" fill="#FFFFFF" />
                <circle cx="56" cy="52" r="3.5" fill="#FFFFFF" />
              </svg>
            </motion.div>
          )}

          {/* 4. EXCLAMATION POP / NOTIFICATION ALERT */}
          {activeMode === 'exclamation' && (
            <motion.div
              key="mascot-exclamation"
              className="relative w-full h-full flex flex-col items-center justify-center gap-1.5"
              initial={{ scale: 0.2, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.2, y: -15, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 18 }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Upper Exclamation Bar with bouncy stretch */}
                <motion.path
                  d="M 44 14 C 44 9 56 9 56 14 L 54 60 C 54 64 46 64 46 60 Z"
                  fill={color}
                  className="drop-shadow-md"
                  animate={{
                    scaleY: [1, 1.12, 0.92, 1],
                    rotate: [-3, 3, -3],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: '50px 60px' }}
                />

                {/* Lower Scalloped Dot with pulse */}
                <motion.circle
                  cx="50"
                  cy="82"
                  r="7.5"
                  fill={color}
                  className="drop-shadow-sm"
                  animate={{
                    scale: [1, 1.25, 0.95, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    delay: 0.1,
                    ease: 'easeInOut',
                  }}
                />
              </svg>
            </motion.div>
          )}

          {/* 5. RAINBOW ARC & SLEDDING SPHERE */}
          {activeMode === 'rainbow' && (
            <motion.div
              key="mascot-rainbow"
              className="relative w-full h-full flex items-center justify-center"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                {/* Rainbow Tracks */}
                <path
                  d="M 12 36 C 24 58 56 74 88 64"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M 14 41 C 26 63 58 79 90 69"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M 16 46 C 28 68 60 84 92 74"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M 18 51 C 30 73 62 89 94 79"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* Sledding / Bouncing Red Sphere */}
                <motion.circle
                  r="12"
                  fill={color}
                  className="drop-shadow-md"
                  animate={{
                    cx: [20, 52, 78, 52, 20],
                    cy: [28, 54, 52, 54, 28],
                    scale: [1, 0.9, 1.1, 0.9, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.8,
                    ease: 'easeInOut',
                  }}
                />

                {/* White Eyes on Sledding Ball */}
                <motion.circle
                  r="2.5"
                  fill="#FFFFFF"
                  animate={{
                    cx: [23, 55, 81, 55, 23],
                    cy: [26, 52, 50, 52, 26],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.8,
                    ease: 'easeInOut',
                  }}
                />
              </svg>
            </motion.div>
          )}

          {/* 6. HEXAGON POLY MORPH */}
          {activeMode === 'hex' && (
            <motion.div
              key="mascot-hex"
              className="relative w-full h-full flex items-center justify-center"
              initial={{ scale: 0.4, rotate: 120, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, rotate: -120, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Rounded Hexagon Body */}
                <motion.path
                  d="M 50 14 C 54 14 58 16 61 18 L 84 32 C 87 34 90 38 90 42 L 90 68 C 90 72 87 76 84 78 L 61 92 C 58 94 54 96 50 96 C 46 96 42 94 39 92 L 16 78 C 13 76 10 72 10 68 L 10 42 C 10 38 13 34 16 32 L 39 18 C 42 16 46 14 50 14 Z"
                  fill={color}
                  animate={{
                    rotate: [0, 6, -6, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  style={{ transformOrigin: '50px 55px' }}
                />

                {/* Tilted Capsule Eyes */}
                <motion.rect
                  x="56"
                  y={eyeState === 'blink' ? '46' : '36'}
                  width="7.5"
                  height={eyeState === 'blink' ? '2.5' : '15'}
                  rx="3.5"
                  fill="#FFFFFF"
                  transform="rotate(22 60 44)"
                />
                <motion.rect
                  x="70"
                  y={eyeState === 'blink' ? '42' : '32'}
                  width="7.5"
                  height={eyeState === 'blink' ? '2.5' : '15'}
                  rx="3.5"
                  fill="#FFFFFF"
                  transform="rotate(22 74 40)"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Optional Mode Switcher Pills if enabled */}
      {showControls && (
        <div className="flex items-center gap-1.5 mt-2 bg-[var(--card)]/90 backdrop-blur-md border border-[var(--border)] rounded-full p-1 shadow-xs">
          {modesList.map((m) => (
            <button
              key={m}
              onClick={() => {
                setActiveMode(m);
                if (onModeChange) onModeChange(m);
              }}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-all capitalize ${
                activeMode === m
                  ? 'bg-[#EE3E38] text-white shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
