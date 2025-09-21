import { NextResponse } from 'next/server';

export async function GET() {
  // Expose only safe/public config here
  const worldAppId = process.env.NEXT_PUBLIC_WORLD_APP_ID ?? 'MISSING_APP_ID';

  return NextResponse.json(
    {
      worldAppId,
      // add other public tokens if needed
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
      },
    }
  );
}
