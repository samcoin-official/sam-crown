'use client';

import * as React from 'react';

type ProgressProps = React.ComponentProps<'div'> & {
  value?: number;
  max?: number;
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  function Progress({ value = 0, max = 100, className = '', ...props }, ref) {
    const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(pct)}
        className={`relative h-2 w-full overflow-hidden rounded bg-gray-200 ${className}`}
        {...props}
      >
        <div
          className="h-full w-full origin-left bg-blue-600"
          style={{ transform: `scaleX(${pct / 100})` }}
        />
      </div>
    );
  }
);
