'use client';
import type { ReactElement } from 'react';

export default function NotFound(): ReactElement {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-red-400">404</h1>
      <p className="text-gray-300">Page not found.</p>
    </main>
  );
}
