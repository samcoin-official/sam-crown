import { NextRequest, NextResponse } from 'next/server';
import { claimTokens, getStats } from '@/lib/tokenStore';

export async function POST(req: NextRequest) {
  const { userId, walletAddress } = await req.json();
  if (!userId || !walletAddress) {
    return NextResponse.json({ error: 'userId and walletAddress required' }, { status: 400 });
  }
  try {
    const amount = claimTokens(userId);
    return NextResponse.json({ amount, walletAddress });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') || undefined;
  return NextResponse.json(getStats(userId));
}
