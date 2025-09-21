'use client';
import CrownIcon from '@/components/CrownIcon';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export type CrownHolderProps = {
  name: string;
  avatarUrl?: string | null;
  tokens?: number;
  rank?: number;
};

export default function CrownHolder({
  name,
  avatarUrl,
  tokens = 0,
  rank,
}: CrownHolderProps) {
  return (
    <div className="card rounded-2xl p-4 border border-gray-800/60 flex items-center gap-4">
      <Avatar className="h-12 w-12">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={name} />
        ) : (
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="font-semibold text-yellow-300">{name}</div>
        <div className="text-sm text-gray-400">{tokens.toLocaleString()} tokens</div>
      </div>
      {typeof rank === 'number' && (
        <div className="text-sm text-gray-400 pr-3">#{rank}</div>
      )}
      <CrownIcon size="sm" />
    </div>
  );
}
