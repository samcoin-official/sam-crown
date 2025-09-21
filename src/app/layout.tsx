import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';
import MinikitInit from '@/components/MinikitInit';
// import { Toaster } from '@/components/ui/toaster'; // Uncomment if you have it

export const metadata: Metadata = {
  title: 'Sam Crown',
  description: 'SAM Crown Game - World App Mini App',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-[var(--crown-bg)] text-[var(--text)] antialiased">
        <MinikitInit />
        <header className="header-bar sticky top-0 z-10">
          <nav className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
            <Link href="/" className="font-bold text-yellow-300">Sam Crown</Link>
            <div className="flex gap-6 text-sm text-gray-300">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">
          {children}
        </main>
        {/* <Toaster /> */}
      </body>
    </html>
  );
}