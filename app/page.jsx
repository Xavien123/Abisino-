import Link from 'next/link';

export default function Home() {
  return (
    <div className="main-container">
      <h1 className="luxury-title">ABI CASINO</h1>
      <p className="luxury-subtitle">
        Willkommen in der absoluten Spitzenklasse. Erlebe die Atmosphäre eines 5-Sterne-Casinos in Las Vegas. Exklusiv, diskret und voller Spannung. Dein Platz am VIP-Tisch erwartet dich.
      </p>
      
      <div className="button-group">
        <Link href="/login" className="btn-premium">
          VIP Zugang
        </Link>
        <Link href="/spiele" className="btn-ghost">
          Spiele ansehen
        </Link>
      </div>
    </div>
  );
}
