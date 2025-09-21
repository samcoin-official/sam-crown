'use client';

import { MiniKit } from '@worldcoin/minikit-js';

export default function MinikitInit() {
  // keep symbol in client bundle; no init needed
  void MiniKit;
  return null;
}
