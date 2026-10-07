import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">Willkommen im Abi Casino</h1>
      
      <div className="flex gap-4">
        <Link 
          href="/roulette" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Zum Roulette
        </Link>
      </div>
    </div>
  );
}
