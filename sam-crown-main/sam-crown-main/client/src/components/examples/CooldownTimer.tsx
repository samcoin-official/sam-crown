import CooldownTimer from '../CooldownTimer';

export default function CooldownTimerExample() {
  const cooldownEnd = new Date(Date.now() + 45 * 60 * 1000); // 45 minutes from now

  return (
    <div className="p-4 max-w-sm">
      <CooldownTimer 
        endTime={cooldownEnd}
        onComplete={() => console.log('Cooldown complete!')}
      />
    </div>
  );
}