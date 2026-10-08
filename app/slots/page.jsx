'use client';
import { useState } from 'react';
import Link from 'next/link';

const SYMBOLS = ['🍒', '🍋', '🔔', '💎', '🍀', '🎰', '👑'];

export default function VariablePremiumSlotMachine() {
  const [balance, setBalance] = useState(250.50);
  const [betAmount, setBetAmount] = useState(1.00); // Variabler Einsatz
  const [reels, setReels] = useState(['👑', '💎', '🎰']);
  const [spinState, setSpinState] = useState([false, false, false]);
  const [leverPulled, setLeverPulled] = useState(false);
  const [message, setMessage] = useState('WÄHLE DEINEN EINSATZ');
  const [winType, setWinType] = useState(null);

  // Saubere JS-Mathematik für Kommazahlen (verhindert 0.300000004 Fehler)
  const adjustBet = (amount) => {
    if (spinState.some(s => s)) return; // Kein Ändern während des Drehens
    
    setBetAmount(prev => {
      let newBet = Math.round((prev + amount) * 100) / 100;
      if (newBet < 0.01) return 0.01;
      if (newBet > 100) return 100.00;
      return newBet;
    });
  };

  const pullLever = () => {
    if (spinState.some(s => s)) return;
    
    if (balance < betAmount) {
      setMessage('⚠️ GUTHABEN ZU NIEDRIG ⚠️');
      setWinType('error');
      return;
    }

    setBalance(prev => prev - betAmount);
    setWinType(null);
    setLeverPulled(true);
    setMessage('🎰 VIEL GLÜCK... 🎰');
    
    setTimeout(() => setLeverPulled(false), 500);
    setSpinState([true, true, true]);

    const result = [
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];

    setTimeout(() => { setReels([result[0], reels[1], reels[2]]); setSpinState([false, true, true]); }, 1000);
    setTimeout(() => { setReels([result[0], result[1], reels[2]]); setSpinState([false, false, true]); }, 1800);
    
    setTimeout(() => {
      setReels(result);
      setSpinState([false, false, false]);
      
      // Gewinne berechnen sich jetzt als Multiplikator deines variablen Einsatzes!
      if (result[0] === result[1] && result[1] === result[2]) {
        if (result[0] === '👑' || result[0] === '💎' || result[0] === '🎰') {
            const win = betAmount * 50; // 50-facher Einsatz
            setBalance(prev => prev + win);
            setMessage(`💰 MEGA JACKPOT! +${win.toFixed(2)} AC 💰`);
            setWinType('jackpot');
        } else {
            const win = betAmount * 15; // 15-facher Einsatz
            setBalance(prev => prev + win);
            setMessage(`🎉 SUPER GEWINN! +${win.toFixed(2)} AC 🎉`);
            setWinType('bigwin');
        }
      } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
        const win = betAmount * 2; // 2-facher Einsatz
        setBalance(prev => prev + win);
        setMessage(`✨ GEWINN! +${win.toFixed(2)} AC ✨`);
        setWinType('win');
      } else {
        setMessage('💀 LEIDER NICHTS 💀');
      }
    }, 2800);
  };

  return (
    <div style={styles.casinoFloor}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');

        @keyframes reel-spin {
          0% { transform: translateY(-80%); filter: blur(3px); }
          100% { transform: translateY(80%); filter: blur(3px); }
        }
        @keyframes jackpot-flash {
          0%, 100% { box-shadow: 0 0 20px #ffea00, inset 0 0 20px #ffea00; border-color: #ffea00; }
          50% { box-shadow: 0 0 50px #ff0055, inset 0 0 50px #ff0055; border-color: #ff0055; }
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
        .glass-glare {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%);
          pointer-events: none;
          z-index: 20;
          border-radius: 10px;
        }
      `}</style>

      {/* Das Gehäuse aus gebürstetem Metall */}
      <div style={styles.machineBody} className={winType === 'jackpot' ? 'jackpot-mode' : ''}>
        
        <div style={styles.topBezel}>
          <h1 style={styles.logoText}>ABISINO ROYALE</h1>
        </div>

        <div style={{
          ...styles.ledDisplay,
          color: winType === 'error' ? '#ff3333' : winType === 'jackpot' ? '#fff' : '#00ffcc',
          textShadow: winType === 'jackpot' ? '0 0 10px #fff, 0 0 20px #ff0055' : '0 0 8px #00ffcc'
        }}>
          {message}
        </div>

        {/* --- SPIELFELD MIT PERFEKTEM GRID (Kein Abschneiden mehr!) --- */}
        <div style={styles.playArea}>
          
          <div style={styles.glassWindow}>
            <div className="glass-glare"></div> {/* Fotorealistische Spiegelung */}
            <div style={styles.payline}></div>

            {/* CSS Grid für exakte Drittelung der Walzen */}
            <div style={styles.reelsGrid}>
              {[0, 1, 2].map((index) => (
                <div key={index} style={styles.reelColumn}>
                  <div 
                    className={spinState[index] ? 'spinning' : ''}
                    style={{
                      fontSize: '3.5rem', // Etwas kleiner für Mobile-Perfektion
                      textShadow: '0 5px 15px rgba(0,0,0,0.5)',
                      transform: spinState[index] ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.1s'
                    }}
                  >
                    {spinState[index] ? '💨' : reels[index]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.leverBase} onClick={pullLever}>
            <div style={styles.leverTrack}></div>
            <div className={`lever-stick ${leverPulled ? 'lever-pulled' : ''}`} style={styles.leverArm}>
              <div style={styles.leverHandle}></div>
            </div>
          </div>

        </div>

        {/* --- NEUES CONTROL PANEL MIT VARIABLEN EINSÄTZEN --- */}
        <div style={styles.bottomConsole}>
          
          {/* Guthaben Anzeige */}
          <div style={styles.balanceScreen}>
            <span style={styles.screenLabel}>CREDITS</span>
            <span style={styles.balanceAmount}>{balance.toFixed(2)}</span>
          </div>

          {/* Der variable Einsatz-Regler */}
          <div style={styles.bettingControls}>
            <span style={styles.screenLabel}>EINSATZ</span>
            <div style={styles.betRow}>
              <button style={styles.adjBtn} onClick={() => adjustBet(-1.0)}>-1</button>
              <button style={styles.adjBtn} onClick={() => adjustBet(-0.1)}>-0.1</button>
              
              <div style={styles.betDisplay}>
                {betAmount.toFixed(2)}
              </div>

              <button style={styles.adjBtn} onClick={() => adjustBet(0.1)}>+0.1</button>
              <button style={styles.adjBtn} onClick={() => adjustBet(1.0)}>+1</button>
            </div>
            <button style={styles.maxBtn} onClick={() => setBetAmount(100.00)}>MAX BET (100)</button>
          </div>

          {/* Spin Button */}
          <button 
            onClick={pullLever} 
            disabled={spinState.some(s => s)}
            style={{
              ...styles.spinButton,
              background: spinState.some(s => s) ? '#333' : 'radial-gradient(circle at top, #ff4b4b, #990000)'
            }}
          >
            SPIN
          </button>
        </div>

      </div>

      <Link href="/spiele" style={styles.exitDoor}>
        🚪 Casino verlassen
      </Link>
    </div>
  );
}

// --- STYLES ---
const styles = {
  casinoFloor: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050505',
    backgroundImage: 'radial-gradient(circle at 50% 40%, #1a0b2e 0%, #000000 80%)',
    fontFamily: 'system-ui, sans-serif',
    padding: '10px'
  },
  machineBody: {
    background: 'linear-gradient(to bottom, #3a3a3a 0%, #1c1c1c 100%)', // Hellere Metall-Optik
    border: '4px solid #111',
    borderRadius: '25px',
    padding: '20px',
    width: '100%',
    maxWidth: '650px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.9), inset 0 2px 10px rgba(255,255,255,0.2), 0 0 30px rgba(212, 175, 55, 0.2)',
    position: 'relative',
    outline: '3px solid #d4af37',
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
    fontSize: '2rem',
    color: '#111',
    fontWeight: '900',
    letterSpacing: '3px',
    textShadow: '0 2px 2px rgba(255,255,255,0.6)'
  },
  ledDisplay: {
    background: '#050505',
    border: '3px solid #111',
    borderRadius: '8px',
    padding: '10px',
    textAlign: 'center',
    fontFamily: "'Orbitron', monospace",
    fontSize: '1rem',
    fontWeight: '700',
    marginBottom: '20px',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,1)',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase'
  },
  playArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '25px',
    gap: '10px'
  },
  glassWindow: {
    background: '#111',
    padding: '10px',
    borderRadius: '15px',
    border: '6px solid #222',
    boxShadow: 'inset 0 20px 50px rgba(0,0,0,0.9), 0 10px 20px rgba(0,0,0,0.8)',
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
    boxShadow: '0 0 15px rgba(255,0,0,1)',
    zIndex: 10,
    transform: 'translateY(-50%)'
  },
  reelsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // Die Lösung: Ein striktes Grid zwingt alle 3 Walzen in dieselbe Größe!
    gap: '8px',
    height: '130px'
  },
  reelColumn: {
    background: 'linear-gradient(to bottom, #eee 0%, #fff 50%, #ddd 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.4), inset 0 -10px 20px rgba(0,0,0,0.4)',
    border: '1px solid #999',
    zIndex: 1
  },
  leverBase: {
    width: '50px', // Feste Breite, damit er nicht weggedrückt wird
    flexShrink: 0, // Verhindert das Quetschen
    height: '160px',
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    perspective: '800px'
  },
  leverTrack: {
    position: 'absolute',
    width: '16px',
    height: '110px',
    background: 'linear-gradient(to right, #000, #222, #000)',
    borderRadius: '10px',
    top: '25px',
    boxShadow: 'inset 0 0 15px #000'
  },
  leverArm: {
    position: 'absolute',
    width: '10px',
    height: '90px',
    background: 'linear-gradient(90deg, #999, #fff, #999)',
    top: '25px',
    zIndex: 2,
    borderRadius: '5px',
    boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.5)'
  },
  leverHandle: {
    width: '45px',
    height: '45px',
    background: 'radial-gradient(circle at 15px 15px, #ff4b4b, #8b0000)',
    borderRadius: '50%',
    position: 'absolute',
    top: '-25px',
    left: '-17px',
    boxShadow: '0 10px 15px rgba(0,0,0,0.6)',
    border: '2px solid #5a0000'
  },
  bottomConsole: {
    background: '#151515',
    borderTop: '2px solid #333',
    padding: '15px',
    borderRadius: '0 0 15px 15px',
    display: 'flex',
    flexDirection: 'column', // Alles untereinander für Mobile
    gap: '15px',
    alignItems: 'center'
  },
  balanceScreen: {
    background: '#000',
    border: '2px solid #333',
    padding: '8px 20px',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  screenLabel: {
    color: '#888',
    fontSize: '0.6rem',
    fontFamily: "'Orbitron', sans-serif",
    letterSpacing: '2px',
    marginBottom: '5px'
  },
  balanceAmount: {
    color: '#f9d71c',
    fontSize: '1.5rem',
    fontFamily: "'Orbitron', monospace",
    textShadow: '0 0 10px rgba(249, 215, 28, 0.4)'
  },
  bettingControls: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#0a0a0a',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #222'
  },
  betRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    width: '100%',
    marginBottom: '8px'
  },
  adjBtn: {
    background: '#222',
    border: '1px solid #444',
    color: '#fff',
    padding: '8px 10px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  betDisplay: {
    background: '#000',
    border: '2px solid #d4af37',
    color: '#fff',
    padding: '8px 15px',
    fontFamily: "'Orbitron', monospace",
    fontSize: '1.2rem',
    borderRadius: '4px',
    minWidth: '80px',
    textAlign: 'center',
    boxShadow: 'inset 0 0 10px rgba(212,175,55,0.2)'
  },
  maxBtn: {
    background: 'linear-gradient(to bottom, #d4af37, #8a6d20)',
    border: 'none',
    color: '#000',
    padding: '5px 15px',
    borderRadius: '4px',
    fontWeight: '900',
    fontSize: '0.8rem',
    cursor: 'pointer',
    width: '100%'
  },
  spinButton: {
    border: 'none',
    borderRadius: '50px',
    padding: '15px 0',
    width: '100%',
    color: '#fff',
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: '900',
    fontSize: '1.2rem',
    cursor: 'pointer',
    boxShadow: '0 8px 15px rgba(0,0,0,0.5), inset 0 5px 10px rgba(255,255,255,0.3)',
    textShadow: '0 2px 5px rgba(0,0,0,0.5)',
    letterSpacing: '2px'
  },
  exitDoor: {
    marginTop: '30px',
    color: '#666',
    textDecoration: 'none',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '0.9rem',
    borderBottom: '1px solid #333',
    paddingBottom: '5px'
  }
};
