'use client';

import * as React from 'react';

export function Card({ className = '', ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={['rounded-xl border border-gray-200 bg-white shadow-sm', className].join(' ')}
      {...props}
    />
  );
}

export function CardHeader({ className = '', ...props }: React.ComponentProps<'div'>) {
  return <div className={['px-4 py-3', className].join(' ')} {...props} />;
}

export function CardTitle({ className = '', ...props }: React.ComponentProps<'h3'>) {
  return <h3 className={['text-base font-semibold', className].join(' ')} {...props} />;
}

export function CardDescription({ className = '', ...props }: React.ComponentProps<'p'>) {
  return <p className={['text-sm text-gray-600', className].join(' ')} {...props} />;
}

export function CardContent({ className = '', ...props }: React.ComponentProps<'div'>) {
  return <div className={['px-4 pb-4', className].join(' ')} {...props} />;
}

export function CardFooter({ className = '', ...props }: React.ComponentProps<'div'>) {
  return <div className={['px-4 py-3 border-t border-gray-200', className].join(' ')} {...props} />;
}
