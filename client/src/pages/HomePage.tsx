import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CrownHolder from '@/components/CrownHolder';
import StealCrownButton from '@/components/StealCrownButton';
import CooldownTimer from '@/components/CooldownTimer';
import WorldIDButton from '@/components/WorldIDButton';
import GameStats from '@/components/GameStats';
import TokenEarningRate from '@/components/TokenEarningRate';
import CrownIcon from '@/components/CrownIcon';
import { Info, AlertTriangle, Trophy, Users, HelpCircle } from 'lucide-react';
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

const mockLeaderboard = [
  { rank: 1, name: 'Alex Champion', totalCrownTime: '12h 34m', isVerified: true },
  { rank: 2, name: 'Sarah Ruler', totalCrownTime: '10h 15m', isVerified: true },
  { rank: 3, name: 'Mike King', totalCrownTime: '8h 42m', isVerified: true },
  { rank: 4, name: 'Lisa Crown', totalCrownTime: '7h 28m', isVerified: true },
  { rank: 5, name: 'Tom Royal', totalCrownTime: '6h 53m', isVerified: true },
  { rank: 6, name: 'You', totalCrownTime: '2h 17m', isVerified: true }
];

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

      {/* Main Content Tabs */}
      <Tabs defaultValue="game" className="w-full">
        <TabsList className="grid w-full grid-cols-3" data-testid="main-tabs">
          <TabsTrigger value="game" className="flex items-center gap-2" data-testid="tab-game">
            <CrownIcon size="sm" />
            Play
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2" data-testid="tab-leaderboard">
            <Trophy className="w-4 h-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2" data-testid="tab-info">
            <HelpCircle className="w-4 h-4" />
            How to Play
          </TabsTrigger>
        </TabsList>

        {/* Game Tab */}
        <TabsContent value="game" className="space-y-6">
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
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Crown Champions
              </CardTitle>
              <p className="text-sm text-muted-foreground">Players ranked by total crown time</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLeaderboard.map((player) => (
                  <div key={player.rank} className="flex items-center justify-between p-3 rounded-lg border hover-elevate" data-testid={`leaderboard-player-${player.rank}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        #{player.rank}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium" data-testid={`player-name-${player.rank}`}>{player.name}</span>
                          {player.isVerified && (
                            <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                              <Users className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rank #{player.rank} player
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-primary" data-testid={`crown-time-display-${player.rank}`}>
                        {player.totalCrownTime}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        total time
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                How to Play SAM Crown
              </CardTitle>
              <p className="text-sm text-muted-foreground">Master the crown game in three simple steps</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Verify with World ID</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Prove you're human using World ID verification. This ensures fair play and prevents bots from dominating the game.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Human verification required • One account per person</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 font-bold flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Steal the Crown</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    When someone else has the crown, you'll see "User has the crown, steal it!" Click to automatically take it and start earning SAM tokens.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CrownIcon size="sm" />
                    <span>Automatic stealing • 1-hour cooldown after taking crown</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 font-bold flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Hold & Earn</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    When you have the crown, you'll see "You have the crown" with a timer showing how long you've held it. Other players can steal it automatically.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Trophy className="w-4 h-4" />
                    <span>50k SAM tokens distributed daily • Compete for longest crown time</span>
                  </div>
                </div>
              </div>

              {/* Pro Tips */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Pro Tips:</strong> Check the leaderboard to see top players by crown time. The longer you hold the crown, the higher you climb in rankings. Crown ownership changes automatically when others steal it!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}