'use client';

import { useEffect, useState } from 'react';

interface Stats {
  tokensPerSecond: number;
  poolRemaining: number;
  distributionWallet: string;
  balance: number;
}

export default function SAMCrown() {
  const [stats, setStats] = useState<Stats | null>(null);
  const userId = 'demo-user';

  const fetchStats = async () => {
    const res = await fetch(`/api/claim?userId=${userId}`);
    const data = await res.json();
    setStats(data);
  };

  const claim = async () => {
    await fetch('/api/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, walletAddress: 'user-wallet' }),
    });
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-800 to-blue-600 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SAM Crown</h1>
          <p className="text-blue-100">Crown competition game</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <div className="text-center space-y-4">
            {stats && (
              <div className="text-white space-y-2">
                <p>Daily Pool: {stats.poolRemaining.toFixed(2)} SAM</p>
                <p>Rate: {stats.tokensPerSecond.toFixed(3)} SAM/s</p>
                <p>Wallet: {stats.distributionWallet}</p>
                <p>Your Balance: {stats.balance.toFixed(2)} SAM</p>
              </div>
            )}
            <button
              onClick={claim}
              className="w-full bg-white text-purple-900 font-semibold py-3 px-4 rounded-lg"
            >
              Claim Tokens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
