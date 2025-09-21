'use client';

import Image, { type StaticImageData } from 'next/image';
import samWithCrown from '@/assets/sam-with-crown.png';

type Size = 'sm' | 'md' | 'lg';

const sizeClasses: Record<Size, string> = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-28 h-28',
};

type CrownCharacterProps = {
  size?: Size;
  className?: string;
  src?: string | StaticImageData; // allow URL or imported image
  alt?: string;
};

export default function CrownCharacter({
  size = 'md',
  className = '',
  src = samWithCrown,
  alt = 'SAM Character with Crown',
}: CrownCharacterProps) {
  return (
    <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 96px, 160px"
        draggable={false}
        priority
        className="object-contain crown-glow pointer-events-none select-none"
      />
    </div>
  );
}
