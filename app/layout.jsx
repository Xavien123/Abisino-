// app/layout.jsx
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Abi Casino | High Stakes',
  description: 'Exclusive Multiplayer Crypto Casino',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="bg-casino-dark text-white min-h-screen font-sans selection:bg-casino-gold selection:text-black">
        <Navbar />
        <main className="pt-16 pb-8 px-4 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
