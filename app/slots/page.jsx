"use client";
import { useState } from 'react';
import Link from 'next/link';

// Unsere Casino-Symbole
const SYMBOLS = ['🍒', '🍋', '💎', '🔔', '7️⃣'];

export default function SlotMachine() {
  // Simulierter Startkontostand: Deine 2 AC Willkommensbonus
  const [balance, setBalance] = useState(2);
  const [reels, setReels] = useState(['🎰', '🎰', '🎰']);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState('Einsatz: 1 AC pro Dreh');

  const spin = () => {
    if (balance < 1) {
      setMessage('Nicht genug Abi Coins! Bitte lade dein Konto auf.');
      return;
    }
    
    // 1 AC abziehen und Animation starten
    setBalance(prev => prev - 1);
    setSpinning(true);
    setMessage('Die Walzen drehen sich...');
    setReels(['🌀', '🌀', '🌀']); // Lade-Animation

    // Nach 1 Sekunde das Ergebnis anzeigen
    setTimeout(() => {
      const result = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ];
      
      setReels(result);
      setSpinning(false);
      
      // Gewinnprüfung
      if (result[0] === result[1] && result[1] === result[2]) {
        setBalance(prev => prev + 15);
        setMessage('💎 MEGA JACKPOT! +15 AC 💎');
      } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
        setBalance(prev => prev + 2);
        setMessage('Guter Treffer! +2 AC');
      } else {
        setMessage('Leider nichts. Versuch es nochmal!');
      }
    }, 1000);
  };

  return (
    <div className="main-container">
      <h1 className="luxury-title" style={{ fontSize: '3rem' }}>Slot Machine</h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '500px', marginBottom: '30px', padding: '15px', background: 'rgba(0,0,0,0.8)', border: '1px solid #d4af37', borderRadius: '8px' }}>
        <span style={{ color: '#c0ccc4', fontSize: '1.2rem' }}>Spieler: VIP-Gast</span>
        <span style={{ color: '#d4af37', fontSize: '1.2rem', fontWeight: 'bold' }}>Guthaben: {balance} AC</span>
      </div>

      {/* Die Slot-Maschine selbst */}
      <div style={{ background: 'linear-gradient(to bottom, #1a1a1a, #000)', padding: '40px', borderRadius: '15px', border: '2px solid #b38728', boxShadow: '0 10px 40px rgba(212,175,55,0.2)', marginBottom: '30px', width: '100%', maxWidth: '500px' }}>
        
        {/* Die Walzen (Reels) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
          {reels.map((symbol, index) => (
            <div key={index} style={{ fontSize: '4rem', width: '80px', textAlign: 'center', animation: spinning ? 'pulse 0.5s infinite' : 'none' }}>
              {symbol}
            </div>
          ))}
        </div>

        <p style={{ color: '#fcf6ba', fontSize: '1.3rem', height: '30px', marginBottom: '20px' }}>
          {message}
        </p>

        <button 
          onClick={spin} 
          disabled={spinning}
          className="btn-premium" 
          style={{ width: '100%', border: 'none', cursor: spinning ? 'not-allowed' : 'pointer', opacity: spinning ? 0.7 : 1 }}
        >
          {spinning ? 'Dreht...' : 'SPIN (1 AC)'}
        </button>
      </div>
      
      <Link href="/spiele" style={{ color: '#c0ccc4', textDecoration: 'none', borderBottom: '1px solid #c0ccc4' }}>
        Zurück zur Lobby
      </Link>
    </div>
  );
}
