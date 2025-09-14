import { NextRequest, NextResponse } from 'next/server';
import { grabCrown, releaseCrown, getStats } from '@/lib/tokenStore';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') || undefined;
  return NextResponse.json(getStats(userId));
}

export async function POST(req: NextRequest) {
  const { userId, action } = await req.json();
  if (!userId || !action) {
    return NextResponse.json({ error: 'userId and action required' }, { status: 400 });
  }
  if (action === 'grab') {
    grabCrown(userId);
  } else if (action === 'release') {
    releaseCrown(userId);
  } else {
    return NextResponse.json({ error: 'invalid action' }, { status: 400 });
  }
  return NextResponse.json(getStats(userId));
}
