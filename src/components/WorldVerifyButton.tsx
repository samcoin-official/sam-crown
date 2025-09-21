'use client';

import { useState } from 'react';
import type { ReactElement } from 'react';
import {
  MiniKit,
  VerificationLevel,
  type ISuccessResult,
  type MiniAppVerifyActionErrorPayload,
} from '@worldcoin/minikit-js';
import { toast } from 'sonner';

type Props = {
  onVerified?: (result: ISuccessResult) => void;
};

const ACTION_ID: string =
  process.env.NEXT_PUBLIC_WORLD_ACTION ?? 'play-and-earn';

export default function WorldVerifyButton({ onVerified }: Props): ReactElement {
  const [loading, setLoading] = useState(false);

  const runVerify = async (): Promise<void> => {
    if (!MiniKit.isInstalled()) {
      toast.info('Open inside World App to verify.');
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
        const info = err as unknown as {
          detail?: string;
          message?: string;
          code?: string;
          error?: string;
        };
        toast.error(
          info.detail ?? info.message ?? info.code ?? info.error ?? 'Verification cancelled.'
        );
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
        toast.error(data?.error ?? 'Server verification failed.');
        return;
      }

      toast.success('World ID verified');
      onVerified?.(success);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Verification failed.');
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
