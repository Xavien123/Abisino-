'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const CHIP_VALUES = [1.00, 5.00, 10.00, 25.00, 50.00, 100.00];
const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export default function PremiumBlackjack() {
  const [balance, setBalance] = useState(500.00);
  const [bet, setBet] = useState(0);
  const [selectedChip, setSelectedChip] = useState(5.00);
  
  const [phase, setPhase] = useState('BETTING'); // BETTING, DEALING, PLAYER_TURN, DEALER_TURN, RESULT
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [message, setMessage] = useState('EINSATZ PLATZIEREN');
  const [winStatus, setWinStatus] = useState(null); // 'win', 'loss', 'push', 'blackjack'

  // Kartendeck generieren und mischen
  const createDeck = () => {
    let newDeck = [];
    for (let suit of SUITS) {
      for (let value of VALUES) {
        newDeck.push({ suit, value, isHidden: false });
      }
    }
    return newDeck.sort(() => Math.random() - 0.5);
  };

  // Handwert berechnen
  const calculateScore = (hand) => {
    let score = 0;
    let aces = 0;
    for (let card of hand) {
      if (card.isHidden) continue;
      if (['J', 'Q', 'K'].includes(card.value)) score += 10;
      else if (card.value === 'A') { score += 11; aces += 1; }
      else score += parseInt(card.value);
    }
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    return score;
  };

  const placeBet = () => {
    if (balance < selectedChip) {
      setMessage('⚠️ GUTHABEN ZU NIEDRIG ⚠️');
      return;
    }
    setBalance(prev => prev - selectedChip);
    setBet(prev => prev + selectedChip);
    setMessage(`EINSATZ: ${bet + selectedChip} AC`);
  };

  const clearBet = () => {
    setBalance(prev => prev + bet);
    setBet(0);
    setMessage('EINSATZ PLATZIEREN');
  };

  const startGame = () => {
    if (bet === 0) return;
    setPhase('DEALING');
    setMessage('KARTEN WERDEN GEGEBEN...');
    setWinStatus(null);
    
    const currentDeck = createDeck();
    
    // Verzögerte Austeil-Animation (3D-Effekt)
    setTimeout(() => {
      setPlayerHand([currentDeck[0]]);
      setTimeout(() => {
        setDealerHand([currentDeck[1]]);
        setTimeout(() => {
          setPlayerHand([currentDeck[0], currentDeck[2]]);
          setTimeout(() => {
            // Die zweite Karte des Dealers ist anfangs verdeckt
            setDealerHand([currentDeck[1], { ...currentDeck[3], isHidden: true }]);
            setDeck(currentDeck.slice(4));
            
            // Check auf sofortigen Blackjack
            const pScore = calculateScore([currentDeck[0], currentDeck[2]]);
            if (pScore === 21) {
              handleResult(21, calculateScore([currentDeck[1], currentDeck[3]]), true);
            } else {
              setPhase('PLAYER_TURN');
              setMessage('ZUG WÄHLEN: HIT ODER STAND');
            }
          }, 400);
        }, 400);
      }, 400);
    }, 400);
  };

  const hit = () => {
    const newCard = deck[0];
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    setDeck(deck.slice(1));

    const score = calculateScore(newHand);
    if (score > 21) {
      setPhase('RESULT');
      setWinStatus('loss');
      setMessage('💥 ÜBERKAUFT! BUSTED! 💥');
      setTimeout(() => resetGame(), 4000);
    }
  };

  const stand = () => {
    setPhase('DEALER_TURN');
    setMessage('DEALER ZIEHT...');
    
    // Dealer dreht seine verdeckte Karte um
    let currentDealerHand = [...dealerHand];
    currentDealerHand[1].isHidden = false;
    setDealerHand([...currentDealerHand]);

    let currentDeck = [...deck];
    
    // Dealer KI (zieht bis 17)
    const playDealer = (hand, remainingDeck) => {
      let score = calculateScore(hand);
      if (score < 17) {
        setTimeout(() => {
          const newHand = [...hand, remainingDeck[0]];
          setDealerHand(newHand);
          playDealer(newHand, remainingDeck.slice(1));
        }, 800);
      } else {
        handleResult(calculateScore(playerHand), score, false);
      }
    };
    
    playDealer(currentDealerHand, currentDeck);
  };

  const handleResult = (pScore, dScore, isBlackjack) => {
    setPhase('RESULT');
    if (isBlackjack) {
      const winAmount = bet + (bet * 1.5);
      setBalance(prev => prev + winAmount);
      setWinStatus('blackjack');
      setMessage(`♠️ BLACKJACK! +${winAmount.toFixed(2)} AC ♠️`);
    } else if (dScore > 21 || pScore > dScore) {
      const winAmount = bet * 2;
      setBalance(prev => prev + winAmount);
      setWinStatus('win');
      setMessage(`🎉 GEWONNEN! +${winAmount.toFixed(2)} AC 🎉`);
    } else if (pScore === dScore) {
      setBalance(prev => prev + bet);
      setWinStatus('push');
      setMessage('🤝 UNENTSCHIEDEN (PUSH) 🤝');
    } else {
      setWinStatus('loss');
      setMessage(`VERLOREN. Dealer hat ${dScore}`);
    }
    setTimeout(() => resetGame(), 4000);
  };

  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setBet(0);
    setPhase('BETTING');
    setMessage('NEUER EINSATZ BITTEN');
    setWinStatus(null);
  };

  // Hilfskomponente für die 3D Spielkarte
  const Card = ({ card, index }) => {
    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
      <div 
        className={`playing-card ${card.isHidden ? 'card-hidden' : 'card-visible'}`}
        style={{
          color: isRed ? '#d32f2f' : '#111',
          marginLeft: index > 0 ? '-40px' : '0', // Fächer-Effekt
          animationDelay: `${index * 0.1}s`
        }}
      >
        {card.isHidden ? (
          <div className="card-back"></div>
        ) : (
          <div className="card-front">
            <div className="card-value-top">{card.value} {card.suit}</div>
            <div className="card-center">{card.suit}</div>
            <div className="card-value-bottom">{card.value} {card.suit}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.casinoRoom}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&display=swap');

        /* 3D Karten Animationen */
        @keyframes slideIn {
          0% { transform: translateY(-200px) rotateY(180deg) scale(0.5); opacity: 0; }
          100% { transform: translateY(0) rotateY(0deg) scale(1); opacity: 1; }
        }
        .playing-card {
          width: 90px;
          height: 130px;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 10px 20px rgba(0,0,0,0.5), inset 0 0 5px rgba(0,0,0,0.1);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 8px;
          font-weight: 900;
          font-family: 'Arial', sans-serif;
          animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }
        .card-back {
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(45deg, #d32f2f, #d32f2f 10px, #b71c1c 10px, #b71c1c 20px);
          border-radius: 4px;
          border: 2px solid #fff;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
        }
        .card-front { display: flex; flex-direction: column; height: 100%; justify-content: space-between; }
        .card-value-top { font-size: 1.2rem; line-height: 1; }
        .card-center { font-size: 3rem; text-align: center; line-height: 1; flex-grow: 1; display: flex; align-items: center; justify-content: center; }
        .card-value-bottom { font-size: 1.2rem; line-height: 1; text-align: right; transform: rotate(180deg); }
        
        .chip-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: radial-gradient(circle at center, #222 0%, #000 100%);
          border: 3px dashed #d4af37;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 5px 10px rgba(0,0,0,0.6);
        }
        .chip-btn.active { transform: translateY(-10px) scale(1.1); box-shadow: 0 15px 25px rgba(0,0,0,0.8); border-color: #fff; }
      `}</style>

      <div style={styles.tableWood}>
        <div style={styles.feltSurface}>
          
          {/* Header & Balance */}
          <div style={styles.header}>
            <div style={styles.balanceBox}>
              <span style={styles.label}>KONTO</span>
              <span style={styles.value}>{balance.toFixed(2)}</span>
            </div>
            <div style={{...styles.balanceBox, borderColor: '#00ffcc'}}>
              <span style={{...styles.label, color: '#00ffcc'}}>EINSATZ</span>
              <span style={{...styles.value, color: '#00ffcc'}}>{bet.toFixed(2)}</span>
            </div>
          </div>

          {/* DEALER BEREICH */}
          <div style={styles.handArea}>
            <div style={styles.scoreBadge}>
              DEALER {phase !== 'BETTING' && phase !== 'DEALING' && !dealerHand[1]?.isHidden ? calculateScore(dealerHand) : '?'}
            </div>
            <div style={styles.cardContainer}>
              {dealerHand.map((card, i) => <Card key={`dealer-${i}`} card={card} index={i} />)}
            </div>
          </div>

          {/* NACHRICHTEN DISPLAY */}
          <div style={{
            ...styles.messageDisplay,
            color: winStatus === 'win' || winStatus === 'blackjack' ? '#d4af37' : winStatus === 'loss' ? '#ff3333' : '#fff'
          }}>
            {message}
          </div>

          {/* SPIELER BEREICH */}
          <div style={styles.handArea}>
            <div style={styles.cardContainer}>
              {playerHand.map((card, i) => <Card key={`player-${i}`} card={card} index={i} />)}
            </div>
            <div style={styles.scoreBadge}>
              SPIELER {phase !== 'BETTING' && phase !== 'DEALING' ? calculateScore(playerHand) : '0'}
            </div>
          </div>

          {/* CONTROL PANEL */}
          <div style={styles.controlPanel}>
            {phase === 'BETTING' && (
              <>
                <div style={styles.chipRack}>
                  {CHIP_VALUES.map(val => (
                    <button 
                      key={val} 
                      onClick={() => setSelectedChip(val)}
                      className={`chip-btn ${selectedChip === val ? 'active' : ''}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div style={styles.actionButtons}>
                  <button onClick={clearBet} style={{...styles.actionBtn, background: '#444'}}>LÖSCHEN</button>
                  <button onClick={placeBet} style={{...styles.actionBtn, background: '#2e7d32'}}>SETZEN</button>
                  <button onClick={startGame} disabled={bet === 0} style={{...styles.actionBtn, background: bet === 0 ? '#555' : '#d4af37', color: '#000'}}>DEAL</button>
                </div>
              </>
            )}

            {phase === 'PLAYER_TURN' && (
              <div style={styles.actionButtons}>
                <button onClick={hit} style={{...styles.actionBtn, background: '#d32f2f', padding: '20px'}}>HIT (Karte)</button>
                <button onClick={stand} style={{...styles.actionBtn, background: '#2e7d32', padding: '20px'}}>STAND (Halten)</button>
              </div>
            )}
          </div>

          <Link href="/spiele" style={styles.exitLink}>🚪 Tisch verlassen</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  casinoRoom: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a', padding: '10px', fontFamily: 'system-ui, sans-serif' },
  tableWood: { background: 'linear-gradient(45deg, #1a0b00, #3a1c00)', padding: '15px', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.9)', width: '100%', maxWidth: '600px', border: '5px solid #0a0400' },
  feltSurface: { background: 'radial-gradient(ellipse at center, #0a4f22 0%, #04240e 100%)', borderRadius: '20px', padding: '20px', border: '2px solid #d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)' },
  header: { width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  balanceBox: { background: '#000', border: '2px solid #d4af37', padding: '10px 20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  label: { color: '#888', fontSize: '0.7rem', fontWeight: 'bold' },
  value: { color: '#fff', fontSize: '1.2rem', fontFamily: 'monospace', fontWeight: 'bold' },
  handArea: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '160px', margin: '10px 0' },
  scoreBadge: { background: 'rgba(0,0,0,0.6)', color: '#d4af37', padding: '5px 15px', borderRadius: '20px', border: '1px solid #d4af37', fontWeight: 'bold', margin: '10px 0', fontFamily: "'Cinzel', serif" },
  cardContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  messageDisplay: { background: '#000', border: '1px solid #333', padding: '10px', borderRadius: '8px', width: '100%', textAlign: 'center', fontFamily: "monospace", fontSize: '1rem', fontWeight: 'bold', margin: '10px 0', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  controlPanel: { width: '100%', background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '10px' },
  chipRack: { display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' },
  actionButtons: { display: 'flex', gap: '10px', width: '100%' },
  actionBtn: { flex: 1, padding: '15px', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '900', cursor: 'pointer', boxShadow: '0 5px 10px rgba(0,0,0,0.5)', transition: 'transform 0.1s' },
  exitLink: { marginTop: '20px', color: '#888', textDecoration: 'none', fontSize: '0.9rem', borderBottom: '1px solid #444' }
};
