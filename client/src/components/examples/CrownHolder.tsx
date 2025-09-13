import CrownHolder from '../CrownHolder';

export default function CrownHolderExample() {
  const mockHolder = {
    id: '1',
    name: 'Alex Champion',
    avatar: undefined, // Will show initials fallback
    crownedAt: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    tokensEarned: 1247,
    isVerified: true
  };

  return (
    <div className="p-4 max-w-md">
      <CrownHolder holder={mockHolder} />
    </div>
  );
}