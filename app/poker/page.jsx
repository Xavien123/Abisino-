'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RealMultiplayerHoldem() {
  // Du startest als einziger Spieler am Tisch (Keine Bots mehr!)
  const [players, setPlayers] = useState([
    { 
      id: 'p1', 
      name: 'Du (Hero)', 
      avatar: '🧑‍💼', 
      balance: 1250.00, 
      currentBet: 0, 
      status: 'WAITING', 
      isTurn: false, 
      position: 'bottom', 
      role: 'SB', 
      cards: [] 
    }
  ]);
  
  const [communityCards, setCommunityCards] = useState([]);
  const [pot, setPot] = useState(0);
  const [phase, setPhase] = useState('LOBBY'); // LOBBY, PREFLOP, FLOP, TURN, RIVER, SHOWDOWN
  const [currentCallAmount, setCurrentCallAmount] = useState(50);
  const [raiseAmount, setRaiseAmount] = useState(100);
  
  const hero = players.find(p => p.id === 'p1');
  const isWaitingForPlayers = players.length < 2;

  // --- NUR ZUM TESTEN DES NEUEN DESIGNS ---
  const devAddPlayerAndStart = () => {
    setPlayers([
      { ...hero, status: 'ACTIVE', isTurn: true, cards: [{ suit: '♠', value: 'A' }, { suit: '♥', value: 'K' }], currentBet: 25 },
      { id: 'p2', name: 'RealPlayer_99', avatar: '👤', balance: 2000.00, currentBet: 50, status: 'ACTIVE', isTurn: false, position: 'top', role: 'BB', cards: [{ isHidden: true }, { isHidden: true }] }
    ]);
    setPot(75);
    setPhase('PREFLOP');
  };

  // Einfache Demo-Logik, um die saubere Positionierung des Flops zu zeigen
  const nextPhase = () => {
    if (phase === 'PREFLOP') {
      setPhase('FLOP');
      setCommunityCards([
        { suit: '♠', value: '10', isHidden: false },
        { suit: '♥', value: 'J', isHidden: false },
        { suit: '♦', value: 'Q', isHidden: false }
      ]);
    } else if (phase === 'FLOP') {
      setPhase('TURN');
      setCommunityCards(prev => [...prev, { suit: '♣', value: '2', isHidden: false }]);
    } else if (phase === 'TURN') {
      setPhase('RIVER');
      setCommunityCards(prev => [...prev, { suit: '♠', value: 'A', isHidden: false }]);
    }
  };

  const handleAction = (actionType) => {
    // In der echten Version schickst du hier ein Event an Supabase
    nextPhase(); 
  };

  const Card = ({ card, size = 'normal', delay = 0 }) => {
    if (!card) return null;
    const isRed = card.suit === '♥' || card.suit === '♦';
    const dims = size === 'small' ? { w: '40px', h: '60px', fs: '0.9rem', mfs: '1.2rem' } : { w: '55px', h: '80px', fs: '1.1rem', mfs: '1.8rem' };
    
    return (
      <div className={`poker-card ${card.isHidden ? 'hidden' : 'visible'}`} style={{ width: dims.w, height: dims.h, animationDelay: `${delay}s` }}>
        {card.isHidden ? (
          <div className="card-back-pattern"></div>
        ) : (
          <div className="card-front" style={{ color: isRed ? '#d32f2f' : '#111' }}>
            <div style={{ fontSize: dims.fs, position: 'absolute', top: '2px', left: '4px' }}>{card.value}</div>
            <div style={{ fontSize: dims.mfs, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{card.suit}</div>
            <div style={{ fontSize: dims.fs, position: 'absolute', bottom: '2px', right: '4px', transform: 'rotate(180deg)' }}>{card.value}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.casinoRoom}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Oswald:wght@400;700&display=swap');

        @keyframes dropIn {
          0% { transform: translateY(-50px) scale(0.8); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        .poker-card {
          background: #fff; border-radius: 4px; position: relative;
          box-shadow: 0 4px 8px rgba(0,0,0,0.5);
          animation: dropIn 0.3s ease-out forwards;
          font-family: 'Arial', sans-serif; font-weight: 900; border: 1px solid #ddd;
        }
        .card-back-pattern {
          width: 100%; height: 100%; border-radius: 3px; border: 2px solid #fff;
          background: repeating-linear-gradient(45deg, #0d47a1, #0d47a1 5px, #1565c0 5px, #1565c0 10px);
        }

        /* Avatar & Info Styling */
        .avatar-circle {
          width: 60px; height: 60px; border-radius: 50%;
          background: radial-gradient(circle, #333, #000); border: 3px solid #555;
          display: flex; justify-content: center; align-items: center; font-size: 2rem;
          box-shadow: 0 5px 10px rgba(0,0,0,0.6); position: relative; z-index: 10;
        }
        .player-info {
          background: rgba(0,0,0,0.85); border: 1px solid #d4af37; border-radius: 6px;
          padding: 4px; text-align: center; margin-top: -10px; z-index: 11; width: 100px;
        }
        .role-badge {
          position: absolute; top: -5px; right: -5px; background: #fff; color: #000;
          border-radius: 50%; width: 20px; height: 20px; font-size: 0.6rem; font-weight: bold;
          display: flex; justify-content: center; align-items: center; border: 2px solid #000;
        }
        
        .slider-input { width: 100%; margin: 10px 0; }
      `}</style>

      {/* DER POKERTISCH MIT STRIKTEN ABSOLUTEN POSITIONEN */}
      <div style={styles.tableLeatherRail}>
        <div style={styles.tableFelt}>
          
          <div style={styles.tableLogo}>ABISINO HOLD'EM</div>

          {/* LOBBY OVERLAY WENN KEINE SPIELER DA SIND */}
          {isWaitingForPlayers && (
            <div style={styles.lobbyOverlay}>
              <h2 style={{ color: '#fff', margin: '0 0 10px 0', fontFamily: "'Oswald', sans-serif" }}>WARTE AUF SPIELER... (1/6)</h2>
              <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>Das Spiel startet automatisch, sobald ein anderer Account den Tisch betritt.</p>
              <div style={styles.loader}></div>
              
              {/* DEV BUTTON */}
              <button onClick={devAddPlayerAndStart} style={styles.devBtn}>
                🧪 DEV: Echten Spieler simulieren (Design testen)
              </button>
            </div>
          )}

          {/* COMMUNITY KARTEN (Exakt in der Mitte fixiert) */}
          {!isWaitingForPlayers && (
            <div style={styles.boardCenter}>
              <div style={styles.potDisplay}>POT: <span style={{ color: '#00ffcc' }}>{pot.toFixed(2)}</span></div>
              <div style={styles.communityCardsRow}>
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} style={styles.cardPlaceholder}>
                    {communityCards[i] ? <Card card={communityCards[i]} size="normal" delay={i * 0.1} /> : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SPIELER (Fixiert am Rand, Karten überlappen nicht mehr!) */}
          {players.map(player => {
            // Feste Koordinaten für das Oval
            const pos = player.position === 'bottom' 
              ? { bottom: '2%', left: '50%', transform: 'translateX(-50%)' }
              : { top: '5%', left: '50%', transform: 'translateX(-50%)' };

            // Eigene Karten leicht versetzt über dem Spieler
            const cardPos = player.position === 'bottom'
              ? { top: '-50px', left: '50%', transform: 'translateX(-50%)' } // Karten ÜBER dem Hero
              : { bottom: '-50px', left: '50%', transform: 'translateX(-50%)' }; // Karten UNTER Gegnern

            return (
              <div key={player.id} style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', ...pos }}>
                
                {/* Die Karten des Spielers */}
                {player.cards.length > 0 && (
                  <div style={{ position: 'absolute', display: 'flex', gap: '2px', zIndex: 5, ...cardPos }}>
                    {player.cards.map((c, i) => (
                      <div key={i} style={{ transform: i === 0 ? 'rotate(-5deg)' : 'rotate(5deg)' }}>
                        <Card card={c} size="small" delay={i * 0.2} />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className={`avatar-circle ${player.isTurn ? 'avatar-active' : ''}`}>
                  {player.avatar}
                  <div className="role-badge" style={{ background: player.role === 'BTN' ? '#fff' : player.role === 'BB' ? '#ff3333' : '#d4af37', color: player.role === 'BB' ? '#fff' : '#000' }}>{player.role}</div>
                </div>
                
                <div className="player-info">
                  <div style={{ color: '#fff', fontSize: '0.7rem', fontFamily: "'Oswald', sans-serif" }}>{player.name}</div>
                  <div style={{ color: '#f9d71c', fontSize: '0.8rem', fontFamily: "'Orbitron', monospace", fontWeight: 'bold' }}>{player.balance.toFixed(2)}</div>
                </div>

                {player.currentBet > 0 && (
                  <div style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #00ffcc', color: '#00ffcc', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', marginTop: '5px', fontWeight: 'bold' }}>
                    BET: {player.currentBet}
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>

      {/* KONTROLL-ZENTRUM */}
      <div style={styles.controlPanel}>
        <div style={styles.statusBar}>{isWaitingForPlayers ? 'LOBBY' : 'DEIN ZUG'}</div>
        
        <div style={styles.actionGrid}>
          <button onClick={() => handleAction('FOLD')} disabled={isWaitingForPlayers || !hero?.isTurn} style={{ ...styles.actionBtn, background: '#444' }}>
            FOLD
          </button>
          <button onClick={() => handleAction('CALL')} disabled={isWaitingForPlayers || !hero?.isTurn} style={{ ...styles.actionBtn, background: '#2e7d32' }}>
            {currentCallAmount > (hero?.currentBet || 0) ? `CALL` : 'CHECK'}
          </button>
          
          <div style={styles.raiseBox}>
            <div style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '0.9rem' }}>RAISE TO: {raiseAmount}</div>
            <input type="range" min={currentCallAmount * 2} max={hero?.balance || 1000} step={10} value={raiseAmount} onChange={(e) => setRaiseAmount(parseInt(e.target.value))} className="slider-input" disabled={isWaitingForPlayers || !hero?.isTurn} />
            <button onClick={() => handleAction('RAISE')} disabled={isWaitingForPlayers || !hero?.isTurn} style={{ ...styles.actionBtn, background: '#d32f2f', padding: '10px' }}>
              RAISE
            </button>
          </div>
        </div>
      </div>

      <Link href="/spiele" style={styles.exitLink}>🚪 Lobby</Link>
    </div>
  );
}

const styles = {
  casinoRoom: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505', padding: '10px' },
  // Höherer Tisch für Mobile, damit alles Platz hat
  tableLeatherRail: { background: 'linear-gradient(45deg, #2a0800, #4a1500)', padding: '15px', borderRadius: '150px', width: '100%', maxWidth: '600px', height: '550px', display: 'flex', border: '3px solid #111', marginTop: '10px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' },
  tableFelt: { background: 'radial-gradient(ellipse at center, #0a4f22 0%, #04240e 100%)', borderRadius: '135px', width: '100%', height: '100%', border: '4px solid #000', position: 'relative', overflow: 'hidden' },
  tableLogo: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.1, fontSize: '3rem', fontFamily: "'Cinzel', serif", color: '#fff', textAlign: 'center', width: '100%', pointerEvents: 'none' },
  
  // Strikte Zentrierung des Boards!
  boardCenter: { position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5, width: '100%' },
  potDisplay: { background: 'rgba(0,0,0,0.8)', border: '1px solid #d4af37', padding: '4px 15px', borderRadius: '15px', color: '#fff', fontFamily: "'Orbitron', monospace", fontWeight: 'bold', marginBottom: '10px' },
  communityCardsRow: { display: 'flex', gap: '5px' },
  cardPlaceholder: { width: '55px', height: '80px', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '4px' },
  
  lobbyOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 50, textAlign: 'center', padding: '20px' },
  loader: { width: '40px', height: '40px', border: '4px solid #333', borderTop: '4px solid #d4af37', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' },
  devBtn: { background: 'transparent', border: '1px solid #d4af37', color: '#d4af37', padding: '8px 15px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer' },
  
  controlPanel: { width: '100%', maxWidth: '600px', background: '#111', borderRadius: '12px', border: '2px solid #333', marginTop: '20px' },
  statusBar: { background: '#0a0a0a', color: '#fff', textAlign: 'center', padding: '10px', fontFamily: "'Orbitron', monospace', sans-serif", borderBottom: '1px solid #333' },
  actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '10px', padding: '10px' },
  actionBtn: { border: 'none', borderRadius: '6px', color: '#fff', fontFamily: "'Oswald', sans-serif", fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' },
  raiseBox: { background: '#1a1a1a', padding: '8px', borderRadius: '6px', display: 'flex', flexDirection: 'column' },
  exitLink: { marginTop: '20px', color: '#666', textDecoration: 'none', fontFamily: 'monospace' }
};
