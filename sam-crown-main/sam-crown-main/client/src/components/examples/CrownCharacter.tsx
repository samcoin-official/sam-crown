import CrownCharacter from '../CrownCharacter';

export default function CrownCharacterExample() {
  return (
    <div className="flex gap-4 items-center p-4">
      <CrownCharacter size="sm" />
      <CrownCharacter size="md" />
      <CrownCharacter size="lg" />
      <CrownCharacter size="xl" />
    </div>
  );
}