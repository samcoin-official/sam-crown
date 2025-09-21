'use client';

import { useMemo, useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WorldVerifyButton from '@/components/WorldVerifyButton';
import { Toaster } from '@/components/ui/toaster';

const SAM_WITH_CROWN = '/sam-with-crown.png';
const SAM_CROWN_LOGO = '/sam-crown-logo.png';

export default function Page(): ReactElement {
  const [verified, setVerified] = useState(false);
  const [hasCrown, setHasCrown] = useState(false);
  const [tokens, setTokens] = useState<number>(12850);

  // constant rate; no unused setter
  const rate = 420; // tokens / min
  const cap = 1000;

  const pct = useMemo(() => Math.min(100, Math.round((rate / cap) * 100)), [rate]);

  const handleVerified = () => setVerified(true);

  const claim = () => {
    if (!verified || hasCrown) return;
    setHasCrown(true);
  };

  const steal = () => {
    if (!verified || hasCrown) return;
    setHasCrown(true);
  };

  // tick earnings while holding the crown
  useEffect(() => {
    if (!hasCrown) return;
    const id = setInterval(() => {
      setTokens((t) => t + Math.floor(rate / 60));
    }, 1000);
    return () => clearInterval(id);
  }, [hasCrown, rate]);

  return (
    <main className="min-h-screen px-4 sm:px-6 md:px-10 py-8 mx-auto max-w-6xl">
      <Toaster />

      {/* Header */}
      <header className="header-bar sticky top-0 z-40 mb-8 backdrop-blur">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 md:px-10 py-4">
          <div className="flex items-center gap-3">
            <Image
              src={SAM_CROWN_LOGO}
              alt="Sam Crown"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="font-semibold text-lg">Sam Crown</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/about" className="hover:underline">About</Link>
          </nav>
        </div>
      </header>

      {/* Hero / Intro */}
      <section className="card p-6 sm:p-8 mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold crown-text-gradient">SAM Crown Game</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          World App Mini App — crown UI restored via <code>globals.css</code> and local components.
        </p>
      </section>

      {/* Crown + Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Crowned Sam + badge */}
        <div className="card p-6 flex items-center gap-6">
          <div className="relative">
            <Image
              src={SAM_WITH_CROWN}
              alt="SAM crowned"
              width={320}
              height={320}
              className="rounded-xl crown-glow"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <Image
              src={SAM_CROWN_LOGO}
              alt="Crown badge"
              width={84}
              height={84}
              className="rounded-full crown-glow"
            />
          </div>
        </div>

        {/* Holder + earning */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="badge">CU</div>
                <div>
                  <div className="font-semibold">Current Holder</div>
                  <div className="text-muted-foreground text-sm">{tokens.toLocaleString()} tokens</div>
                </div>
              </div>
              <div className="text-muted-foreground">#{hasCrown ? 1 : 0}</div>
            </div>
          </div>

          <div className="card p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">Earning Rate</div>
              <div className="text-muted-foreground text-sm">{rate} / min · cap {cap.toLocaleString()}</div>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-2 rounded-full crown-gradient"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="card mt-8 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <WorldVerifyButton onVerified={handleVerified} />
          <button
            type="button"
            onClick={claim}
            disabled={!verified || hasCrown}
            className="btn hover-elevate-2 border border-border"
          >
            {hasCrown ? 'Crown Held' : 'Claim Crown'}
          </button>
          <button
            type="button"
            onClick={steal}
            disabled={!verified || hasCrown}
            className="btn hover-elevate-2 border border-border"
          >
            Steal Crown
          </button>
          <span className="text-sm text-muted-foreground">
            Status: {verified ? 'Verified' : 'Not verified'}
          </span>
        </div>
      </section>
    </main>
  );
}
