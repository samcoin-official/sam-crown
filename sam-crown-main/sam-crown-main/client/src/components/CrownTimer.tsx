import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CrownTimerProps {
  startTime?: Date;
  className?: string;
}

export default function CrownTimer({ startTime = new Date(), className = '' }: CrownTimerProps) {
  const [timeHeld, setTimeHeld] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = startTime.getTime();
      const diff = Math.floor((now - start) / 1000);
      setTimeHeld(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className={`flex items-center gap-2 font-gaming text-crown-gold ${className}`} data-testid="crown-timer">
      <Clock className="w-5 h-5" />
      <span className="text-lg font-semibold">{formatTime(timeHeld)}</span>
    </div>
  );
}