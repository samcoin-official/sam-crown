import { NextResponse } from 'next/server';

type Body = {
  signal?: string;
  proof?: unknown;
  action?: string;
};

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = await req.json();
  } catch {
    // ignore
  }
  // TODO: add real World ID proof verification here
  return NextResponse.json({ ok: true, received: body }, { status: 200 });
}
