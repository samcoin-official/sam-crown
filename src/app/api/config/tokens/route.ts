import { NextResponse } from 'next/server';

export async function GET() {
  const worldAppId = process.env.NEXT_PUBLIC_WORLD_APP_ID ?? 'MISSING_APP_ID';
  return NextResponse.json({ worldAppId }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600' }
  });
}
