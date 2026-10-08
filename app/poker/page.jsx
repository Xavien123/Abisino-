'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Hilfsfunktionen für das Kartendeck
const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Multiplayer-Datenstruktur (wird später durch deine Datenbank/Sockets live gefüttert)
const INITIAL_PLAYERS = [
  { id: 'p1', name: 'Du (Hero)', avatar: '🧑‍💼', balance: 1250.00, currentBet: 0, status: 'ACTIVE', isTurn: true, position: 'bottom', role: 'BB', cards: [{ suit: '♠', value: 'A' }, { suit: '♥', value: 'K' }] },
  { id: 'p2', name: 'CasinoKing', avatar: '🦁', balance: 840.50, currentBet: 0, status: 'WAITING', isTurn: false, position: 'left', role: 'UTG', cards: [{ isHidden: true }, { isHidden: true }] },
  { id: 'p3', name: 'PokerFace99', avatar: '😎', balance: 2100.00, currentBet: 0, status: 'WAITING', isTurn: false, position: 'top-left', role: 'MP', cards: [{ isHidden: true }, { isHidden: true }] },
  { id: 'p4', name: 'HighRoller', avatar: '🎩', balance: 5400.00, currentBet: 0, status: 'WAITING', isTurn: false, position: 'top-right', role: 'CO', cards: [{ isHidden: true }, { isHidden: true }] },
  { id: 'p5', name: 'AbiMaster', avatar: '🤖', balance: 320.00, currentBet: 0, status: 'WAITING', isTurn: false, position: 'right', role: 'BTN', cards: [{ isHidden: true }, { isHidden: true }] },
];

export default function PremiumTexasHoldem() {
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [communityCards, setCommunityCards] = useState([]);
  const [pot, setPot] = useState(150.00); // Start-Pot (Blinds)
  const [phase, setPhase] = useState('PREFLOP'); // WAITING, PREFLOP, FLOP, TURN, RIVER, SHOWDOWN
  const [currentCallAmount, setCurrentCallAmount] = useState(50);
  const [raiseAmount, setRaiseAmount] = useState(100);
  const [message, setMessage] = useState('DEIN ZUG: CAll ODER RAISE');

  // Hero (Lokaler Spieler) ist immer p1 am unteren Bildschirmrand
  const hero = players.find(p => p.id === 'p1');

  // Simulations-Logik für das Aufdecken der Karten (Später durch Server-Events ersetzt)
  const nextPhase = () => {
    if (phase === 'PREFLOP') {
      setPhase('FLOP');
      setMessage('FLOP WIRD GEDEALT');
      setCommunityCards([
        { suit: '♠', value: '10', isHidden: false },
        { suit: '♥', value: 'J', isHidden: false },
        { suit: '♦', value: 'Q', isHidden: false }
      ]);
    } else if (phase === 'FLOP') {
      setPhase('TURN');
      setMessage('TURN WIRD GEDEALT');
      setCommunityCards(prev => [...prev, { suit: '♣', value: '2', isHidden: false }]);
    } else if (phase === 'TURN') {
      setPhase('RIVER');
      setMessage('RIVER WIRD GEDEALT');
      setCommunityCards(prev => [...prev, { suit: '♠', value: 'A', isHidden: false }]);
    } else if (phase === 'RIVER') {
      setPhase('SHOWDOWN');
      setMessage('SHOWDOWN!');
      // Decke gegnerische Karten auf
      setPlayers(players.map(p => p.id === 'p3' ? { ...p, cards: [{ suit: '♥', value: '10' }, { suit: '♦', value: '10' }] } : p));
    } else {
      resetHand();
    }
  };

  const handleAction = (actionType) => {
    let newPlayers = [...players];
    let heroIndex = newPlayers.findIndex(p => p.id === 'p1');

    if (actionType === 'FOLD') {
      newPlayers[heroIndex].status = 'FOLDED';
      newPlayers[heroIndex].cards = [];
      setMessage('DU HAST GEPASST');
    } else if (actionType === 'CALL') {
      const callCost = currentCallAmount - newPlayers[heroIndex].currentBet;
      newPlayers[heroIndex].balance -= callCost;
      newPlayers[heroIndex].currentBet = currentCallAmount;
      setPot(prev => prev + callCost);
      setMessage('DU GEHST MIT');
    } else if (actionType === 'RAISE') {
      const raiseCost = raiseAmount - newPlayers[heroIndex].currentBet;
      newPlayers[heroIndex].balance -= raiseCost;
      newPlayers[heroIndex].currentBet = raiseAmount;
      setCurrentCallAmount(raiseAmount);
      setPot(prev => prev + raiseCost);
      setMessage(`DU ERHÖHST AUF ${raiseAmount}`);
    }

    newPlayers[heroIndex].isTurn = false;
    setPlayers(newPlayers);
    
    // Simuliere, dass der Tisch weiterläuft
    setTimeout(() => {
      nextPhase();
      // Gib dem Spieler in der nächsten Phase wieder den Zug
      setTimeout(() => {
        let resetTurn = [...newPlayers];
        resetTurn[heroIndex].isTurn = true;
        setPlayers(resetTurn);
        if (phase !== 'RIVER') setMessage('DEIN ZUG');
      }, 1000);
    }, 1500);
  };

  const resetHand = () => {
    setPhase('PREFLOP');
    setCommunityCards([]);
    setPot(150);
    setPlayers(INITIAL_PLAYERS);
    setMessage('NEUE RUNDE STARTER...');
  };

  // Hilfskomponente für Spielkarten
  const Card = ({ card, size = 'normal', delay = 0 }) => {
    if (!card) return null;
    const isRed = card.suit === '♥' || card.suit === '♦';
    const dims = size === 'small' ? { w: '45px', h: '65px', fs: '1rem', mfs: '1.5rem' } : { w: '60px', h: '90px', fs: '1.2rem', mfs: '2rem' };
    
    return (
      <div className={`poker-card ${card.isHidden ? 'hidden' : 'visible'}`} style={{ width: dims.w, height: dims.h, animationDelay: `${delay}s` }}>
        {card.isHidden ? (
          <div className="card-back-pattern"></div>
        ) : (
          <div className="card-front" style={{ color: isRed ? '#d32f2f' : '#111' }}>
            <div style={{ fontSize: dims.fs, lineHeight: 1, position: 'absolute', top: '2px', left: '4px' }}>{card.value}</div>
            <div style={{ fontSize: dims.mfs, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{card.suit}</div>
            <div style={{ fontSize: dims.fs, lineHeight: 1, position: 'absolute', bottom: '2px', right: '4px', transform: 'rotate(180deg)' }}>{card.value}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.casinoRoom}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Oswald:wght@400;700&display=swap');

        @keyframes cardDeal {
          0% { transform: translateY(-100px) rotate(180deg) scale(0); opacity: 0; }
          100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
        }
        @keyframes activePulse {
          0% { box-shadow: 0 0 10px #00ffcc, inset 0 0 10px #00ffcc; border-color: #00ffcc; }
          50% { box-shadow: 0 0 30px #00ffcc, inset 0 0 20px #00ffcc; border-color: #fff; }
          100% { box-shadow: 0 0 10px #00ffcc, inset 0 0 10px #00ffcc; border-color: #00ffcc; }
        }

        .poker-card {
          background: #fff;
          border-radius: 4px;
          position: relative;
          box-shadow: 0 4px 8px rgba(0,0,0,0.5);
          animation: cardDeal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          font-family: 'Arial', sans-serif;
          font-weight: 900;
          border: 1px solid #ddd;
        }
        .card-back-pattern {
          width: 100%; height: 100%;
          background: repeating-linear-gradient(45deg, #0d47a1, #0d47a1 5px, #1565c0 5px, #1565c0 10px);
          border-radius: 3px;
          border: 2px solid #fff;
        }

        .player-seat {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 120px;
          transform: translate(-50%, -50%);
          z-index: 10;
        }
        
        .avatar-circle {
          width: 70px; height: 70px;
          border-radius: 50%;
          background: radial-gradient(circle, #333, #000);
          border: 3px solid #555;
          display: flex; justify-content: center; align-items: center;
          font-size: 2.5rem;
          box-shadow: 0 10px 15px rgba(0,0,0,0.6);
          position: relative;
          z-index: 2;
        }
        .avatar-active {
          animation: activePulse 1.5s infinite;
        }

        .player-info {
          background: rgba(0,0,0,0.8);
          border: 1px solid #d4af37;
          border-radius: 6px;
          padding: 4px 8px;
          text-align: center;
          margin-top: -10px;
          z-index: 3;
          width: 100%;
          box-shadow: 0 4px 6px rgba(0,0,0,0.8);
        }
        .player-name { color: #fff; font-size: 0.7rem; font-family: 'Oswald', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .player-balance { color: #f9d71c; font-size: 0.8rem; font-family: 'Orbitron', monospace; font-weight: bold; }
        
        .role-badge {
          position: absolute; top: 0; right: -10px;
          background: #fff; color: #000; border-radius: 50%;
          width: 24px; height: 24px; font-size: 0.6rem; font-weight: bold;
          display: flex; justify-content: center; align-items: center;
          border: 2px solid #000; z-index: 4; box-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .action-chip {
          background: rgba(0,0,0,0.6);
          border: 1px dashed #00ffcc;
          color: #00ffcc;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.7rem;
          margin-top: 5px;
          font-family: 'Orbitron', monospace;
        }

        .range-slider {
          -webkit-appearance: none; width: 100%; height: 8px; border-radius: 4px; background: #333; outline: none;
        }
        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #d4af37; cursor: pointer; box-shadow: 0 0 10px rgba(0,0,0,0.8); border: 2px solid #fff;
        }
      `}</style>

      {/* DER OVALE POKERTISCH */}
      <div style={styles.tableLeatherRail}>
        <div style={styles.tableFelt}>
          
          <div style={styles.tableLogo}>ABISINO HOLD'EM</div>

          {/* COMMUNITY KARTEN & POT */}
          <div style={styles.boardCenter}>
            <div style={styles.potDisplay}>
              <span>POT</span>
              <span style={{ color: '#00ffcc', fontSize: '1.5rem' }}>{pot.toFixed(2)}</span>
            </div>
            
            <div style={styles.communityCardsRow}>
              {/* Platzhalter für 5 Karten */}
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} style={styles.cardPlaceholder}>
                  {communityCards[i] ? <Card card={communityCards[i]} size="normal" delay={i * 0.1} /> : null}
                </div>
              ))}
            </div>
          </div>

          {/* SPIELER POSITIONIERUNG */}
          {players.map(player => {
            // Positionierungs-Logik für das Oval
            let posStyles = {};
            switch(player.position) {
              case 'bottom': posStyles = { bottom: '-30px', left: '50%' }; break;
              case 'left': posStyles = { top: '50%', left: '-10px' }; break;
              case 'top-left': posStyles = { top: '-10px', left: '25%' }; break;
              case 'top-right': posStyles = { top: '-10px', right: '25%', transform: 'translate(50%, -50%)' }; break;
              case 'right': posStyles = { top: '50%', right: '-10px', transform: 'translate(50%, -50%)' }; break;
            }

            return (
              <div key={player.id} className="player-seat" style={posStyles}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '-25px', zIndex: 1 }}>
                  {player.cards.map((c, i) => (
                    <div key={i} style={{ transform: i === 0 ? 'rotate(-10deg)' : 'rotate(10deg)' }}>
                      <Card card={c} size="small" delay={i * 0.2} />
                    </div>
                  ))}
                </div>
                
                <div className={`avatar-circle ${player.isTurn ? 'avatar-active' : ''}`}>
                  {player.avatar}
                  <div className="role-badge" style={{ background: player.role === 'BTN' ? '#fff' : player.role === 'BB' ? '#ff3333' : '#d4af37', color: player.role === 'BB' ? '#fff' : '#000' }}>
                    {player.role}
                  </div>
                </div>
                
                <div className="player-info">
                  <div className="player-name">{player.name}</div>
                  <div className="player-balance">{player.balance.toFixed(2)}</div>
                </div>

                {player.currentBet > 0 && (
                  <div className="action-chip">BET: {player.currentBet}</div>
                )}
              </div>
            );
          })}

        </div>
      </div>

      {/* HERO KONTROLL-ZENTRUM */}
      <div style={styles.controlPanel}>
        <div style={styles.statusBar}>{message}</div>
        
        {hero.isTurn ? (
          <div style={styles.actionGrid}>
            <button onClick={() => handleAction('FOLD')} style={{ ...styles.actionBtn, background: '#444' }}>
              FOLD
            </button>
            <button onClick={() => handleAction('CALL')} style={{ ...styles.actionBtn, background: '#2e7d32' }}>
              {currentCallAmount > hero.currentBet ? `CALL (${currentCallAmount - hero.currentBet})` : 'CHECK'}
            </button>
            
            <div style={styles.raiseBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#d4af37', fontWeight: 'bold' }}>RAISE TO: {raiseAmount}</span>
              </div>
              <input 
                type="range" 
                min={currentCallAmount * 2} 
                max={hero.balance} 
                step={10} 
                value={raiseAmount} 
                onChange={(e) => setRaiseAmount(parseInt(e.target.value))}
                className="range-slider"
              />
              <button onClick={() => handleAction('RAISE')} style={{ ...styles.actionBtn, background: '#d32f2f', marginTop: '10px', width: '100%' }}>
                RAISE
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#888', padding: '20px', fontFamily: 'monospace' }}>
            WARTE AUF ANDERE SPIELER...
          </div>
        )}
      </div>

      <Link href="/spiele" style={styles.exitLink}>🚪 Lobby</Link>
    </div>
  );
}

const styles = {
  casinoRoom: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505', padding: '10px', fontFamily: 'system-ui, sans-serif' },
  tableLeatherRail: { background: 'linear-gradient(45deg, #2a0800, #4a1500)', padding: '25px', borderRadius: '150px', boxShadow: '0 30px 60px rgba(0,0,0,0.9), inset 0 20px 20px rgba(255,255,255,0.1)', width: '100%', maxWidth: '800px', height: '450px', display: 'flex', border: '2px solid #111', marginTop: '40px' },
  tableFelt: { background: 'radial-gradient(ellipse at center, #0a4f22 0%, #04240e 100%)', borderRadius: '120px', width: '100%', height: '100%', border: '4px solid #000', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.9)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  tableLogo: { position: 'absolute', top: '25%', opacity: 0.15, fontSize: '3rem', fontFamily: "'Cinzel', serif", color: '#fff', textAlign: 'center', width: '100%' },
  boardCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5 },
  potDisplay: { background: 'rgba(0,0,0,0.7)', border: '1px solid #d4af37', padding: '5px 20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Orbitron', monospace", fontWeight: 'bold', marginBottom: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' },
  communityCardsRow: { display: 'flex', gap: '10px' },
  cardPlaceholder: { width: '60px', height: '90px', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  controlPanel: { width: '100%', maxWidth: '800px', background: '#111', borderRadius: '15px', border: '2px solid #333', marginTop: '30px', overflow: 'hidden' },
  statusBar: { background: 'linear-gradient(to right, #0d0d0d, #222, #0d0d0d)', color: '#fff', textAlign: 'center', padding: '10px', fontFamily: "'Orbitron', monospace", letterSpacing: '2px', borderBottom: '1px solid #333' },
  actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '10px', padding: '15px' },
  actionBtn: { padding: '15px', border: 'none', borderRadius: '8px', color: '#fff', fontFamily: "'Oswald', sans-serif", fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 10px rgba(0,0,0,0.5)', transition: 'transform 0.1s' },
  raiseBox: { background: '#0a0a0a', padding: '10px', borderRadius: '8px', border: '1px solid #444', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  exitLink: { marginTop: '20px', color: '#666', textDecoration: 'none', fontFamily: 'monospace', borderBottom: '1px solid #444' }
};
