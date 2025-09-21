import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Sam Crown',
  description: 'SAM Crown Game',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-[var(--crown-bg)] text-[var(--text)] antialiased">
        <header className="header-bar sticky top-0 z-10">
          <nav className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
            <Link href="/" className="font-bold text-yellow-300">Sam Crown</Link>
            <div className="flex gap-6 text-sm text-gray-300">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
