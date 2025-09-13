import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Clock, Zap } from 'lucide-react';

interface GameStatsProps {
  stats: {
    totalPlayers: number;
    totalCrownChanges: number;
    longestReign: string;
    totalTokensEarned: number;
  };
  className?: string;
}

export default function GameStats({ stats, className = '' }: GameStatsProps) {
  const statItems = [
    {
      icon: Users,
      label: 'Total Players',
      value: stats.totalPlayers.toLocaleString(),
      color: 'text-blue-500'
    },
    {
      icon: Trophy,
      label: 'Crown Changes',
      value: stats.totalCrownChanges.toLocaleString(),
      color: 'text-crown-gold'
    },
    {
      icon: Clock,
      label: 'Longest Reign',
      value: stats.longestReign,
      color: 'text-green-500'
    },
    {
      icon: Zap,
      label: 'Tokens Earned',
      value: stats.totalTokensEarned.toLocaleString(),
      color: 'text-crown-gold'
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-crown-gold" />
          Game Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="text-center p-3 rounded-lg bg-background/50">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                <div className="font-gaming text-lg font-bold" data-testid={`stat-${item.label.toLowerCase().replace(' ', '-')}`}>
                  {item.value}
                </div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}