'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      expand={false}
      visibleToasts={1}
      toastOptions={{ duration: 3000 }}
    />
  );
}
