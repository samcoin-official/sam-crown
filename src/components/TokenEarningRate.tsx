'use client';
import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

export type TokenEarningRateProps = {
  perMinute: number;     // tokens per minute
  capacity?: number;     // optional cap
};

export default function TokenEarningRate({ perMinute, capacity }: TokenEarningRateProps) {
  const pct = useMemo(() => {
    if (!capacity) return 0;
    const p = Math.min(100, Math.max(0, (perMinute / capacity) * 100));
    return Math.round(p);
  }, [perMinute, capacity]);

  return (
    <div className="card rounded-2xl p-4 border border-gray-800/60">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-200">Earning Rate</span>
        <span className="text-sm text-gray-400">
          {perMinute.toLocaleString()} / min{capacity ? ` · cap ${capacity.toLocaleString()}` : ''}
        </span>
      </div>
      {capacity ? <Progress value={pct} /> : <div className="text-sm text-gray-400">No cap</div>}
    </div>
  );
}
