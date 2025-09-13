import { NextRequest, NextResponse } from 'next/server'

interface VerifyPayload {
  nullifier_hash: string;
  merkle_root: string;
  proof: string;
  verification_level: string;
}

interface IRequestPayload {
  payload: VerifyPayload;
  action: string;
  signal: string | undefined;
}

export async function POST(req: NextRequest) {
  const { payload, action, signal } = (await req.json()) as IRequestPayload
  
  const verifyResponse = await fetch('https://developer.worldcoin.org/api/v1/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.WORLD_API_KEY}`,
    },
    body: JSON.stringify({
      nullifier_hash: payload.nullifier_hash,
      merkle_root: payload.merkle_root,
      proof: payload.proof,
      verification_level: payload.verification_level,
      action: action,
      signal: signal || '',
    }),
  })

  const verifyRes = await verifyResponse.json()

  if (verifyRes.success) {
    return NextResponse.json({ verifyRes, status: 200 })
  } else {
    return NextResponse.json({ verifyRes, status: 400 })
  }
}