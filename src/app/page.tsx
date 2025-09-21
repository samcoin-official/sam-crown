import CrownCharacter from '@/components/CrownCharacter';
import CrownIcon from '@/components/CrownIcon';
import CrownHolder from '@/components/CrownHolder';
import TokenEarningRate from '@/components/TokenEarningRate';

export default function Page() {
  return (
    <div className="space-y-6">
      <section className="card rounded-2xl p-6 border border-gray-800/60">
        <h1 className="text-2xl font-bold text-yellow-300 mb-2">SAM Crown Game</h1>
        <p className="text-gray-300">
          World App Mini App — crown UI restored via <code>globals.css</code> and local components.
        </p>
      </section>

      <section className="flex items-center gap-6">
        <CrownCharacter size="md" />
        <CrownIcon size="lg" />
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <CrownHolder name="Current Holder" tokens={12850} rank={1} />
        <TokenEarningRate perMinute={420} capacity={1000} />
      </section>
    </div>
  );
}
