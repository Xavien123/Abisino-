import Link from 'next/link';

export default function SpieleLobby() {
  return (
    <div className="main-container">
      <h1 className="luxury-title" style={{ fontSize: '4rem' }}>Die VIP Lobby</h1>
      <p className="luxury-subtitle">
        Dein Guthaben ist geladen. Wähle deinen Tisch und mach deinen Einsatz. Viel Erfolg.
      </p>
      
      {/* Das Casino-Grid für die Spielauswahl */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        width: '100%', 
        maxWidth: '900px', 
        marginTop: '20px' 
      }}>
        <Link href="/blackjack" className="btn-ghost" style={{ padding: '30px 20px' }}>
          Blackjack
        </Link>
        <Link href="/poker" className="btn-ghost" style={{ padding: '30px 20px' }}>
          Texas Hold'em Poker
        </Link>
        <Link href="/slots" className="btn-ghost" style={{ padding: '30px 20px' }}>
          Slot Machine
        </Link>
        <Link href="/wuerfel" className="btn-ghost" style={{ padding: '30px 20px' }}>
          Würfel (Craps)
        </Link>
        <Link href="/roulette" className="btn-ghost" style={{ padding: '30px 20px' }}>
          Roulette
        </Link>
      </div>
      
      <Link href="/" style={{ color: '#c0ccc4', marginTop: '60px', textDecoration: 'none', borderBottom: '1px solid #c0ccc4' }}>
        Lobby verlassen
      </Link>
    </div>
  );
}
