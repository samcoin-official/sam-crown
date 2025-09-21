// client/src/components/examples/CrownIcon.tsx

'use client';

import Image, { StaticImageData } from 'next/image';
import CrownIconImage from '@/assets/crown-icon.png';

// Define the valid sizes for the component
type Size = 'md' | 'lg' | 'xl'; // ADDED 'xl' to the type definition

interface CrownIconProps {
  size: Size;
  withGlow?: boolean;
  image?: string | StaticImageData;
}

const sizeMap: Record<Size, string> = {
  md: 'w-[50px] h-[50px]',
  lg: 'w-[100px] h-[100px]',
  xl: 'w-[150px] h-[150px]', // ADDED styling for the 'xl' size
};

export const CrownIcon = ({ size, withGlow, image }: CrownIconProps) => {
  const sizeClasses = sizeMap[size];

  return (
    <div className={`relative ${sizeClasses} ${withGlow ? 'glow' : ''}`}>
      <Image
        src={image ?? CrownIconImage}
        alt="A crown icon"
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
};