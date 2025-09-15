'use client';
import { MiniKit, VerifyCommandInput, VerificationLevel } from '@worldcoin/minikit-js'
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useCallback, useState, useMemo } from 'react';

export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { isInstalled } = useMiniKit();

  const verifyPayload: VerifyCommandInput = useMemo(() => ({
    action: 'play-and-earn',
    signal: '',
    verification_level: VerificationLevel.Orb,
  }), []);

  const handleVerify = useCallback(async () => {
    if (!isInstalled || isPending) {
      return;
    }

    setIsPending(true);
    
    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload)
      
      if (finalPayload.status === 'error') {
        console.log('Error payload', finalPayload)
        setIsPending(false);
        return;
      }

      const verifyResponse = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload,
          action: 'play-and-earn',
          signal: '',
        }),
      })

      const verifyResponseJson = await verifyResponse.json()
      if (verifyResponseJson.status === 200) {
        setIsVerified(true);
        console.log('Verification success!')
      }
    } catch (error) {
      console.error('World ID verification error', error);
    } finally {
      setIsPending(false);
    }
  }, [isInstalled, isPending, verifyPayload]);

  if (isVerified) {
    return (
      <div className="text-center">
        <p className="text-green-600 font-semibold mb-4">✅ Verified Human</p>
        <p className="text-gray-600">Welcome to SAM Crown!</p>
      </div>
    );
  }

  return (
    <LiveFeedback
      label={{
        failed: 'Verification failed',
        pending: 'Verifying with World ID',
        success: 'Verified',
      }}
      state={isPending ? 'pending' : undefined}
    >
      <Button
        onClick={handleVerify}
        disabled={isPending || !isInstalled}
        size="lg"
        variant="primary"
      >
        Verify with World ID
      </Button>
    </LiveFeedback>
  );
};