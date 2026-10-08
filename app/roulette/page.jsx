'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Die neuen Cent- und Euro-Chips
const CHIP_VALUES = [0.10, 0.50, 1.00, 5.00, 10.00, 50.00];

export default function PremiumRouletteTable() {
  const [balance, setBalance] = useState(250.50); // Startguthaben mit Cent
  const [betAmount, setBetAmount] = useState(1.00);
  const [phase, setPhase] = useState('BETTING'); // BETTING, SPINNING, RESULT
  const [winningNumber, setWinningNumber] = useState(null);
  const [winningColor, setWinningColor] = useState(null);
  const [message, setMessage] = useState('EINSATZ PLATZIEREN');
  
  // Animation States
  const [wheelRotation, setWheelRotation] = useState(0);
  const [ballRotation, setBallRotation] = useState(0);

  // Lokale Simulation (kannst du später wieder mit deinen Sockets verknüpfen)
  const placeBet = (type) => {
    if (phase !== 'BETTING') return;
    if (balance < betAmount) {
      setMessage('⚠️ GUTHABEN ZU NIEDRIG ⚠️');
      return;
    }

    setBalance(prev => prev - betAmount);
    setPhase('SPINNING');
    setMessage('RIEN NE VA PLUS! (Nichts geht mehr)');

    // 1. Das Rad und die Kugel fangen an sich zu drehen (gegenläufig)
    const newWheelRot = wheelRotation + 1440 + Math.floor(Math.random() * 360); // Min 4 Umdrehungen
    const newBallRot = ballRotation - 1800 - Math.floor(Math.random() * 360); // Min 5 Umdrehungen in die andere Richtung
    
    setWheelRotation(newWheelRot);
    setBallRotation(newBallRot);

    // 2. Gewinnermittlung nach der Drehung (Simulation ca. 5 Sekunden)
    setTimeout(() => {
      const resultNum = Math.floor(Math.random() * 37); // 0-36
      const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(resultNum);
      const color = resultNum === 0 ? 'GREEN' : isRed ? 'RED' : 'BLACK';
      
      setWinningNumber(resultNum);
      setWinningColor(color);
      setPhase('RESULT');

      // Auswertung des Einsatzes
      if (type === color) {
        const winAmount = type === 'GREEN' ? betAmount * 36 : betAmount * 2;
        setBalance(prev => prev + winAmount);
        setMessage(`🎉 GEWONNEN! +${winAmount.toFixed(2)} AC 🎉`);
      } else {
        setMessage(`VERLOREN. Es war ${color} ${resultNum}`);
      }

      // Tisch nach 4 Sekunden wieder freigeben
      setTimeout(() => {
        setPhase('BETTING');
        setWinningNumber(null);
        setWinningColor(null);
        setMessage('NEUES SPIEL - EINSATZ PLATZIEREN');
      }, 4000);

    }, 5000); // Entspricht der CSS Transition Dauer
  };

  return (
    <div style={styles.casinoRoom}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Playfair+Display:ital,wght@1,700&display=swap');

        .wheel-spin {
          transition: transform 5s cubic-bezier(0.25, 0.1, 0.15, 1);
        }
        .ball-spin {
          transition: transform 5s cubic-bezier(0.2, 0.05, 0.1, 1);
        }
        .chip-active {
          transform: translateY(-10px) scale(1.1);
          box-shadow: 0 15px 25px rgba(0,0,0,0.6), inset 0 0 15px rgba(255,255,255,0.4) !important;
          border-color: #fff !important;
        }
        .bet-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.2);
        }
        .bet-btn:active {
          transform: translateY(2px);
        }
        .pulse-win {
          animation: winPulse 1s infinite alternate;
        }
        @keyframes winPulse {
          from { box-shadow: 0 0 20px #d4af37, inset 0 0 20px #d4af37; }
          to { box-shadow: 0 0 50px #fff, inset 0 0 50px #fff; }
        }
      `}</style>

      {/* 4K Mahagoni Tisch-Oberfläche */}
      <div style={styles.tableWood}>
        <div style={styles.feltSurface}>
          
          <div style={styles.header}>
            <h1 style={styles.title}>ABISINO ROULETTE</h1>
            <div style={styles.balanceBadge}>
              <span style={{ fontSize: '0.8rem', color: '#ccc' }}>KONTO</span>
              <span>{balance.toFixed(2)} AC</span>
            </div>
          </div>

          {/* Der 3D Kessel (Wheel) */}
          <div style={styles.rouletteArena}>
            {/* Das äußere Holzgehäuse des Kessels */}
            <div style={styles.wheelBowl}>
              
              {/* Die rotierende innere Scheibe mit den Zahlen */}
              <div 
                className="wheel-spin"
                style={{
                  ...styles.wheelInner,
                  transform: `rotate(${wheelRotation}deg)`
                }}
              >
                {/* Goldener Pivot (Mitte) */}
                <div style={styles.centerPivot}></div>
              </div>

              {/* Die Kugel und ihre Laufbahn (Unabhängig vom Rad) */}
              <div 
                className="ball-spin"
                style={{
                  ...styles.ballTrack,
                  transform: `rotate(${ballRotation}deg)`
                }}
              >
                <div style={{
                  ...styles.ball,
                  // Wenn das Ergebnis feststeht, wandert die Kugel optisch in die Mitte zu den Zahlen
                  transform: phase === 'RESULT' ? 'translateY(40px)' : 'translateY(0)',
                  transition: 'transform 1s ease-out 4s' // Fällt am Ende der 5s Drehung
                }}></div>
              </div>

            </div>
          </div>

          {/* Luxus Digital-Display für Status & Gewinnzahl */}
          <div style={{
            ...styles.digitalDisplay,
            color: phase === 'RESULT' ? '#d4af37' : '#00ffcc',
            textShadow: phase === 'RESULT' ? '0 0 15px #d4af37' : '0 0 10px #00ffcc'
          }}>
            <div style={styles.messageText}>{message}</div>
            {winningNumber !== null && (
              <div style={styles.resultNumber}>
                <span style={{
                  ...styles.resultBadge,
                  backgroundColor: winningColor === 'RED' ? '#d32f2f' : winningColor === 'BLACK' ? '#111' : '#2e7d32'
                }}>
                  {winningNumber}
                </span>
              </div>
            )}
          </div>

          {/* Das Wett-Dashboard (Chips & Felder) */}
          <div style={styles.bettingDashboard}>
            
            <h3 style={styles.sectionTitle}>1. CHIP WÄHLEN</h3>
            <div style={styles.chipRack}>
              {CHIP_VALUES.map((val) => (
                <button
                  key={val}
                  onClick={() => phase === 'BETTING' && setBetAmount(val)}
                  className={betAmount === val ? 'chip-active' : ''}
                  style={{
                    ...styles.chip,
                    borderColor: betAmount === val ? '#fff' : '#d4af37'
                  }}
                >
                  {val < 1 ? `${(val * 100).toFixed(0)}c` : val.toFixed(0)}
                </button>
              ))}
            </div>

            <h3 style={styles.sectionTitle}>2. EINSATZ PLATZIEREN</h3>
            <div style={styles.bettingGrid}>
              <button 
                onClick={() => placeBet('RED')} 
                disabled={phase !== 'BETTING'}
                className="bet-btn"
                style={{ ...styles.betBox, backgroundColor: '#d32f2f', color: '#fff' }}
              >
                ROT (1:1)
              </button>
              
              <button 
                onClick={() => placeBet('GREEN')} 
                disabled={phase !== 'BETTING'}
                className="bet-btn"
                style={{ ...styles.betBox, backgroundColor: '#2e7d32', color: '#fff', fontSize: '1.5rem' }}
              >
                0 (1:36)
              </button>

              <button 
                onClick={() => placeBet('BLACK')} 
                disabled={phase !== 'BETTING'}
                className="bet-btn"
                style={{ ...styles.betBox, backgroundColor: '#111', color: '#fff' }}
              >
                SCHWARZ (1:1)
              </button>
            </div>

          </div>

          <Link href="/spiele" style={styles.exitLink}>
            Zurück zur Lobby
          </Link>
          
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DIE 4K 3D STYLES
// ==========================================
const styles = {
  casinoRoom: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)',
    fontFamily: 'system-ui, sans-serif',
    padding: '20px'
  },
  tableWood: {
    background: 'linear-gradient(45deg, #2a0800, #4a1500, #2a0800)',
    padding: '15px',
    borderRadius: '30px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,0,0,0.8)',
    width: '100%',
    maxWidth: '800px',
    border: '4px solid #111'
  },
  feltSurface: {
    // Authentischer Casino-Filz
    background: '#0b4a1c',
    backgroundImage: 'radial-gradient(circle, #0e5e24 0%, #062b10 100%)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.8)',
    border: '2px solid #d4af37',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
    paddingBottom: '15px'
  },
  title: {
    color: '#d4af37',
    fontFamily: "'Cinzel', serif",
    fontSize: '2rem',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
  },
  balanceBadge: {
    background: 'linear-gradient(to bottom, #222, #000)',
    border: '2px solid #d4af37',
    padding: '10px 20px',
    borderRadius: '8px',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    fontFamily: "monospace",
    fontSize: '1.2rem',
    fontWeight: 'bold',
    boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
  },
  // --- DER 3D KESSEL ---
  rouletteArena: {
    perspective: '1200px', // Erzeugt die 3D Tiefe
    marginBottom: '30px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  wheelBowl: {
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    // Kippt den Kessel nach hinten für den Kamera-Look
    transform: 'rotateX(50deg)', 
    transformStyle: 'preserve-3d',
    background: 'linear-gradient(145deg, #3a1500, #1a0500)',
    border: '15px solid #2a0800',
    boxShadow: '0 50px 30px rgba(0,0,0,0.8), inset 0 20px 40px rgba(0,0,0,0.9), inset 0 0 0 18px #d4af37',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wheelInner: {
    width: '240px',
    height: '240px',
    borderRadius: '50%',
    // Simuliert die rotierenden Fächer
    background: 'repeating-conic-gradient(from 0deg, #d32f2f 0deg 9.7deg, #111 9.7deg 19.4deg)',
    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9)',
    position: 'absolute',
    border: '4px solid #d4af37',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerPivot: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at top, #f9d71c, #8a6d20)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.8), inset 0 2px 5px rgba(255,255,255,0.5)',
    zIndex: 10
  },
  ballTrack: {
    width: '280px',
    height: '280px',
    borderRadius: '50%',
    position: 'absolute',
    zIndex: 5
  },
  ball: {
    width: '16px',
    height: '16px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    top: '-8px', // Liegt auf der oberen Kante der Laufbahn
    left: 'calc(50% - 8px)',
    boxShadow: 'inset -3px -3px 6px rgba(0,0,0,0.4), 0 5px 10px rgba(0,0,0,0.6)',
    background: 'radial-gradient(circle at 30% 30%, #ffffff, #d4d4d4)'
  },
  // --- DASHBOARD & WETTEN ---
  digitalDisplay: {
    background: '#050505',
    border: '2px solid #222',
    padding: '15px 30px',
    borderRadius: '10px',
    width: '100%',
    textAlign: 'center',
    marginBottom: '30px',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '80px',
    justifyContent: 'center'
  },
  messageText: {
    fontFamily: "'Orbitron', monospace",
    fontSize: '1.1rem',
    fontWeight: 'bold',
    letterSpacing: '2px'
  },
  resultNumber: {
    marginTop: '10px'
  },
  resultBadge: {
    color: '#fff',
    fontSize: '2rem',
    fontWeight: '900',
    padding: '5px 25px',
    borderRadius: '8px',
    border: '2px solid #d4af37',
    boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
  },
  bettingDashboard: {
    width: '100%',
    background: 'rgba(0,0,0,0.3)',
    padding: '20px',
    borderRadius: '15px',
    border: '1px solid rgba(212, 175, 55, 0.2)'
  },
  sectionTitle: {
    color: '#d4af37',
    fontFamily: "'Cinzel', serif",
    fontSize: '1rem',
    marginBottom: '15px',
    textAlign: 'center',
    letterSpacing: '1px'
  },
  chipRack: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: '30px'
  },
  chip: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, #222 0%, #000 100%)',
    border: '4px dashed #d4af37', // Typisches Casino-Chip Muster
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 10px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.2)'
  },
  bettingGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px'
  },
  betBox: {
    flex: 1,
    padding: '20px',
    borderRadius: '10px',
    border: '3px solid #d4af37',
    fontSize: '1.2rem',
    fontWeight: '900',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 8px 15px rgba(0,0,0,0.4)',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
  },
  exitLink: {
    marginTop: '30px',
    color: '#888',
    textDecoration: 'none',
    borderBottom: '1px solid #555',
    paddingBottom: '5px',
    transition: 'color 0.3s'
  }
};
