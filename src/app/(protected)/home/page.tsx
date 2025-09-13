'use client';

import { MiniKit } from '@worldcoin/minikit-js';
import { useState, useEffect } from 'react';

interface VerifyResponse {
  ok?: boolean;
  error?: string;
  message?: string;
  crownHolder?: string;
  canClaim?: boolean;
  nextAttemptTime?: string;
  earnings?: string;
}

export default function SAMCrown() {
  const [isVerified, setIsVerified] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [crownData, setCrownData] = useState<VerifyResponse | null>(null);
  const [cooldownTime, setCooldownTime] = useState<string>('');

  useEffect(() => {
    // Check if running in World App
    if (!MiniKit.isInstalled()) {
      console.log('Not running in World App');
    }
  }, []);

  const handleVerify = async () => {
    if (!MiniKit.isInstalled()) {
      alert('Please open this in the World App');
      return;
    }

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: process.env.NEXT_PUBLIC_WORLD_ACTION_ID!,
        signal: '',
        verification_level: 'orb',
      });

      if (finalPayload.status === 'success') {
        setIsVerified(true);
        // Check crown status after verification
        checkCrownStatus(finalPayload);
      } else {
        alert('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed. Please try again.');
    }
  };

  const checkCrownStatus = async (payload: any) => {
    try {
      const response = await fetch('/api/crown-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proof: payload }),
      });

      const data: VerifyResponse = await response.json();
      setCrownData(data);
    } catch (error) {
      console.error('Crown status error:', error);
    }
  };

  const handleClaimCrown = async () => {
    if (!isVerified) {
      alert('Please verify with World ID first');
      return;
    }

    setIsClaiming(true);

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: process.env.NEXT_PUBLIC_WORLD_ACTION_ID!,
        signal: '',
        verification_level: 'orb',
      });

      if (finalPayload.status !== 'success') {
        alert('Verification failed');
        setIsClaiming(false);
        return;
      }

      const response = await fetch('/api/claim-crown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proof: finalPayload }),
      });

      const data: VerifyResponse = await response.json();
      setCrownData(data);

      if (data.ok) {
        alert(`You claimed the SAM Crown! Start earning SAM tokens.`);
      } else {
        alert(data.error || 'Claim failed');
      }
    } catch (error) {
      console.error('Claim error:', error);
      alert('Claim failed. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-800 to-blue-600 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            👑 SAM Crown
          </h1>
          <p className="text-blue-100">
            Claim the crown, earn SAM tokens!
          </p>
        </div>

        {/* Main Game Area */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 space-y-6">
          {!isVerified ? (
            // Verification Screen
            <div className="text-center space-y-4">
              <div className="text-white">
                <p>Verify your humanity to compete for the SAM Crown</p>
              </div>
              <button
                onClick={handleVerify}
                className="w-full bg-white text-purple-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition"
              >
                🌍 Verify with World ID
              </button>
            </div>
          ) : (
            // Crown Game Interface
            <div className="text-center space-y-6">
              <div className="text-green-400 font-semibold">
                ✅ Verified Human
              </div>
              
              {/* Crown Status */}
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Crown Status</h3>
                {crownData?.crownHolder ? (
                  <div className="text-white text-sm">
                    <p>Current Holder: {crownData.crownHolder.slice(0, 8)}...</p>
                    <p>Earnings: {crownData.earnings || '0'} SAM</p>
                  </div>
                ) : (
                  <p className="text-white text-sm">Crown is available to claim!</p>
                )}
              </div>

              {/* Claim/Steal Button */}
              <button
                onClick={handleClaimCrown}
                disabled={isClaiming || !crownData?.canClaim}
                className={`w-full font-semibold py-3 px-4 rounded-lg transition ${
                  isClaiming || !crownData?.canClaim
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-yellow-900'
                }`}
              >
                {isClaiming 
                  ? '⏳ Claiming...' 
                  : crownData?.crownHolder 
                    ? '👑 Steal Crown'
                    : '👑 Claim Crown'
                }
              </button>

              {!crownData?.canClaim && crownData?.nextAttemptTime && (
                <div className="text-yellow-300 text-sm">
                  Next attempt available: {new Date(crownData.nextAttemptTime).toLocaleTimeString()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}