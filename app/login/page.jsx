"use client";
import Link from 'next/link';

export default function Login() {
  return (
    <div className="main-container">
      <h1 className="luxury-title" style={{ fontSize: '3rem' }}>VIP Zugang</h1>
      <p className="luxury-subtitle" style={{ marginBottom: '30px' }}>
        Bitte identifiziere dich an der Rezeption.
      </p>
      
      <div style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '40px', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.3)', width: '100%', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder="Benutzername" 
          style={{ width: '100%', padding: '15px', marginBottom: '20px', background: '#0a140f', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', outline: 'none' }} 
        />
        <input 
          type="password" 
          placeholder="Passwort" 
          style={{ width: '100%', padding: '15px', marginBottom: '30px', background: '#0a140f', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', outline: 'none' }} 
        />
        
        <button className="btn-premium" style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
          Eintreten
        </button>
      </div>
      
      <Link href="/" style={{ color: '#c0ccc4', marginTop: '40px', textDecoration: 'none', borderBottom: '1px solid #c0ccc4' }}>
        Zurück zum Eingang
      </Link>
    </div>
  );
}
