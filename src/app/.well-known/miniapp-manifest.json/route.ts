import { NextResponse } from 'next/server';

export async function GET() {
  const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID || 'MISSING_APP_ID';
  return NextResponse.json(
    {
      id: appId,
      name: 'Sam Crown',
      description: 'World App Mini App',
      icon_url: '/icon.png',
      homepage_url: '/',
      category: 'Earn'
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json'
      }
    }
  );
}
