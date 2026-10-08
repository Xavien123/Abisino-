'use client';
import { useState } from 'react';
import Link from 'next/link';

// VIP Casino Symbole
const SYMBOLS = ['🍒', '🍋', '🔔', '💎', '🍀', '🎰'];

export default function PremiumSlotMachine() {
  // Lokaler State (wird im nächsten Schritt mit Supabase verknüpft)
  const [balance, setBalance] = useState(100);
  const [reels, setReels] = useState(['🎰', '🎰', '🎰']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [leverPulled, setLeverPulled] = useState(false);
  const [message, setMessage] = useState('Willkommen im VIP Casino! Einsatz: 1 AC');
  const [winStatus, setWinStatus] = useState(null); // 'jackpot', 'win', 'loss', null

  const pullLever = () => {
    if (isSpinning) return;
    if (balance < 1) {
      setMessage('Nicht genug Abisino Coins! Lade dein Konto auf.');
      setWinStatus('loss');
      return;
    }

    // Hebel-Animation auslösen
    setLeverPulled(true);
    setTimeout(() => setLeverPulled(false), 400);

    // Spielablauf starten
    setBalance(prev => prev - 1);
    setIsSpinning(true);
    setWinStatus(null);
    setMessage('Viel Glück...');

    // Walzen drehen (Spannung aufbauen für 2 Sekunden)
    setTimeout(() => {
      const result = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ];

      setReels(result);
      setIsSpinning(false);

      // Gewinnberechnung
      if (result[0] === result[1] && result[1] === result[2]) {
        setBalance(prev => prev + 15);
        setMessage('🎰 MEGA JACKPOT! +15 AC 💎');
        setWinStatus('jackpot');
      } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
        setBalance(prev => prev + 2);
        setMessage('Guter Treffer! +2 AC');
        setWinStatus('win');
      } else {
        setMessage('Leider nichts. Versuch es nochmal!');
        setWinStatus('loss');
      }
    }, 2000);
  };

  return (
    <div style={styles.page}>
      {/* Integrierte CSS-Animationen für das echte Spiel-Gefühl */}
      <style>{`
        @keyframes roll {
          0% { transform: translateY(-100%); filter: blur(2px); }
          100% { transform: translateY(100%); filter: blur(2px); }
        }
        @keyframes glow {
          0% { box-shadow: 0 0 10px #d4af37; }
          50% { box-shadow: 0 0 30px #f9d71c, 0 0 10px #fff inset; }
          100% { box-shadow: 0 0 10px #d4af37; }
        }
        .rolling-reel {
          animation: roll 0.15s linear infinite;
          opacity: 0.8;
        }
        .jackpot-glow {
          animation: glow 1s ease-in-out infinite;
          border-color: #f9d71c !important;
        }
        .lever-base {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .lever-active {
          transform: rotateX(70deg) translateY(20px);
        }
      `}</style>

      {/* Haupt-Automat */}
      <div style={styles.machineContainer} className={winStatus === 'jackpot' ? 'jackpot-glow' : ''}>
        
        {/* Top Header: Name & Balance */}
        <div style={styles.header}>
          <h1 style={styles.title}>ABISINO SLOTS</h1>
          <div style={styles.balanceBox}>
            <span style={styles.balanceLabel}>GUTHABEN</span>
            <span style={styles.balanceValue}>{balance} AC</span>
          </div>
        </div>

        {/* Die Spiel-Oberfläche (Walzen + Hebel) */}
        <div style={styles.gameArea}>
          
          {/* Die 3 Walzen */}
          <div style={styles.reelsContainer}>
            {reels.map((symbol, index) => (
              <div key={index} style={styles.reelSlot}>
                <div 
                  className={isSpinning ? 'rolling-reel' : ''}
                  style={{
                    fontSize: '4rem',
                    transition: 'all 0.1s'
                  }}
                >
                  {isSpinning ? '?' : symbol}
                </div>
              </div>
            ))}
          </div>

          {/* Der physische Hebel (Rechte Seite) */}
          <div style={styles.leverContainer} onClick={pullLever}>
            <div style={styles.leverSlot}></div>
            <div style={styles.leverStick} className={`lever-base ${leverPulled ? 'lever-active' : ''}`}>
              <div style={styles.leverBall}></div>
            </div>
          </div>

        </div>

        {/* Nachrichten-Display wie bei echten Automaten */}
        <div style={{
          ...styles.messageDisplay,
          color: winStatus === 'jackpot' ? '#f9d71c' : winStatus === 'win' ? '#4ade80' : '#ff4444'
        }}>
          {message}
        </div>

        {/* Zurück-Button */}
        <Link href="/lobby" style={styles.backButton}>
          Zurück zur Lobby
        </Link>
      </div>
    </div>
  );
}

// Hochwertiges Premium-Styling (Dark & Gold)
const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    backgroundImage: 'radial-gradient(circle at center, #1a1a2e 0%, #000 100%)',
    fontFamily: 'system-ui, sans-serif'
  },
  machineContainer: {
    background: 'linear-gradient(145deg, #1c1c1c, #0d0d0d)',
    border: '4px solid #333',
    borderRadius: '20px',
    padding: '30px',
    width: '95%',
    maxWidth: '600px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 15px rgba(212, 175, 55, 0.2) inset',
    position: 'relative',
    transition: 'all 0.3s ease'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #d4af37',
    paddingBottom: '15px'
  },
  title: {
    color: '#d4af37', // Casino Gold
    fontSize: '1.8rem',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    letterSpacing: '2px'
  },
  balanceBox: {
    background: '#000',
    padding: '8px 15px',
    borderRadius: '8px',
    border: '1px solid #d4af37',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  balanceLabel: {
    color: '#888',
    fontSize: '0.7rem',
    textTransform: 'uppercase'
  },
  balanceValue: {
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  gameArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  reelsContainer: {
    display: 'flex',
    gap: '15px',
    background: '#111',
    padding: '20px',
    borderRadius: '15px',
    border: '3px solid #222',
    boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.8)',
    flexGrow: 1
  },
  reelSlot: {
    background: '#fff',
    flex: 1,
    height: '120px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: 'inset 0 5px 15px rgba(0,0,0,0.3)',
    border: '1px solid #ccc',
    position: 'relative'
  },
  leverContainer: {
    width: '60px',
    height: '160px',
    marginLeft: '20px',
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center'
  },
  leverSlot: {
    position: 'absolute',
    width: '15px',
    height: '100px',
    background: '#000',
    borderRadius: '10px',
    top: '30px',
    boxShadow: 'inset 0 0 10px #000'
  },
  leverStick: {
    position: 'absolute',
    width: '10px',
    height: '80px',
    background: 'linear-gradient(90deg, #888, #ccc, #888)',
    top: '30px',
    transformOrigin: 'bottom center',
    zIndex: 2,
    borderRadius: '5px'
  },
  leverBall: {
    width: '40px',
    height: '40px',
    background: 'radial-gradient(circle at 15px 15px, #ff3333, #8b0000)',
    borderRadius: '50%',
    position: 'absolute',
    top: '-20px',
    left: '-15px',
    boxShadow: '0 5px 10px rgba(0,0,0,0.5)'
  },
  messageDisplay: {
    background: '#000',
    padding: '15px',
    textAlign: 'center',
    borderRadius: '8px',
    border: '1px solid #333',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    minHeight: '24px',
    marginBottom: '20px',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
  },
  backButton: {
    display: 'block',
    textAlign: 'center',
    color: '#888',
    textDecoration: 'none',
    fontSize: '0.9rem',
    marginTop: '10px',
    transition: 'color 0.2s'
  }
};
