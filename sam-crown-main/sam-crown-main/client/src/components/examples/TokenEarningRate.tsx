import { useState } from 'react';
import TokenEarningRate from '../TokenEarningRate';
import { Button } from '@/components/ui/button';

export default function TokenEarningRateExample() {
  const [isHolding, setIsHolding] = useState(false);
  
  return (
    <div className="p-4 max-w-sm space-y-4">
      <TokenEarningRate 
        dailyPool={50000} // 50k SAM tokens per day
        isHolding={isHolding} 
      />
      <Button 
        onClick={() => setIsHolding(!isHolding)}
        variant={isHolding ? "destructive" : "default"}
      >
        {isHolding ? 'Stop Holding' : 'Start Holding Crown'}
      </Button>
    </div>
  );
}