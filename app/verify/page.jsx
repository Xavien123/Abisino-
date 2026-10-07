"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Verify() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', code: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Falscher Code.');
      } else {
        router.push('/spiele'); // Bei Erfolg direkt in die Lobby!
      }
    } catch (err) {
      setError('Verbindungsfehler zum Casino-Server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <h1 className="luxury-title" style={{ fontSize: '3rem' }}>VIP Freischaltung</h1>
      <p className="luxury-subtitle" style={{ marginBottom: '30px' }}>
        Bitte gib deine E-Mail und den 6-stelligen Code aus unserer E-Mail ein, um deine <strong>2 AC</strong> zu erhalten.
      </p>
      
      <form onSubmit={handleSubmit} style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '40px', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.3)', width: '100%', maxWidth: '400px' }}>
        {error && <div style={{ color: '#ff4444', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}
        
        <input 
          type="email" 
          placeholder="Deine E-Mail Adresse" 
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{ width: '100%', padding: '15px', marginBottom: '20px', background: '#0a140f', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', outline: 'none' }} 
        />
        <input 
          type="text" 
          placeholder="6-stelliger VIP-Code" 
          required
          maxLength="6"
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value})}
          style={{ width: '100%', padding: '15px', marginBottom: '30px', background: '#0a140f', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', outline: 'none', letterSpacing: '3px', textAlign: 'center', fontSize: '1.2rem' }} 
        />
        
        <button type="submit" disabled={loading} className="btn-premium" style={{ width: '100%', border: 'none', cursor: loading ? 'wait' : 'pointer' }}>
          {loading ? 'Prüfe Code...' : 'Konto freischalten'}
        </button>
      </form>
    </div>
  );
}
