"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Etwas ist schiefgelaufen.');
      } else {
        // Bei Erfolg direkt in die Lobby schicken
        router.push('/spiele');
      }
    } catch (err) {
      setError('Verbindungsfehler zum Casino-Server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <h1 className="luxury-title" style={{ fontSize: '3rem' }}>VIP Registrierung</h1>
      <p className="luxury-subtitle" style={{ marginBottom: '30px' }}>
        Eröffne dein Konto und erhalte sofort <strong>2 Abi Coins (AC)</strong> als Willkommensbonus.
      </p>
      
      <form onSubmit={handleSubmit} style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '40px', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.3)', width: '100%', maxWidth: '400px' }}>
        {error && <div style={{ color: '#ff4444', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}
        
        <input 
          type="email" 
          placeholder="E-Mail Adresse" 
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{ width: '100%', padding: '15px', marginBottom: '20px', background: '#0a140f', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', outline: 'none' }} 
        />
        <input 
          type="text" 
          placeholder="Gewünschter Spielername" 
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{ width: '100%', padding: '15px', marginBottom: '20px', background: '#0a140f', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', outline: 'none' }} 
        />
        <input 
          type="password" 
          placeholder="Sicheres Passwort" 
          required
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          style={{ width: '100%', padding: '15px', marginBottom: '30px', background: '#0a140f', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', outline: 'none' }} 
        />
        
        <button type="submit" disabled={loading} className="btn-premium" style={{ width: '100%', border: 'none', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Account wird erstellt...' : 'Konto erstellen & 2 AC sichern'}
        </button>
      </form>
      
      <Link href="/" style={{ color: '#c0ccc4', marginTop: '40px', textDecoration: 'none', borderBottom: '1px solid #c0ccc4' }}>
        Zurück zum Eingang
      </Link>
    </div>
  );
}
