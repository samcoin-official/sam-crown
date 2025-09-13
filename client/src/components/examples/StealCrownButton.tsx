import { useState } from 'react';
import StealCrownButton from '../StealCrownButton';

export default function StealCrownButtonExample() {
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  const handleSteal = () => {
    console.log('Crown stolen!');
    setIsOnCooldown(true);
    // Reset cooldown after demo
    setTimeout(() => setIsOnCooldown(false), 5000);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <StealCrownButton onSteal={handleSteal} isOnCooldown={isOnCooldown} />
      <StealCrownButton disabled />
    </div>
  );
}