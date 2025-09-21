// client/src/components/examples/CrownCharacter.tsx

'use client';

import Image, { StaticImageData } from 'next/image';
import CrownCharacterImage from '@/assets/crown-character.png'; // Corrected import statement

// Define the valid sizes for the component
type Size = 'md' | 'lg' | 'xl';

interface CrownCharacterProps {
  size: Size;
  image?: string | StaticImageData;
}

const sizeMap: Record<Size, string> = {
  md: 'w-[150px] h-[150px]',
  lg: 'w-[250px] h-[250px]',
  xl: 'w-[350px] h-[350px]',
};

export const CrownCharacter = ({ size, image }: CrownCharacterProps) => {
  const sizeClasses = sizeMap[size];

  return (
    <div className={`relative ${sizeClasses}`}>
      <Image
        src={image ?? CrownCharacterImage}
        alt="A character holding a crown"
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
};