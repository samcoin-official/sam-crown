'use client';

import Image from 'next/image';

type Size = 'sm' | 'md' | 'lg';
const sizes: Record<Size, { w: number; h: number }> = {
  sm: { w: 96, h: 96 },
  md: { w: 144, h: 144 },
  lg: { w: 200, h: 200 },
};

export type CrownCharacterProps = {
  size?: Size;
  className?: string;
  /** Accept a public path string (e.g. "/sam-with-crown.png") */
  src?: string;
  alt?: string;
};

export default function CrownCharacter({
  size = 'md',
  className = '',
  src = '/sam-with-crown.png',
  alt = 'SAM Character with Crown',
}: CrownCharacterProps) {
  const { w, h } = sizes[size];
  return (
    <div className={`relative inline-block ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        className="object-contain crown-glow select-none"
        draggable={false}
        priority
      />
    </div>
  );
}
