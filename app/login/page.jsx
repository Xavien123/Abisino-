'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Der "Wegweiser" von Next.js

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault(); // Verhindert, dass die Seite neu lädt
    
    // Hier kommt später die echte Supabase-Passwortprüfung rein.
    // Für jetzt leiten wir dich direkt zum neuen Automaten weiter, 
    // damit du das Design testen kannst!
    
    router.push('/spiele'); // Leitet dich sofort auf die Spiele-Seite um
  };

  return (
    <div className="main-container">
      <h1 className="luxury-title" style={{ fontSize: '3rem' }}>VIP Zugang</h1>
      <p className="luxury-subtitle" style={{ marginBottom: '30px' }}>
        Bitte identifiziere dich an der Rezeption.
      </p>

      {/* Das Formular mit der neuen handleLogin Funktion */}
      <form onSubmit={handleLogin} style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '40px', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.3)', width: '100%', maxWidth: '400px' }}>
        
        <input
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: '15px', marginBottom: '20px', background: '#0a0a0f', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', outline: 'none' }}
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '15px', marginBottom: '30px', background: '#0a0a0f', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', outline: 'none' }}
        />

        <button type="submit" className="btn-premium" style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
          Eintreten
        </button>
      </form>

      <Link href="/" style={{ color: '#cccccc', marginTop: '40px', textDecoration: 'none', borderBottom: '1px solid #cccccc' }}>
        Zurück zum Eingang
      </Link>
    </div>
  );
}
