// client/src/components/examples/TokenEarningRate.tsx

import { useState } from 'react';
import TokenEarningRate from '../TokenEarningRate';

export default function TokenEarningRateExample() {
  const [isHolding, setIsHolding] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Token Earning Rate Example</h2>
      <TokenEarningRate rate={isHolding ? '12.5' : '0.0'} />
      <button
        onClick={() => setIsHolding(!isHolding)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Toggle Holding Status
      </button>
    </div>
  );
}