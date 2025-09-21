'use client';
import type { ReactElement } from 'react';

export default function HomePage(): ReactElement {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Home</h1>
      <p className="text-gray-300">Welcome.</p>
    </main>
  );
}
