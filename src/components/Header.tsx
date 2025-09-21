'use client';

import Link from 'next/link';

export type HeaderProps = { title?: string };

export function Header({ title = 'Sam Crown' }: HeaderProps) {
  return (
    <header className="w-full border-b border-gray-800/60 bg-black/10 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold text-yellow-300 drop-shadow">
          <Link href="/">{title}</Link>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/about" className="hover:underline">About</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
