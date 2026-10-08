'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PremiumJumpingDice() {
  const [balance, setBalance] = useState(1250.00);
  const [betAmount, setBetAmount] = useState(10.00);
  const [multiplier, setMultiplier] = useState(2.0); // 2x bedeutet 50% Gewinnchance (minus Hausvorteil)
  
  const [phase, setPhase] = useState('IDLE'); // IDLE, ROLLING, RESULT
  const [dicePosition, setDicePosition] = useState('center'); // center, red, green
  const [diceRotation, setDiceRotation] = useState({ x: 15, y: 15, z: 0 });
  const [message, setMessage] = useState('WÄHLE EINSATZ & MULTIPLIKATOR');
  const [winStatus, setWinStatus] = useState(null);

  // Berechnet die tatsächliche Gewinnchance basierend auf dem Multiplikator (mit leichtem Hausvorteil)
  const winChance = Math.max(1, Math.min(95, (95 / multiplier)));

  const rollDice = () => {
    if (phase === 'ROLLING') return;
    if (balance < betAmount) {
      setMessage('⚠️ GUTHABEN ZU NIEDRIG ⚠️');
      setWinStatus('loss');
      return;
    }

    setBalance(prev => prev - betAmount);
    setPhase('ROLLING');
    setWinStatus(null);
    setMessage('WÜRFEL FLIEGT...');

    // 1. Auswertung im Hintergrund (RNG)
    const rollValue = Math.random() * 100; // 0 bis 100
    const isWin = rollValue <= winChance;

    // 2. Sprung-Animation starten (Zufällige schnelle Rotationen)
    let rollInterval = setInterval(() => {
      setDiceRotation({
        x: Math.floor(Math.random() * 360),
        y: Math.floor(Math.random() * 360),
        z: Math.floor(Math.random() * 360)
      });
      // Würfel springt hektisch hin und her
      setDicePosition(Math.random() > 0.5 ? 'left' : 'right');
    }, 300);

    // 3. Nach 2.5 Sekunden landet der Würfel auf dem finalen Feld
    setTimeout(() => {
      clearInterval(rollInterval);
      
      // Finale Position festlegen
      setDicePosition(isWin ? 'green' : 'red');
      
      // Würfel flach auf den Boden legen (eine der 6 Seiten zeigt nach oben)
      const finalFaces = [
        { x: 0, y: 0, z: 0 }, { x: 0, y: -90, z: 0 }, { x: 0, y: 180, z: 0 },
        { x: 0, y: 90, z: 0 }, { x: -90, y: 0, z: 0 }, { x: 90, y: 0, z: 0 }
      ];
      setDiceRotation(finalFaces[Math.floor(Math.random() * finalFaces.length)]);
      
      setPhase('RESULT');

      if (isWin) {
        const winAmount = betAmount * multiplier;
        setBalance(prev => prev + winAmount);
        setWinStatus('win');
        setMessage(`🎉 BINGO! +${winAmount.toFixed(2)} AC 🎉`);
      } else {
        setWinStatus('loss');
        setMessage('💥 VERLOREN 💥');
      }

      // Reset nach 3 Sekunden
      setTimeout(() => {
        setDicePosition('center');
        setPhase('IDLE');
        setMessage('BEREIT FÜR DEN NÄCHSTEN WURF');
        setWinStatus(null);
      }, 3000);

    }, 2500);
  };

  return (
    <div style={styles.casinoRoom}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Oswald:wght@400;700&display=swap');

        /* 3D Würfel Konstruktion */
        .scene { width: 80px; height: 80px; perspective: 600px; z-index: 10; transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .cube { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.3s linear; }
        .cube-face { position: absolute; width: 80px; height: 80px; background: radial-gradient(circle at center, #fff, #e0e0e0); border: 2px solid #ccc; border-radius: 10px; display: flex; justify-content: center; align-items: center; box-shadow: inset 0 0 15px rgba(0,0,0,0.2); }
        .dot { width: 16px; height: 16px; background: #111; border-radius: 50%; box-shadow: inset 0 3px 5px rgba(0,0,0,0.5); }
        
        .front  { transform: rotateY(  0deg) translateZ(40px); }
        .right  { transform: rotateY( 90deg) translateZ(40px); }
        .back   { transform: rotateY(180deg) translateZ(40px); }
        .left   { transform: rotateY(-90deg) translateZ(40px); }
        .top    { transform: rotateX( 90deg) translateZ(40px); }
        .bottom { transform: rotateX(-90deg) translateZ(40px); }

        /* Würfel-Augen Layouts */
        .face-1 { }
        .face-2 { justify-content: space-between; padding: 10px; flex-direction: column; align-items: flex-start; }
        .face-2 .dot:last-child { align-self: flex-end; }
        .face-3 { justify-content: space-between; padding: 10px; flex-direction: column; align-items: flex-start; }
        .face-3 .dot:nth-child(2) { align-self: center; }
        .face-3 .dot:last-child { align-self: flex-end; }
        .face-4 { padding: 15px; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 15px; }
        .face-5 { padding: 15px; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 15px; position: relative; }
        .face-5 .dot:last-child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .face-6 { padding: 10px 15px; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; gap: 8px 15px; }

        /* Animationen & Zonen */
        .zone { transition: all 0.3s; position: relative; overflow: hidden; }
        .zone::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%); transform: skewX(-25deg); }
        .zone-active::after { animation: shine 1.5s infinite; }
        @keyframes shine { 100% { left: 200%; } }

        .slider { -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px; background: #333; outline: none; margin: 15px 0; }
        .slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #d4af37; cursor: pointer; border: 2px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.5); }
      `}</style>

      {/* DASHBOARD & KONTO */}
      <div style={styles.header}>
        <div style={styles.logo}>ABISINO DICE</div>
        <div style={styles.balanceBadge}>
          <span style={{ fontSize: '0.6rem', color: '#888' }}>CREDITS</span>
          <span>{balance.toFixed(2)}</span>
        </div>
      </div>

      {/* DAS SPIELFELD (Rot vs Grün) */}
      <div style={styles.arena}>
        
        {/* Rote Zone (Verlust) */}
        <div className={`zone ${winStatus === 'loss' ? 'zone-active' : ''}`} style={{
          ...styles.lossZone,
          boxShadow: winStatus === 'loss' ? 'inset 0 0 50px #ff3333, 0 0 30px rgba(255,51,51,0.5)' : 'inset 0 0 20px rgba(0,0,0,0.8)'
        }}>
          <div style={styles.zoneText}>VERLUST</div>
        </div>

        {/* Grüne Zone (Gewinn) */}
        <div className={`zone ${winStatus === 'win' ? 'zone-active' : ''}`} style={{
          ...styles.winZone,
          boxShadow: winStatus === 'win' ? 'inset 0 0 50px #00ffcc, 0 0 30px rgba(0,255,204,0.5)' : 'inset 0 0 20px rgba(0,0,0,0.8)'
        }}>
          <div style={styles.zoneText}>GEWINN<br/><span style={{ fontSize: '1rem' }}>{multiplier.toFixed(2)}x</span></div>
        </div>

        {/* Der physikalische 3D-Würfel */}
        <div className="scene" style={{
          position: 'absolute',
          top: dicePosition === 'center' ? '40%' : '50%',
          left: dicePosition === 'center' ? '50%' : dicePosition === 'left' || dicePosition === 'red' ? '25%' : '75%',
          transform: `translate(-50%, -50%) scale(${dicePosition === 'center' ? 1.5 : 1})`,
        }}>
          <div className="cube" style={{ transform: `rotateX(${diceRotation.x}deg) rotateY(${diceRotation.y}deg) rotateZ(${diceRotation.z}deg)` }}>
            <div className="cube-face front face-1"><div className="dot"></div></div>
            <div className="cube-face right face-2"><div className="dot"></div><div className="dot"></div></div>
            <div className="cube-face back face-3"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
            <div className="cube-face left face-4"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
            <div className="cube-face top face-5"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
            <div className="cube-face bottom face-6"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
          </div>
        </div>

      </div>

      {/* KONTROLL-PANEL */}
      <div style={styles.controlPanel}>
        <div style={{
          ...styles.statusBar,
          color: winStatus === 'win' ? '#00ffcc' : winStatus === 'loss' ? '#ff3333' : '#fff'
        }}>
          {message}
        </div>

        <div style={styles.controlsGrid}>
          
          {/* Einsatz Regler */}
          <div style={styles.controlBox}>
            <div style={styles.controlLabel}>EINSATZ (AC)</div>
            <div style={styles.controlValue}>{betAmount.toFixed(2)}</div>
            <input 
              type="range" min="1" max={Math.min(balance, 1000)} step="1" 
              value={betAmount} onChange={(e) => setBetAmount(parseFloat(e.target.value))} 
              className="slider" disabled={phase !== 'IDLE'}
            />
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => setBetAmount(prev => Math.max(1, prev / 2))} style={styles.halfBtn} disabled={phase !== 'IDLE'}>1/2</button>
              <button onClick={() => setBetAmount(prev => Math.min(balance, prev * 2))} style={styles.halfBtn} disabled={phase !== 'IDLE'}>2X</button>
            </div>
          </div>

          {/* Multiplikator & Gewinnchance */}
          <div style={styles.controlBox}>
            <div style={styles.controlLabel}>MULTIPLIKATOR</div>
            <div style={{ ...styles.controlValue, color: '#00ffcc' }}>{multiplier.toFixed(2)}x</div>
            <input 
              type="range" min="1.1" max="10" step="0.1" 
              value={multiplier} onChange={(e) => setMultiplier(parseFloat(e.target.value))} 
              className="slider" disabled={phase !== 'IDLE'}
            />
            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px', fontFamily: "'Orbitron', monospace" }}>
              GEWINNCHANCE: <span style={{ color: '#fff' }}>{winChance.toFixed(1)}%</span>
            </div>
          </div>

        </div>

        <button 
          onClick={rollDice} 
          disabled={phase !== 'IDLE'} 
          style={{ ...styles.rollBtn, background: phase !== 'IDLE' ? '#444' : 'linear-gradient(to right, #d4af37, #f9d71c)' }}
        >
          {phase === 'IDLE' ? `WÜRFELN (GEWINN: ${(betAmount * multiplier).toFixed(2)})` : 'WÜRFELT...'}
        </button>

      </div>

      <Link href="/spiele" style={styles.exitLink}>🚪 Lobby</Link>
    </div>
  );
}

const styles = {
  casinoRoom: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505', padding: '10px', fontFamily: 'system-ui, sans-serif' },
  header: { width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  logo: { color: '#d4af37', fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 'bold' },
  balanceBadge: { background: '#111', border: '1px solid #d4af37', padding: '5px 15px', borderRadius: '8px', color: '#f9d71c', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontFamily: "'Orbitron', monospace", fontWeight: 'bold' },
  
  arena: { width: '100%', maxWidth: '600px', height: '300px', display: 'flex', borderRadius: '15px', overflow: 'hidden', border: '3px solid #222', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' },
  lossZone: { flex: 1, background: 'linear-gradient(135deg, #3a0000, #1a0000)', borderRight: '2px solid #000', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '30px' },
  winZone: { flex: 1, background: 'linear-gradient(135deg, #002a15, #00150a)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '30px' },
  zoneText: { color: 'rgba(255,255,255,0.2)', fontFamily: "'Oswald', sans-serif", fontSize: '2rem', fontWeight: '900', letterSpacing: '4px', textAlign: 'center', lineHeight: '1.2' },
  
  controlPanel: { width: '100%', maxWidth: '600px', background: '#111', borderRadius: '15px', border: '1px solid #333', marginTop: '20px', padding: '15px' },
  statusBar: { background: '#0a0a0a', textAlign: 'center', padding: '10px', borderRadius: '8px', fontFamily: "'Orbitron', monospace", fontWeight: 'bold', marginBottom: '15px', border: '1px solid #222' },
  controlsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' },
  controlBox: { background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  controlLabel: { color: '#888', fontSize: '0.7rem', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', marginBottom: '5px' },
  controlValue: { color: '#fff', fontSize: '1.5rem', fontFamily: "'Orbitron', monospace", fontWeight: 'bold' },
  halfBtn: { flex: 1, background: '#333', border: 'none', color: '#fff', padding: '5px', borderRadius: '4px', fontFamily: 'monospace', cursor: 'pointer' },
  
  rollBtn: { width: '100%', padding: '20px', border: 'none', borderRadius: '8px', color: '#000', fontFamily: "'Oswald', sans-serif", fontSize: '1.2rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' },
  exitLink: { marginTop: '25px', color: '#666', textDecoration: 'none', fontFamily: 'monospace', borderBottom: '1px solid #444' }
};
    
