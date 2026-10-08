'use client';
import Link from 'next/link';

export default function SpieleLobby() {
  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Oswald:wght@400;700&display=swap');
        
        .game-card {
          background: linear-gradient(145deg, #1a1a1a, #050505);
          border: 2px solid #333;
          border-radius: 15px;
          padding: 30px 20px;
          text-align: center;
          text-decoration: none;
          color: #fff;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          position: relative;
          overflow: hidden;
        }
        
        .game-card::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(212, 175, 55, 0.1) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-25deg); transition: all 0.5s;
        }
        
        .game-card:hover {
          transform: translateY(-5px);
          border-color: #d4af37;
          box-shadow: 0 15px 30px rgba(212, 175, 55, 0.2);
        }
        
        .game-card:hover::before { left: 200%; }

        .game-icon { font-size: 3.5rem; text-shadow: 0 5px 15px rgba(0,0,0,0.8); }
        .game-title { font-family: 'Orbitron', sans-serif; font-weight: bold; font-size: 1.2rem; color: #d4af37; letter-spacing: 1px; }
        
        .bank-btn {
          background: linear-gradient(to right, #d4af37, #f9d71c, #d4af37);
          color: #000;
          padding: 15px 40px;
          border-radius: 30px;
          text-decoration: none;
          font-family: 'Oswald', sans-serif;
          font-weight: bold;
          font-size: 1.2rem;
          display: inline-block;
          margin-bottom: 40px;
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
          transition: transform 0.2s;
        }
        .bank-btn:active { transform: scale(0.95); }
      `}</style>

      <h1 style={styles.title}>ABISINO LOBBY</h1>
      <p style={styles.subtitle}>Wähle deinen Tisch und platziere deine Einsätze.</p>

      {/* Hier geht es später zum Guthaben-Aufladen! */}
      <Link href="/bank" className="bank-btn">
        🏦 ZUR KASSE (Guthaben & Profil)
      </Link>

      <div style={styles.grid}>
        <Link href="/slots" className="game-card">
          <span className="game-icon">🎰</span>
          <span className="game-title">VIP SLOTS</span>
        </Link>
        
        <Link href="/roulette" className="game-card">
          <span className="game-icon">🎡</span>
          <span className="game-title">ROULETTE</span>
        </Link>
        
        <Link href="/blackjack" className="game-card">
          <span className="game-icon">🃏</span>
          <span className="game-title">BLACKJACK</span>
        </Link>
        
        <Link href="/poker" className="game-card">
          <span className="game-icon">♠️</span>
          <span className="game-title">TEXAS HOLD'EM</span>
        </Link>
        
        {/* HIER IST DER GEFIXTE LINK FÜR DEIN WÜRFELSPIEL */}
        <Link href="/craps" className="game-card">
          <span className="game-icon">🎲</span>
          <span className="game-title">CRAPS (WÜRFEL)</span>
        </Link>
      </div>

      <Link href="/" style={styles.exit}>🚪 Casino verlassen</Link>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#050505',
    backgroundImage: 'radial-gradient(circle at top center, #1a1a1a 0%, #000 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    fontFamily: 'system-ui, sans-serif'
  },
  title: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '3rem',
    color: '#d4af37',
    margin: '0 0 10px 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
    textAlign: 'center'
  },
  subtitle: {
    color: '#aaa',
    fontSize: '1rem',
    marginBottom: '30px',
    textAlign: 'center'
  },
  grid: {
    display: 'grid',
    // Passt sich automatisch ans Handy oder den Desktop an!
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '900px',
    marginBottom: '50px'
  },
  exit: {
    color: '#666',
    textDecoration: 'none',
    borderBottom: '1px solid #444',
    paddingBottom: '5px',
    fontFamily: 'monospace'
  }
};
