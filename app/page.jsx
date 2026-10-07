import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-800 to-slate-900">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-6 drop-shadow-lg">
          Willkommen im Abi Casino
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl">
          Erlebe Spannung und Nervenkitzel. Melde dich an und spiele mit!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6">
          <Link 
            href="/login" 
            className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-full text-lg shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105"
          >
            Jetzt Anmelden
          </Link>
          <Link 
            href="/roulette" 
            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 border border-slate-500 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105"
          >
            Spiele ansehen
          </Link>
        </div>
      </main>

      {/* Footer (optional, für den Casino-Look) */}
      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800">
        &copy; {new Date().getFullYear()} Abi Casino. Viel Glück!
      </footer>
    </div>
  );
}
