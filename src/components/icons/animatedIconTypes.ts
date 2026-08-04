export interface AnimatedIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export const scaledStrokeWidth = (strokeWidth: number, viewBoxSize: number = 24) => {
  return (strokeWidth * viewBoxSize) / 24;
};
