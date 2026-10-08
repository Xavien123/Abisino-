'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Die echte europäische Kessel-Reihenfolge
const WHEEL_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const RED_NUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

const CHIP_VALUES = [0.10, 0.50, 1.00, 5.00, 10.00, 50.00];

export default function MasterClassRoulette() {
  const [balance, setBalance] = useState(250.50);
  const [selectedChip, setSelectedChip] = useState(1.00);
  const [bets, setBets] = useState({}); // Speichert ALLE gesetzten Chips z.B. { '15': 5, 'RED': 10 }
  
  const [phase, setPhase] = useState('BETTING'); // BETTING, SPINNING, RESULT
  const [winningNumber, setWinningNumber] = useState(null);
  const [message, setMessage] = useState('EINSATZ PLATZIEREN');
  
  const [wheelRotation, setWheelRotation] = useState(0);
  const [ballRotation, setBallRotation] = useState(0);

  // Klick auf ein Feld platziert den aktuell ausgewählten Chip
  const placeBet = (field) => {
    if (phase !== 'BETTING') return;
    if (balance < selectedChip) {
      setMessage('⚠️ GUTHABEN ZU NIEDRIG ⚠️');
      return;
    }

    setBalance(prev => prev - selectedChip);
    setBets(prev => ({
      ...prev,
      [field]: (prev[field] || 0) + selectedChip
    }));
    setMessage(`+${selectedChip.toFixed(2)} auf ${field}`);
  };

  const clearBets = () => {
    if (phase !== 'BETTING') return;
    let totalRefund = Object.values(bets).reduce((a, b) => a + b, 0);
    setBalance(prev => prev + totalRefund);
    setBets({});
    setMessage('EINSÄTZE ZURÜCKGENOMMEN');
  };

  const spinWheel = () => {
    if (Object.keys(bets).length === 0) {
      setMessage('⚠️ BITTE ZUERST SETZEN ⚠️');
      return;
    }

    setPhase('SPINNING');
    setMessage('RIEN NE VA PLUS!');

    // Rad- und Kugel-Animation berechnen
    const resultIndex = Math.floor(Math.random() * 37);
    const resultNum = WHEEL_NUMBERS[resultIndex];
    
    // Berechne die genaue Gradzahl, bei der die Kugel stoppen muss (360/37 = 9.729 Grad pro Fach)
    const targetDegree = resultIndex * (360 / 37);
    
    // Rad dreht sich im Uhrzeigersinn (min 4 Runden)
    const newWheelRot = wheelRotation + 1440 + Math.floor(Math.random() * 360); 
    // Kugel dreht sich gegen den Uhrzeigersinn (min 5 Runden) und landet exakt auf dem Target-Winkel
    const baseBallSpins = ballRotation - 1800;
    const newBallRot = baseBallSpins - targetDegree;

    setWheelRotation(newWheelRot);
    setBallRotation(newBallRot);

    // Nach 5 Sekunden auswerten
    setTimeout(() => {
      setWinningNumber(resultNum);
      setPhase('RESULT');

      // Gewinne auszahlen
      let totalWin = 0;
      for (const [field, amount] of Object.entries(bets)) {
        // Direkte Zahl (Payout 35:1 -> Du bekommst 36x den Einsatz)
        if (field === resultNum.toString()) {
          totalWin += amount * 36;
        }
        // Farben (Payout 1:1 -> 2x Einsatz)
        if (field === 'RED' && RED_NUMBERS.includes(resultNum)) totalWin += amount * 2;
        if (field === 'BLACK' && !RED_NUMBERS.includes(resultNum) && resultNum !== 0) totalWin += amount * 2;
        // Gerade / Ungerade
        if (field === 'EVEN' && resultNum !== 0 && resultNum % 2 === 0) totalWin += amount * 2;
        if (field === 'ODD' && resultNum !== 0 && resultNum % 2 !== 0) totalWin += amount * 2;
      }

      if (totalWin > 0) {
        setBalance(prev => prev + totalWin);
        setMessage(`🎉 GEWONNEN! +${totalWin.toFixed(2)} AC 🎉`);
      } else {
        setMessage(`VERLOREN. Die Zahl ist ${resultNum}`);
      }

      // Tisch für nächste Runde freigeben
      setTimeout(() => {
        setPhase('BETTING');
        setWinningNumber(null);
        setBets({});
        setMessage('NEUES SPIEL - EINSATZ PLATZIEREN');
      }, 4500);

    }, 5000);
  };

  // Hilfsfunktion für die Wettausgabe
  const renderField = (label, value, type) => {
    const isRed = RED_NUMBERS.includes(parseInt(value));
    const betAmount = bets[value] || 0;
    
    let bgColor = '#111'; // Schwarz
    if (type === 'zero' || value === '0') bgColor = '#2e7d32'; // Grün
    else if (isRed || value === 'RED') bgColor = '#d32f2f'; // Rot
    else if (type === 'action') bgColor = '#1c1c1c'; // Sonderfelder

    return (
      <button 
        key={value}
        onClick={() => placeBet(value)}
        className="board-field"
        style={{
          backgroundColor: bgColor,
          gridColumn: type === 'zero' ? 'span 3' : 'span 1'
        }}
      >
        <span style={{ fontSize: type === 'number' ? '1.2rem' : '0.9rem', fontWeight: 'bold' }}>
          {label}
        </span>
        {/* Chip-Indikator, wenn auf dieses Feld gewettet wurde */}
        {betAmount > 0 && (
          <div className="chip-stack">
            {betAmount < 1 ? `${(betAmount * 100).toFixed(0)}c` : betAmount.toFixed(0)}
          </div>
        )}
      </button>
    );
  };

  return (
    <div style={styles.casinoRoom}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Playfair+Display:ital,wght@1,700&display=swap');

        .wheel-spin { transition: transform 5s cubic-bezier(0.25, 0.1, 0.15, 1); }
        .ball-spin { transition: transform 5s cubic-bezier(0.2, 0.05, 0.1, 1); }
        
        .board-field {
          position: relative;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 12px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
        }
        .board-field:active { transform: scale(0.95); }
        .board-field:hover { filter: brightness(1.2); }
        
        .chip-stack {
          position: absolute;
          width: 24px;
          height: 24px;
          background: radial-gradient(circle, #222, #000);
          border: 2px dashed #d4af37;
          border-radius: 50%;
          font-size: 0.6rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 4px 6px rgba(0,0,0,0.8);
          pointer-events: none;
          z-index: 10;
        }

        .chip-select {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: radial-gradient(circle at center, #333 0%, #000 100%);
          border: 3px dashed #d4af37;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .chip-active {
          transform: translateY(-8px) scale(1.1);
          box-shadow: 0 10px 15px rgba(0,0,0,0.6), inset 0 0 10px rgba(255,255,255,0.3);
          border-color: #fff;
        }
      `}</style>

      <div style={styles.tableWood}>
        <div style={styles.feltSurface}>
          
          <div style={styles.header}>
            <div style={styles.balanceBadge}>
              <span style={{ fontSize: '0.7rem', color: '#ccc' }}>KONTO</span>
              <span>{balance.toFixed(2)}</span>
            </div>
            <div style={{...styles.balanceBadge, borderColor: '#00ffcc'}}>
              <span style={{ fontSize: '0.7rem', color: '#00ffcc' }}>TOTAL EINSATZ</span>
              <span style={{ color: '#00ffcc' }}>{Object.values(bets).reduce((a, b) => a + b, 0).toFixed(2)}</span>
            </div>
          </div>

          {/* 3D Kessel (Jetzt mit echten Zahlen!) */}
          <div style={styles.rouletteArena}>
            <div style={styles.wheelBowl}>
              
              <div className="wheel-spin" style={{...styles.wheelInner, transform: `rotate(${wheelRotation}deg)`}}>
                {WHEEL_NUMBERS.map((num, i) => (
                  <div key={num} style={{
                    position: 'absolute',
                    height: '100%',
                    width: '20px', // Breite eines Faches
                    transform: `rotate(${i * (360/37)}deg)`,
                    transformOrigin: '50% 50%',
                    display: 'flex',
                    alignItems: 'flex-start', // Zahl oben anschnallen
                    justifyContent: 'center',
                    paddingTop: '4px'
                  }}>
                    <span style={{
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      transform: 'rotate(180deg)', // Damit die Zahlen zum Rand hin lesbar sind
                      textShadow: '0 1px 2px #000',
                      zIndex: 2
                    }}>
                      {num}
                    </span>
                    {/* Der farbige Hintergrund für das Fach */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      height: '50%',
                      backgroundColor: num === 0 ? '#2e7d32' : RED_NUMBERS.includes(num) ? '#d32f2f' : '#111',
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)', // Dreiecks-Form für die Kammer
                      zIndex: 1
                    }}></div>
                  </div>
                ))}
                <div style={styles.centerPivot}></div>
              </div>

              <div className="ball-spin" style={{...styles.ballTrack, transform: `rotate(${ballRotation}deg)`}}>
                <div style={{
                  ...styles.ball,
                  transform: phase === 'RESULT' ? 'translateY(55px)' : 'translateY(0)', // Fällt am Ende in das Fach
                  transition: 'transform 0.5s ease-out 4.5s' 
                }}></div>
              </div>

            </div>
          </div>

          <div style={{
            ...styles.digitalDisplay,
            color: phase === 'RESULT' ? '#d4af37' : '#fff'
          }}>
            {message}
          </div>

          {/* CHIP-AUSWAHL */}
          <div style={styles.chipRack}>
            {CHIP_VALUES.map((val) => (
              <button
                key={val}
                onClick={() => setSelectedChip(val)}
                className={`chip-select ${selectedChip === val ? 'chip-active' : ''}`}
              >
                {val < 1 ? `${(val * 100).toFixed(0)}c` : val.toFixed(0)}
              </button>
            ))}
          </div>

          {/* DAS VOLLSTÄNDIGE SETZ-BRETT (Mobile optimiert) */}
          <div style={styles.bettingBoard}>
            {/* Zero oben quer */}
            {renderField('0', '0', 'zero')}
            
            {/* Zahlen 1-36 im 3er Grid */}
            {Array.from({ length: 36 }, (_, i) => i + 1).map(num => 
              renderField(num.toString(), num.toString(), 'number')
            )}

            {/* Sonderwetten */}
            {renderField('GERADE', 'EVEN', 'action')}
            {renderField('ROT', 'RED', 'action')}
            {renderField('SCHWARZ', 'BLACK', 'action')}
            {renderField('UNGERADE', 'ODD', 'action')}
          </div>

          {/* ACTION BUTTONS */}
          <div style={styles.actionRow}>
            <button 
              onClick={clearBets}
              disabled={phase !== 'BETTING' || Object.keys(bets).length === 0}
              style={{...styles.controlBtn, backgroundColor: '#555'}}
            >
              LÖSCHEN
            </button>
            <button 
              onClick={spinWheel}
              disabled={phase !== 'BETTING' || Object.keys(bets).length === 0}
              style={{...styles.controlBtn, backgroundColor: '#d4af37', color: '#000', flexGrow: 2}}
            >
              DREHEN
            </button>
          </div>

          <Link href="/spiele" style={styles.exitLink}>🚪 Tisch verlassen</Link>
          
        </div>
      </div>
    </div>
  );
}

// STYLES
const styles = {
  casinoRoom: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050505',
    fontFamily: 'system-ui, sans-serif',
    padding: '10px'
  },
  tableWood: {
    background: 'linear-gradient(45deg, #2a0800, #4a1500, #2a0800)',
    padding: '10px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.9)',
    width: '100%',
    maxWidth: '500px', // Perfekt für Mobile
    border: '3px solid #111'
  },
  feltSurface: {
    background: 'radial-gradient(circle, #0e5e24 0%, #062b10 100%)',
    borderRadius: '15px',
    padding: '15px',
    border: '2px solid #d4af37',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px'
  },
  balanceBadge: {
    background: '#000',
    border: '1px solid #d4af37',
    padding: '8px 15px',
    borderRadius: '8px',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "monospace",
    fontWeight: 'bold'
  },
  rouletteArena: {
    perspective: '1000px',
    marginBottom: '15px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  wheelBowl: {
    width: '260px',
    height: '260px',
    borderRadius: '50%',
    transform: 'rotateX(40deg)', 
    transformStyle: 'preserve-3d',
    background: 'linear-gradient(145deg, #3a1500, #1a0500)',
    border: '10px solid #2a0800',
    boxShadow: '0 30px 20px rgba(0,0,0,0.8), inset 0 0 0 10px #d4af37',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wheelInner: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: '#000', // Basis für die Kammern
    position: 'absolute',
    border: '3px solid #d4af37',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerPivot: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at top, #f9d71c, #8a6d20)',
    boxShadow: '0 5px 10px rgba(0,0,0,0.8)',
    zIndex: 10
  },
  ballTrack: {
    width: '230px',
    height: '230px',
    borderRadius: '50%',
    position: 'absolute',
    zIndex: 5
  },
  ball: {
    width: '12px',
    height: '12px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    top: '-6px',
    left: 'calc(50% - 6px)',
    boxShadow: '0 2px 5px rgba(0,0,0,0.6)',
    background: 'radial-gradient(circle at 30% 30%, #ffffff, #aaaaaa)'
  },
  digitalDisplay: {
    background: '#050505',
    border: '2px solid #222',
    padding: '10px',
    borderRadius: '6px',
    width: '100%',
    textAlign: 'center',
    marginBottom: '15px',
    fontFamily: "'Orbitron', monospace",
    fontWeight: 'bold',
    fontSize: '0.9rem',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chipRack: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  bettingBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2px',
    width: '100%',
    background: 'rgba(0,0,0,0.2)',
    padding: '4px',
    borderRadius: '8px',
    border: '1px solid rgba(212, 175, 55, 0.4)'
  },
  actionRow: {
    display: 'flex',
    gap: '10px',
    width: '100%',
    marginTop: '20px'
  },
  controlBtn: {
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: '900',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
  },
  exitLink: {
    marginTop: '25px',
    color: '#aaa',
    textDecoration: 'none',
    fontSize: '0.8rem',
    borderBottom: '1px solid #555'
  }
};
