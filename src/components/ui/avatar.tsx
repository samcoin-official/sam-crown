'use client';

import * as React from 'react';
import Image, { type StaticImageData } from 'next/image';

export type AvatarProps = React.ComponentProps<'div'> & { size?: number };

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { className = '', size = 40, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      style={{ width: size, height: size }}
      className={`inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-200 ${className}`}
      {...props}
    />
  );
});

type AvatarImageProps = {
  src: string | StaticImageData;
  alt?: string;
  className?: string;
};

export const AvatarImage = React.forwardRef<HTMLSpanElement, AvatarImageProps>(
  function AvatarImage({ src, alt = '', className = '' }, ref) {
    return (
      <span ref={ref} className={`relative block h-full w-full ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          draggable={false}
          className="object-cover"
          sizes="(max-width: 768px) 40px, 40px"
          priority={false}
        />
      </span>
    );
  }
);

export type AvatarFallbackProps = React.ComponentProps<'div'>;

export const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  function AvatarFallback({ className = '', children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={`flex h-full w-full items-center justify-center text-xs text-gray-600 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
