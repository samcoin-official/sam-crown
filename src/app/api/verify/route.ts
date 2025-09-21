import { NextResponse, type NextRequest } from 'next/server';
import { verifyCloudProof, type ISuccessResult } from '@worldcoin/minikit-js';

const APP_ID = process.env.NEXT_PUBLIC_WORLD_APP_ID as `app_${string}` | undefined;

type VerifyReq = {
  payload: ISuccessResult;
  action: string;
  signal?: string;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!APP_ID) {
    return NextResponse.json({ error: 'Missing NEXT_PUBLIC_WORLD_APP_ID' }, { status: 500 });
  }

  let body: VerifyReq;
  try {
    body = (await req.json()) as VerifyReq;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const result = await verifyCloudProof(body.payload, APP_ID, body.action, body.signal);
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server verify failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
