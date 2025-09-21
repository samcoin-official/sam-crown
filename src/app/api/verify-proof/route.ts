import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let body: unknown = null;
  try { body = await req.json(); } catch {}
  return NextResponse.json({ ok: true, received: body });
}
