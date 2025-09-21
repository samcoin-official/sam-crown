// client/src/components/TokenEarningRate.tsx

// Define the component's props
interface TokenEarningRateProps {
  rate: string;
}

const TokenEarningRate = ({ rate }: TokenEarningRateProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Earning Rate:</span>
      <span className="text-lg font-semibold">{rate}</span>
    </div>
  );
};

export default TokenEarningRate;