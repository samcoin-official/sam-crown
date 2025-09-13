import CrownTimer from '../CrownTimer';

export default function CrownTimerExample() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  return (
    <div className="p-4">
      <CrownTimer startTime={fiveMinutesAgo} />
    </div>
  );
}