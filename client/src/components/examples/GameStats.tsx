import GameStats from '../GameStats';

export default function GameStatsExample() {
  const mockStats = {
    totalPlayers: 1247,
    totalCrownChanges: 893,
    longestReign: '4h 23m',
    totalTokensEarned: 156432
  };

  return (
    <div className="p-4 max-w-md">
      <GameStats stats={mockStats} />
    </div>
  );
}