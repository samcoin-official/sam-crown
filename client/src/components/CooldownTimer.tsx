import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface CooldownTimerProps {
  endTime: Date;
  onComplete?: () => void;
  className?: string;
}

export default function CooldownTimer({ endTime, onComplete, className = '' }: CooldownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const now = new Date().getTime();
    const end = endTime.getTime();
    const duration = Math.max(0, Math.floor((end - now) / 1000));
    
    setTimeLeft(duration);
    setTotalDuration(duration);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onComplete]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 100;

  if (timeLeft === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`} data-testid="cooldown-timer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Steal cooldown</span>
        </div>
        <span className="font-gaming text-sm font-medium">{formatTime(timeLeft)}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}