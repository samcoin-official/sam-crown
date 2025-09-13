import { useState, useEffect } from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TokenEarningRateProps {
  dailyPool: number;
  isHolding: boolean;
  className?: string;
}

export default function TokenEarningRate({ dailyPool, isHolding, className = '' }: TokenEarningRateProps) {
  // Calculate tokens per second from daily pool (spread over 24 hours)
  const tokensPerSecond = dailyPool / 86400; // 86400 seconds in a day
  const tokensPerMinute = tokensPerSecond * 60;
  const tokensPerHour = tokensPerMinute * 60;

  const [displayRate, setDisplayRate] = useState(tokensPerSecond);

  useEffect(() => {
    if (!isHolding) return;

    const interval = setInterval(() => {
      // Simulate real-time earning display
      setDisplayRate(prev => prev + 0.01); // Small fluctuation for dynamic feel
    }, 1000);

    return () => clearInterval(interval);
  }, [isHolding]);

  return (
    <Card className={`border-crown-gold/30 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-crown-gold" />
            <span className="font-medium">Earning Rate</span>
          </div>
          {isHolding && (
            <div className="flex items-center gap-1 text-xs text-gaming-success">
              <TrendingUp className="w-3 h-3" />
              <span>Active</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Per second:</span>
            <span className="font-gaming font-bold text-crown-gold" data-testid="rate-per-second">
              {tokensPerSecond.toFixed(3)} SAM
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Per hour:</span>
            <span className="font-gaming text-crown-gold">
              {tokensPerHour.toFixed(0)} SAM
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Daily pool:</span>
            <span className="font-gaming text-sm">
              {dailyPool.toLocaleString()} SAM
            </span>
          </div>
        </div>
        
        {!isHolding && (
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Steal the crown to start earning!
          </div>
        )}
      </CardContent>
    </Card>
  );
}