'use client';

import * as React from 'react';

type BadgeProps = React.ComponentProps<'span'> & {
  variant?: 'default' | 'secondary' | 'success' | 'warning';
};

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const styles: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-gray-900 text-white',
    secondary: 'bg-gray-200 text-gray-900',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-black',
  };
  return (
    <span
      className={[
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        styles[variant],
        className,
      ].join(' ')}
      {...props}
    />
  );
}
