'use client';

import Image, { type StaticImageData } from 'next/image';
// KEEP YOUR EXISTING IMPORT PATH IF DIFFERENT
import crownImage from '@/assets/crown.png';

type Size = 'sm' | 'md' | 'lg';

const sizeClasses: Record<Size, string> = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

type CrownIconProps = {
  size?: Size;
  className?: string;
  withGlow?: boolean;
  src?: string | StaticImageData;
  alt?: string;
};

export default function CrownIcon({
  size = 'md',
  className = '',
  withGlow = false,
  src = crownImage,
  alt = 'SAM Crown',
}: CrownIconProps) {
  return (
    <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        draggable={false}
        className={`object-contain ${withGlow ? 'crown-glow' : ''}`}
        sizes="(max-width:768px) 64px, 96px"
        priority={false}
      />
    </div>
  );
}
