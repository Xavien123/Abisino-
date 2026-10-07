"use client";
import Link from 'next/link';

export default function Register() {
  return (
    <div className="main-container">
      <h1 className="luxury-title" style={{ fontSize: '3rem' }}>VIP Registrierung</h1>
      <p className="luxury-subtitle" style={{ marginBottom: '30px' }}>
        Eröffne dein Konto und erhalte sofort <strong>2 Abi Coins (AC)</strong> als Willkommensbonus.
      </p>
      
      <div style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '40px', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.3)', width: '100%', maxWidth: '400px' }}>
        <input 
          type="email" 
          placeholder="E-Mail Adresse" 
          required
          style={{ width: '100%', padding: '15px', marginBottom: '20px', background: '#0a140f', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', outline: 'none' }} 
        />
        <input 
          type="text" 
          placeholder="Gewünschter Spielername" 
          required
          style={{ width: '100%', padding: '15px', marginBottom: '20px', background: '#0a140f', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', outline: 'none' }} 
        />
        <input 
          type="password" 
          placeholder="Sicheres Passwort" 
          required
          style={{ width: '100%', padding: '15px', marginBottom: '30px', background: '#0a140f', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', outline: 'none' }} 
        />
        
        {/* Fürs Erste leitet der Button testweise in die Lobby, später speichern wir hier die Daten */}
        <Link href="/spiele" style={{ display: 'block' }}>
          <button className="btn-premium" style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
            Konto erstellen & 2 AC sichern
          </button>
        </Link>
      </div>
      
      <Link href="/" style={{ color: '#c0ccc4', marginTop: '40px', textDecoration: 'none', borderBottom: '1px solid #c0ccc4' }}>
        Zurück zum Eingang
      </Link>
    </div>
  );
}
