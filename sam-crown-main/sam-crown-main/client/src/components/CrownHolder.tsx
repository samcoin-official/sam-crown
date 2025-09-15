import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import CrownIcon from './CrownIcon';
import CrownCharacter from './CrownCharacter';
import CrownTimer from './CrownTimer';
import { Crown, Zap } from 'lucide-react';

interface CrownHolderProps {
  holder: {
    id: string;
    name: string;
    avatar?: string;
    crownedAt: Date;
    tokensEarned: number;
    isVerified: boolean;
  };
  isCurrentUser?: boolean;
  className?: string;
}

export default function CrownHolder({ holder, isCurrentUser = false, className = '' }: CrownHolderProps) {
  return (
    <Card className={`border-crown-gold-border bg-gradient-to-br from-crown-gold/5 to-crown-gold/10 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-crown-gold">
              <AvatarImage src={holder.avatar} alt={holder.name} />
              <AvatarFallback className="bg-crown-gold text-crown-gold-foreground font-semibold">
                {holder.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-lg" data-testid="text-holder-name">{holder.name}</span>
                {holder.isVerified && (
                  <Badge variant="secondary" className="bg-gaming-success text-gaming-success-foreground text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Crown className="w-4 h-4 text-crown-gold" />
                <span>Current Crown Holder</span>
              </div>
            </div>
          </div>
          {isCurrentUser ? (
            <CrownCharacter size="lg" />
          ) : (
            <CrownIcon size="lg" withGlow />
          )}
        </div>
        
        <div className="space-y-3">
          <CrownTimer startTime={holder.crownedAt} />
          
          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-crown-gold" />
              <span className="font-medium">SAM Tokens Earned</span>
            </div>
            <span className="font-gaming text-lg font-bold text-crown-gold" data-testid="text-tokens-earned">
              {holder.tokensEarned.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}