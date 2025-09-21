import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Check } from 'lucide-react';
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';
import { toast } from '@/hooks/use-toast';

interface WorldIDButtonProps {
  onVerify?: (verified: boolean) => void;
  isVerified?: boolean;
  className?: string;
}

export default function WorldIDButton({ onVerify, isVerified = false, className = '' }: WorldIDButtonProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMiniKitAvailable, setIsMiniKitAvailable] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsMiniKitAvailable(MiniKit.isInstalled());
  }, []);

  useEffect(() => {
    if (isMiniKitAvailable === false) {
      toast({
        title: 'Open in World App',
        description: 'World ID verification is only available inside World App. Open the mini app within World App to continue.',
      });
    }
  }, [isMiniKitAvailable]);

  const handleVerify = async () => {
    console.log('World ID verification triggered');
    setIsVerifying(true);
    setErrorMessage(null);

    if (isMiniKitAvailable !== true) {
      console.log('MiniKit not installed, prompting user to open World App');
      toast({
        title: 'Open in World App',
        description: 'World ID verification requires the World App. Please open this mini app inside World App to continue.',
      });
      setIsVerifying(false);
      return;
    }

    try {
      const verifyPayload: VerifyCommandInput = {
        action: 'play-and-earn', // Your action ID from Developer Portal
        signal: undefined, // Optional additional data
        verification_level: VerificationLevel.Orb, // Orb verification for humans
      };

      // World App will open verification drawer
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);
      
      if (finalPayload.status === 'error') {
        console.log('Verification error:', finalPayload);
        const message =
          'error' in finalPayload && typeof finalPayload.error === 'string'
            ? finalPayload.error
            : 'Verification was not completed. Please try again.';
        setErrorMessage(message);
        toast({
          variant: 'destructive',
          title: 'Verification failed',
          description: message,
        });
        setIsVerifying(false);
        return;
      }

      // Send proof to backend for verification
      const verifyResponse = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proof: (finalPayload as ISuccessResult).proof,
          action: 'play-and-earn',
          signal: 'sam-crown-verification',
        }),
      });

      let verifyResponseJson: { success?: boolean; error?: string } | null = null;

      try {
        verifyResponseJson = await verifyResponse.json();
      } catch (parseError) {
        console.error('Failed to parse verification response:', parseError);
      }

      if (!verifyResponse.ok || !verifyResponseJson?.success) {
        const message =
          verifyResponseJson?.error ??
          (verifyResponse.ok
            ? 'Verification failed. Please try again.'
            : `Verification failed (${verifyResponse.status}). Please try again.`);
        console.log('Backend verification failed:', message);
        setErrorMessage(message);
        toast({
          variant: 'destructive',
          title: 'Verification failed',
          description: message,
        });
        return;
      }

      if (verifyResponseJson.success) {
        console.log('Verification success!');
        onVerify?.(true);
      }
    } catch (error) {
      console.error('World ID verification error:', error);
      const message = 'An unexpected error occurred during verification. Please try again.';
      setErrorMessage(message);
      toast({
        variant: 'destructive',
        title: 'Verification error',
        description: message,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerified) {
    return (
      <Badge variant="secondary" className={`bg-gaming-success text-gaming-success-foreground ${className}`} data-testid="badge-verified">
        <Check className="w-4 h-4 mr-1" />
        Verified Human
      </Badge>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleVerify}
        disabled={isVerifying || isMiniKitAvailable === false}
        className={className}
        data-testid="button-world-id-verify"
      >
        <Shield className="w-4 h-4 mr-2" />
        {isVerifying ? 'Verifying...' : 'Verify with World ID'}
      </Button>
      {isMiniKitAvailable === false && (
        <p className="text-sm text-muted-foreground" data-testid="world-id-minikit-warning">
          Open this mini app inside World App to verify your humanity.
        </p>
      )}
      {errorMessage && (
        <p className="text-sm text-destructive" role="status" aria-live="assertive" data-testid="world-id-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}