import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Check, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';

interface WorldIDButtonProps {
  onVerify?: (verified: boolean) => void;
  isVerified?: boolean;
  className?: string;
}

export default function WorldIDButton({ onVerify, isVerified = false, className = '' }: WorldIDButtonProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMiniKitInstalled, setIsMiniKitInstalled] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [failureReason, setFailureReason] = useState<string | null>(null);

  useEffect(() => {
    setIsMiniKitInstalled(MiniKit.isInstalled());
  }, []);

  const handleVerify = async () => {
    console.log('World ID verification triggered');
    setStatusMessage(null);
    setFailureReason(null);
    setIsVerifying(true);

    if (!isMiniKitInstalled) {
      console.log('MiniKit not installed, using fallback verification');
      // Fallback for development/testing
      setTimeout(() => {
        setIsVerifying(false);
        onVerify?.(true);
      }, 2000);
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
        setStatusMessage('Verification failed—try again in World App');
        const errorDetails = (finalPayload as { error?: { code?: string; detail?: string; message?: string } }).error;
        if (errorDetails) {
          setFailureReason(errorDetails.detail || errorDetails.message || errorDetails.code || null);
        }
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

      const verifyResponseJson = await verifyResponse.json();

      if (verifyResponse.ok && verifyResponseJson.success) {
        console.log('Verification success!');
        onVerify?.(true);
      } else {
        console.log('Backend verification failed:', verifyResponseJson.error);
        setStatusMessage('Verification failed—try again in World App');
        setFailureReason(
          verifyResponseJson.error?.message ||
            verifyResponseJson.error ||
            (verifyResponse.ok ? 'Unknown verification error' : verifyResponse.statusText)
        );
      }
    } catch (error) {
      console.error('World ID verification error:', error);
      setStatusMessage('Verification failed—try again in World App');
      if (error instanceof Error) {
        setFailureReason(error.message);
      } else {
        setFailureReason('An unexpected error occurred during verification');
      }
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
        disabled={isVerifying}
        className={className}
        data-testid="button-world-id-verify"
      >
        <Shield className="w-4 h-4 mr-2" />
        {isVerifying
          ? 'Verifying...'
          : statusMessage || 'Verify with World ID'}
      </Button>
      {statusMessage && (
        <Alert variant="destructive" className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5" />
          <AlertDescription>
            <p>{statusMessage}</p>
            {failureReason && <p className="mt-1 text-muted-foreground">Details: {failureReason}</p>}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}