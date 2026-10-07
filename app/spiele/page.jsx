import Link from 'next/link';

export default function SpieleLobby() {
  return (
    <div className="main-container">
      <h1 className="luxury-title" style={{ fontSize: '4rem' }}>Die Lobby</h1>
      <p className="luxury-subtitle">
        Wähle deinen Tisch und mach deinen Einsatz.
      </p>
      
      <div className="button-group" style={{ marginTop: '20px' }}>
        <Link href="/roulette" className="btn-premium">Roulette</Link>
        <Link href="/blackjack" className="btn-premium">Blackjack</Link>
        <Link href="/slots" className="btn-premium">Slot Machines</Link>
      </div>
      
      <Link href="/" style={{ color: '#c0ccc4', marginTop: '60px', textDecoration: 'none', borderBottom: '1px solid #c0ccc4' }}>
        Zurück zum Eingang
      </Link>
    </div>
  );
}
