import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Check } from 'lucide-react';

interface WorldIDButtonProps {
  onVerify?: (verified: boolean) => void;
  isVerified?: boolean;
  className?: string;
}

export default function WorldIDButton({ onVerify, isVerified = false, className = '' }: WorldIDButtonProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    console.log('World ID verification triggered');
    setIsVerifying(true);
    
    // TODO: Implement actual World ID verification
    setTimeout(() => {
      setIsVerifying(false);
      onVerify?.(true);
    }, 2000);
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