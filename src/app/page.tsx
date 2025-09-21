import CrownCharacter from '@/components/CrownCharacter';
import CrownIcon from '@/components/CrownIcon';
import CrownHolder from '@/components/CrownHolder';
import TokenEarningRate from '@/components/TokenEarningRate';
import WorldVerifyButton from '@/components/WorldVerifyButton';
// Add any action button imports here if you have them
// import GameActions from '@/components/GameActions';

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
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

      <section className="card p-4">
        <h2 className="text-xl font-semibold mb-3">World ID</h2>
        <p className="text-sm opacity-80 mb-4">
          Verify inside World App to enable Claim / Steal actions.
        </p>
        <WorldVerifyButton />
        {/* Add game actions here if you have a component for them */}
        {/* <GameActions /> */}
      </section>
    </main>
  );
}