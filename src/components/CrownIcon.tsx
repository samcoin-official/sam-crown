'use client';

import Image from 'next/image';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const sizes: Record<Size, { w: number; h: number }> = {
  xs: { w: 24, h: 24 },
  sm: { w: 32, h: 32 },
  md: { w: 48, h: 48 },
  lg: { w: 72, h: 72 },
  xl: { w: 96, h: 96 },
};

export type CrownIconProps = {
  size?: Size;
  withGlow?: boolean;
  className?: string;
  /** Accept a public path string (e.g. "/sam-crown-logo.png") */
  src?: string;
  alt?: string;
};

export default function CrownIcon({
  size = 'md',
  withGlow = true,
  className = '',
  src = '/sam-crown-logo.png',
  alt = 'SAM Crown',
}: CrownIconProps) {
  const { w, h } = sizes[size];
  return (
    <span className={`inline-block relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        className={`${withGlow ? 'crown-glow' : ''} object-contain select-none`}
        draggable={false}
        priority
      />
    </span>
  );
}
