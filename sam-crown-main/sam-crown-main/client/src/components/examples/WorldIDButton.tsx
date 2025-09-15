import { useState } from 'react';
import WorldIDButton from '../WorldIDButton';

export default function WorldIDButtonExample() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <WorldIDButton 
        onVerify={setIsVerified}
        isVerified={isVerified}
      />
      {isVerified && (
        <p className="text-sm text-muted-foreground">Verification complete!</p>
      )}
    </div>
  );
}