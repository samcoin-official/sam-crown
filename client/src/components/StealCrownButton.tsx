import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Swords, Loader2 } from 'lucide-react';

interface StealCrownButtonProps {
  onSteal?: () => void;
  isOnCooldown?: boolean;
  cooldownEndTime?: Date;
  disabled?: boolean;
  className?: string;
}

export default function StealCrownButton({ 
  onSteal, 
  isOnCooldown = false, 
  disabled = false, 
  className = '' 
}: StealCrownButtonProps) {
  const [isAttempting, setIsAttempting] = useState(false);

  const handleSteal = async () => {
    console.log('Steal crown attempt triggered');
    setIsAttempting(true);
    
    // TODO: Implement actual steal crown logic
    setTimeout(() => {
      setIsAttempting(false);
      onSteal?.();
    }, 2000);
  };

  const isDisabled = disabled || isOnCooldown || isAttempting;

  return (
    <Button
      onClick={handleSteal}
      disabled={isDisabled}
      size="lg"
      className={`bg-crown-gold hover:bg-crown-gold/90 text-crown-gold-foreground border-crown-gold-border crown-glow font-gaming ${className}`}
      data-testid="button-steal-crown"
    >
      {isAttempting ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Stealing Crown...
        </>
      ) : (
        <>
          <Swords className="w-5 h-5 mr-2" />
          {isOnCooldown ? 'On Cooldown' : 'Steal Crown'}
        </>
      )}
    </Button>
  );
}