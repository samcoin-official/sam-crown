'use client';

import { useState } from 'react';
import {
  MiniKit,
  VerificationLevel,
  type ISuccessResult,
  type MiniAppVerifyActionErrorPayload,
} from '@worldcoin/minikit-js';
import { toast } from 'sonner';

const ACTION_ID = process.env.NEXT_PUBLIC_WORLD_ACTION ?? 'play-and-earn';

export default function WorldVerifyButton() {
  const [loading, setLoading] = useState(false);

  const runVerify = async () => {
    if (!MiniKit.isInstalled()) {
      toast.info('Open this page inside World App to verify.');
      return;
    }

    setLoading(true);
    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: ACTION_ID,
        verification_level: VerificationLevel.Orb,
      });

      if (finalPayload.status === 'error') {
        const err = finalPayload as MiniAppVerifyActionErrorPayload;
        // tolerate differing SDK payload shapes without `any`
        const info = err as unknown as {
          detail?: string;
          message?: string;
          code?: string;
          error?: string;
        };
        const msg =
          info.detail ?? info.message ?? info.code ?? info.error ?? 'Verification cancelled.';
        toast.error(msg);
        return;
      }

      const success = finalPayload as ISuccessResult;

      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: success, action: ACTION_ID }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || data?.ok === false) {
        toast.error(data?.error ?? 'Verification failed on server.');
        return;
      }

      toast.success('World ID verified');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Verification failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={runVerify}
      disabled={loading}
      className="btn btn-primary crown-glow hover-elevate-2"
    >
      {loading ? 'Verifying…' : 'Verify with World ID'}
    </button>
  );
}
