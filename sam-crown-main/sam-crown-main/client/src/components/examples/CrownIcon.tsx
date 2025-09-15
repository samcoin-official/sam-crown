import CrownIcon from '../CrownIcon';

export default function CrownIconExample() {
  return (
    <div className="flex gap-4 items-center p-4">
      <CrownIcon size="sm" />
      <CrownIcon size="md" />
      <CrownIcon size="lg" withGlow />
      <CrownIcon size="xl" withGlow />
    </div>
  );
}