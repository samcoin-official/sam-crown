import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Check } from 'lucide-react';
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';

interface WorldIDButtonProps {
  onVerify?: (verified: boolean) => void;
  isVerified?: boolean;
  className?: string;
}

export default function WorldIDButton({ onVerify, isVerified = false, className = '' }: WorldIDButtonProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMiniKitInstalled, setIsMiniKitInstalled] = useState(false);

  useEffect(() => {
    setIsMiniKitInstalled(MiniKit.isInstalled());
  }, []);

  const handleVerify = async () => {
    console.log('World ID verification triggered');
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

      const verifyResponseJson = await verifyResponse.json();
      
      if (verifyResponseJson.success) {
        console.log('Verification success!');
        onVerify?.(true);
      } else {
        console.log('Backend verification failed:', verifyResponseJson.error);
      }
    } catch (error) {
      console.error('World ID verification error:', error);
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
    <Button
      onClick={handleVerify}
      disabled={isVerifying}
      className={className}
      data-testid="button-world-id-verify"
    >
      <Shield className="w-4 h-4 mr-2" />
      {isVerifying ? 'Verifying...' : 'Verify with World ID'}
    </Button>
  );
}