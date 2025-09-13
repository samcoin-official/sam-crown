import { NextRequest, NextResponse } from 'next/server';

interface WorldVerifyResponse {
  success: boolean;
  code: string;
  detail: string;
  attribute: any;
  nullifier_hash: string;
  verification_level: string;
}

export async function POST(request: NextRequest) {
  try {
    const { proof } = await request.json();
    
    if (!proof || !proof.nullifier_hash) {
      return NextResponse.json({ error: 'Invalid proof data' }, { status: 400 });
    }

    // Verify proof with World ID Cloud API
    const verifyResponse = await fetch('https://developer.worldcoin.org/api/v1/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WORLD_API_KEY}`,
      },
      body: JSON.stringify({
        nullifier_hash: proof.nullifier_hash,
        merkle_root: proof.merkle_root,
        proof: proof.proof,
        verification_level: proof.verification_level,
        action: process.env.WORLD_ACTION_ID,
        signal: '',
      }),
    });

    const verifyData: WorldVerifyResponse = await verifyResponse.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { error: 'World ID verification failed', detail: verifyData.detail },
        { status: 400 }
      );
    }

    const nullifier = verifyData.nullifier_hash;
    
    // For now, simulate successful crown claim
    return NextResponse.json({
      ok: true,
      message: 'Crown claimed successfully!',
      crownHolder: nullifier.slice(0, 8),
      canClaim: false,
      earnings: '0',
      nextAttemptTime: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour cooldown
    });

  } catch (error) {
    console.error('Claim crown API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}