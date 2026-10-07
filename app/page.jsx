import Link from 'next/link';

export default function Home() {
  return (
    <div className="main-container">
      <h1 className="luxury-title">ABI CASINO</h1>
      <p className="luxury-subtitle">
        Willkommen in der absoluten Spitzenklasse. Erlebe die Atmosphäre eines 5-Sterne-Casinos in Las Vegas. 
        Registriere dich jetzt und erhalte dein exklusives Startguthaben.
      </p>
      
      <div className="button-group">
        <Link href="/register" className="btn-premium">
          VIP Zugang sichern (+ 2 AC)
        </Link>
        <Link href="/login" className="btn-ghost">
          Bereits Mitglied? Login
        </Link>
      </div>
    </div>
  );
}
