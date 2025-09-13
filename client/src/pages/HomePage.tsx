import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CrownHolder from '@/components/CrownHolder';
import StealCrownButton from '@/components/StealCrownButton';
import CooldownTimer from '@/components/CooldownTimer';
import WorldIDButton from '@/components/WorldIDButton';
import GameStats from '@/components/GameStats';
import TokenEarningRate from '@/components/TokenEarningRate';
import CrownIcon from '@/components/CrownIcon';
import { Info, AlertTriangle } from 'lucide-react';
import { playSwipeSound, playSuccessSound } from '@/utils/sounds';

// TODO: remove mock data when implementing real backend
const mockCurrentHolder = {
  id: '1',
  name: 'Alex Champion',
  avatar: undefined,
  crownedAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
  tokensEarned: 1247,
  isVerified: true
};

const mockStats = {
  totalPlayers: 1247,
  totalCrownChanges: 893,
  longestReign: '4h 23m',
  totalTokensEarned: 156432
};

// Game configuration - sustainable token earning
const DAILY_TOKEN_POOL = 50000; // 50k SAM tokens per day (sustainable)

export default function HomePage() {
  const [isVerified, setIsVerified] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [cooldownEnd, setCooldownEnd] = useState<Date | null>(null);
  const [currentHolder, setCurrentHolder] = useState(mockCurrentHolder);
  const [userHasCrown, setUserHasCrown] = useState(false);

  const handleStealCrown = async () => {
    console.log('Crown stolen successfully!');
    
    try {
      // Play satisfying swipe sound first
      playSwipeSound();
      
      // TODO: implement real crown stealing logic
      
      // Mock: Update current holder to the user
      setCurrentHolder({
        id: '2',
        name: 'You',
        avatar: undefined,
        crownedAt: new Date(),
        tokensEarned: 0,
        isVerified: true
      });
      setUserHasCrown(true);
      
      // Set cooldown for 1 hour
      const cooldownEndTime = new Date(Date.now() + 60 * 60 * 1000);
      setCooldownEnd(cooldownEndTime);
      setIsOnCooldown(true);
      
      // Play success sound after a short delay
      setTimeout(() => {
        playSuccessSound();
      }, 300);
      
    } catch (error) {
      console.error('Crown steal failed:', error);
    }
  };

  const handleCooldownComplete = () => {
    setIsOnCooldown(false);
    setCooldownEnd(null);
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-2">
          <CrownIcon size="lg" withGlow />
          <h1 className="text-3xl font-bold font-gaming crown-text-gradient">SAM Crown Game</h1>
          <CrownIcon size="lg" withGlow />
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Compete to hold the SAM Crown and earn tokens! Steal the crown from others, but beware of the cooldown.
        </p>
      </div>

      {/* Verification Alert */}
      {!isVerified && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>You must verify with World ID to participate in the crown game.</span>
            <WorldIDButton onVerify={setIsVerified} isVerified={isVerified} />
          </AlertDescription>
        </Alert>
      )}

      {/* Current Crown Holder */}
      <CrownHolder holder={currentHolder} isCurrentUser={userHasCrown} />
      
      {/* Token Earning Rate */}
      {isVerified && (
        <TokenEarningRate 
          dailyPool={DAILY_TOKEN_POOL} 
          isHolding={userHasCrown}
        />
      )}

      {/* Game Actions */}
      {isVerified && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CrownIcon size="sm" />
              Game Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isOnCooldown && cooldownEnd && (
              <CooldownTimer 
                endTime={cooldownEnd} 
                onComplete={handleCooldownComplete}
              />
            )}
            
            <div className="flex flex-col gap-3">
              <StealCrownButton 
                onSteal={handleStealCrown}
                isOnCooldown={isOnCooldown}
                disabled={userHasCrown}
              />
              
              {userHasCrown && (
                <Badge variant="secondary" className="bg-gaming-success text-gaming-success-foreground self-center">
                  You hold the crown! Keep earning tokens.
                </Badge>
              )}
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>How it works:</strong> Steal the crown to start earning SAM tokens. 
                Each second you hold the crown earns you tokens. After stealing, you have a 1-hour cooldown.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Game Statistics */}
      <GameStats stats={mockStats} />
    </div>
  );
}