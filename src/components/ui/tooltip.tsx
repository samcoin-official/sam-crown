'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(function TooltipContent({ className, sideOffset = 6, ...props }, ref) {
  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={[
        // Tailwind utility shell; safe even if you don’t have shadcn tokens
        'z-50 rounded-md border bg-white px-3 py-1.5 text-sm text-black shadow-md',
        'data-[side=top]:animate-in data-[side=top]:fade-in-0 data-[side=top]:slide-in-from-bottom-1',
        'data-[side=bottom]:animate-in data-[side=bottom]:fade-in-0 data-[side=bottom]:slide-in-from-top-1',
        'data-[side=left]:animate-in data-[side=left]:fade-in-0 data-[side=left]:slide-in-from-right-1',
        'data-[side=right]:animate-in data-[side=right]:fade-in-0 data-[side=right]:slide-in-from-left-1',
        className ?? '',
      ].join(' ')}
      {...props}
    />
  );
});

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
