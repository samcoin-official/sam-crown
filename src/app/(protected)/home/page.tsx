'use client';

export default function SAMCrown() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-800 to-blue-600 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            SAM Crown
          </h1>
          <p className="text-blue-100">
            Crown competition game
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <div className="text-center space-y-4">
            <div className="text-white">
              <p>Simple crown game interface</p>
            </div>
            <button className="w-full bg-white text-purple-900 font-semibold py-3 px-4 rounded-lg">
              Test Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}