'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// VIP Symbole inklusive dem seltenen Kronen-Jackpot
const SYMBOLS = ['🍒', '🍋', '🔔', '💎', '🍀', '🎰', '👑'];

export default function UltraPremiumSlotMachine() {
  const [balance, setBalance] = useState(100);
  const [reels, setReels] = useState(['👑', '💎', '🎰']);
  // Jede Walze dreht sich jetzt unabhängig für maximalen Spannungsaufbau
  const [spinState, setSpinState] = useState([false, false, false]);
  const [leverPulled, setLeverPulled] = useState(false);
  const [message, setMessage] = useState('🔥 WILLKOMMEN IM HIGH ROLLER CLUB 🔥');
  const [winType, setWinType] = useState(null);

  const pullLever = () => {
    // Verhindert mehrfaches Ziehen während des Drehens
    if (spinState.some(s => s)) return;
    
    if (balance < 1) {
      setMessage('⚠️ GUTHABEN ZU NIEDRIG ⚠️');
      setWinType('error');
      return;
    }

    setBalance(prev => prev - 1);
    setWinType(null);
    setLeverPulled(true);
    setMessage('🎰 WALZEN DREHEN... 🎰');
    
    // Hebel schnellt nach 500ms zurück
    setTimeout(() => setLeverPulled(false), 500);
    
    // Alle Walzen starten sofort
    setSpinState([true, true, true]);

    // Das Ergebnis wird im Hintergrund direkt gewürfelt
    const result = [
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];

    // Walze 1 stoppt nach 1 Sekunde
    setTimeout(() => {
      setReels([result[0], reels[1], reels[2]]);
      setSpinState([false, true, true]);
    }, 1000);

    // Walze 2 stoppt nach 1.8 Sekunden (Spannung steigt)
    setTimeout(() => {
      setReels([result[0], result[1], reels[2]]);
      setSpinState([false, false, true]);
    }, 1800);

    // Walze 3 stoppt nach 2.8 Sekunden (Finale)
    setTimeout(() => {
      setReels(result);
      setSpinState([false, false, false]);
      
      // Auswertung
      if (result[0] === result[1] && result[1] === result[2]) {
        if (result[0] === '👑' || result[0] === '💎' || result[0] === '🎰') {
            setBalance(prev => prev + 50);
            setMessage(`💰 MEGA JACKPOT! +50 AC 💰`);
            setWinType('jackpot');
        } else {
            setBalance(prev => prev + 15);
            setMessage(`🎉 SUPER GEWINN! +15 AC 🎉`);
            setWinType('bigwin');
        }
      } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
        setBalance(prev => prev + 2);
        setMessage('✨ GEWINN! +2 AC ✨');
        setWinType('win');
      } else {
        setMessage('💀 LEIDER NICHTS 💀');
      }
    }, 2800);
  };

  return (
    <div style={styles.casinoFloor}>
      {/* Die CSS-Engine für die 10x Aufwertung */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');

        @keyframes reel-spin {
          0% { transform: translateY(-80%); filter: blur(3px); opacity: 0.5; }
          100% { transform: translateY(80%); filter: blur(3px); opacity: 0.5; }
        }
        @keyframes jackpot-flash {
          0% { box-shadow: 0 0 20px #ffea00, inset 0 0 20px #ffea00; border-color: #ffea00; }
          50% { box-shadow: 0 0 50px #ff0055, inset 0 0 50px #ff0055; border-color: #ff0055; }
          100% { box-shadow: 0 0 20px #ffea00, inset 0 0 20px #ffea00; border-color: #ffea00; }
        }
        @keyframes led-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 100% 0; }
        }
        .spinning {
          animation: reel-spin 0.1s linear infinite;
        }
        .lever-stick {
          transition: transform 0.4s cubic-bezier(0.3, 1.5, 0.6, 1);
          transform-origin: bottom center;
        }
        .lever-pulled {
          transform: rotateX(75deg) translateY(25px);
        }
        .jackpot-mode {
          animation: jackpot-flash 0.5s infinite;
        }
      `}</style>

      {/* Das Gehäuse des Automaten (Massiver 3D Block) */}
      <div style={styles.machineBody} className={winType === 'jackpot' ? 'jackpot-mode' : ''}>
        
        {/* Der gewölbte Top-Header mit Goldkante */}
        <div style={styles.topBezel}>
          <h1 style={styles.logoText}>ABISINO ROYALE</h1>
        </div>

        {/* Die digitale LED-Matrix (Nachrichten) */}
        <div style={{
          ...styles.ledDisplay,
          color: winType === 'error' ? '#ff3333' : winType === 'jackpot' ? '#fff' : '#00ffcc',
          textShadow: winType === 'jackpot' ? '0 0 10px #fff, 0 0 20px #ff0055' : '0 0 8px #00ffcc'
        }}>
          {message}
        </div>

        {/* Das Haupt-Spielfeld: Walzen und Hebel */}
        <div style={styles.playArea}>
          
          {/* Das Walzen-Fenster mit innerem Schatten und Glas-Effekt */}
          <div style={styles.glassWindow}>
            
            {/* Payline Indikator (Rote Linie in der Mitte) */}
            <div style={styles.payline}></div>

            {/* Die 3 Walzen */}
            {[0, 1, 2].map((index) => (
              <div key={index} style={styles.reelColumn}>
                <div 
                  className={spinState[index] ? 'spinning' : ''}
                  style={{
                    fontSize: '4.5rem',
                    transition: 'all 0.05s',
                    textShadow: '0 5px 15px rgba(0,0,0,0.5)',
                    transform: spinState[index] ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {spinState[index] ? '💨' : reels[index]}
                </div>
              </div>
            ))}
          </div>

          {/* Der physische 3D Hebel rechts außen */}
          <div style={styles.leverBase} onClick={pullLever}>
            <div style={styles.leverTrack}></div>
            <div className={`lever-stick ${leverPulled ? 'lever-pulled' : ''}`} style={styles.leverArm}>
              <div style={styles.leverHandle}></div>
            </div>
          </div>
        </div>

        {/* Die Bodenkonsole mit Kontostand und Buttons */}
        <div style={styles.bottomConsole}>
          <div style={styles.balanceScreen}>
            <span style={styles.balanceTitle}>CREDITS</span>
            <span style={styles.balanceAmount}>{balance}</span>
          </div>

          {/* Spin-Button für Leute, die nicht am Hebel ziehen wollen */}
          <button 
            onClick={pullLever} 
            disabled={spinState.some(s => s)}
            style={{
              ...styles.spinButton,
              background: spinState.some(s => s) ? '#333' : 'radial-gradient(circle at top, #ff4b4b, #990000)'
            }}
          >
            {spinState.some(s => s) ? 'SPINNING...' : 'SPIN (1 AC)'}
          </button>
        </div>
      </div>

      <Link href="/spiele" style={styles.exitDoor}>
        🚪 Casino verlassen
      </Link>
    </div>
  );
}

// ==========================================
// DIE 10X DESIGN STYLES (Ultra Premium)
// ==========================================
const styles = {
  casinoFloor: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050505',
    // Ein atmosphärischer Casino-Teppich Hintergrund (dunkles Lila/Schwarz mit radialem Licht)
    backgroundImage: 'radial-gradient(circle at 50% 40%, #1a0b2e 0%, #000000 80%)',
    fontFamily: 'system-ui, sans-serif',
    padding: '20px'
  },
  machineBody: {
    background: 'linear-gradient(to bottom, #2a2a2a 0%, #111 100%)',
    border: '6px solid #1a1a1a',
    borderRadius: '25px',
    padding: '20px',
    width: '100%',
    maxWidth: '650px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.9), inset 0 2px 5px rgba(255,255,255,0.1), 0 0 30px rgba(212, 175, 55, 0.1)',
    position: 'relative',
    transition: 'all 0.3s ease',
    outline: '4px solid #d4af37', // Massiver Goldrahmen außen
    outlineOffset: '-2px'
  },
  topBezel: {
    background: 'linear-gradient(to right, #8a6d20, #ebd171, #8a6d20)',
    borderRadius: '15px 15px 5px 5px',
    padding: '15px',
    textAlign: 'center',
    marginBottom: '20px',
    boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.5), 0 10px 15px rgba(0,0,0,0.6)'
  },
  logoText: {
    margin: 0,
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '2.2rem',
    color: '#111',
    fontWeight: '900',
    letterSpacing: '4px',
    textShadow: '0 2px 2px rgba(255,255,255,0.6), 0 -1px 1px rgba(0,0,0,0.8)'
  },
  ledDisplay: {
    background: '#050505',
    border: '3px solid #111',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
    fontFamily: "'Orbitron', monospace",
    fontSize: '1.2rem',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '25px',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,1), 0 5px 10px rgba(0,0,0,0.5)',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase'
  },
  playArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '30px'
  },
  glassWindow: {
    display: 'flex',
    gap: '8px',
    background: '#e0e0e0',
    padding: '15px',
    borderRadius: '15px',
    border: '10px solid #1c1c1c',
    boxShadow: 'inset 0 20px 50px rgba(0,0,0,0.7), 0 10px 20px rgba(0,0,0,0.8)',
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden'
  },
  payline: {
    position: 'absolute',
    top: '50%',
    left: '0',
    width: '100%',
    height: '4px',
    background: 'rgba(255, 0, 0, 0.4)',
    boxShadow: '0 0 10px rgba(255,0,0,0.8)',
    zIndex: 10,
    pointerEvents: 'none',
    transform: 'translateY(-50%)'
  },
  reelColumn: {
    background: 'linear-gradient(to bottom, #fff 0%, #f0f0f0 50%, #e0e0e0 100%)',
    flex: 1,
    height: '140px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 5px 15px rgba(0,0,0,0.2), inset 0 -5px 15px rgba(0,0,0,0.2), border 1px solid #ccc',
    borderLeft: '1px solid #fff',
    borderRight: '1px solid #aaa',
    position: 'relative',
    zIndex: 1
  },
  leverBase: {
    width: '60px',
    height: '180px',
    marginLeft: '25px',
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    perspective: '800px' // Wichtig für den 3D Effekt des Hebels
  },
  leverTrack: {
    position: 'absolute',
    width: '20px',
    height: '120px',
    background: 'linear-gradient(to right, #000, #222, #000)',
    borderRadius: '10px',
    top: '30px',
    boxShadow: 'inset 0 0 15px #000, 0 0 5px rgba(255,255,255,0.1)'
  },
  leverArm: {
    position: 'absolute',
    width: '12px',
    height: '100px',
    background: 'linear-gradient(90deg, #999, #fff, #999)',
    top: '30px',
    zIndex: 2,
    borderRadius: '6px',
    boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.5), -5px 5px 10px rgba(0,0,0,0.5)'
  },
  leverHandle: {
    width: '50px',
    height: '50px',
    background: 'radial-gradient(circle at 15px 15px, #ff4b4b, #8b0000)',
    borderRadius: '50%',
    position: 'absolute',
    top: '-30px',
    left: '-19px',
    boxShadow: '0 10px 15px rgba(0,0,0,0.6), inset -5px -5px 15px rgba(0,0,0,0.4)',
    border: '2px solid #5a0000'
  },
  bottomConsole: {
    background: '#151515',
    borderTop: '2px solid #333',
    padding: '20px',
    borderRadius: '0 0 15px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  balanceScreen: {
    background: '#000',
    border: '2px solid #333',
    padding: '10px 20px',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '150px'
  },
  balanceTitle: {
    color: '#888',
    fontSize: '0.7rem',
    fontFamily: "'Orbitron', sans-serif",
    letterSpacing: '2px'
  },
  balanceAmount: {
    color: '#f9d71c',
    fontSize: '1.8rem',
    fontFamily: "'Orbitron', monospace",
    textShadow: '0 0 10px rgba(249, 215, 28, 0.4)'
  },
  spinButton: {
    border: 'none',
    borderRadius: '50px',
    padding: '15px 30px',
    color: '#fff',
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: '900',
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 8px 15px rgba(0,0,0,0.5), inset 0 5px 10px rgba(255,255,255,0.3)',
    textShadow: '0 2px 5px rgba(0,0,0,0.5)',
    transition: 'all 0.2s',
    letterSpacing: '1px'
  },
  exitDoor: {
    marginTop: '40px',
    color: '#666',
    textDecoration: 'none',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '0.9rem',
    borderBottom: '1px solid #333',
    paddingBottom: '5px',
    transition: 'color 0.3s'
  }
};
    
