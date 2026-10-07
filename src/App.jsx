import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://laravel-task-api.onrender.com/api';

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [currentView, setCurrentView] = useState('home');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`${API_BASE}/projects`)
        .then(r => r.json())
        .then(d => setProjects(Array.isArray(d) ? d : []))
        .catch(console.error);
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentView('projects');
    } else {
      alert('Error: Credenciales no válidas');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('home');
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#090d16', color: '#f8fafc' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#111827', borderBottom: '1px solid #1f2937' }}>
        <div style={{ fontWeight: 800, color: '#ef4444' }}>TaskSaas Cloud</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setCurrentView('home')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Inicio</button>
          {user && <button onClick={() => setCurrentView('projects')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>Proyectos</button>}
          {user ? (
            <>
              <span style={{ fontSize: '0.85rem', color: '#10b981' }}>{user.name || user.email}</span>
              <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>Salir</button>
            </>
          ) : (
            <button onClick={() => setCurrentView('login')} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>Ingresar</button>
          )}
        </div>
      </nav>

      <main style={{ maxWidth: '720px', margin: '2rem auto', padding: '0 1rem' }}>
        {currentView === 'home' && (
          <section style={{ textAlign: 'center', padding: '2rem 0' }}>
            <h1 style={{ fontSize: '2rem' }}>Bienvenido al Gestor Cloud</h1>
            <p style={{ color: '#94a3b8' }}>Arquitectura moderna desacoplada: React (Vercel) + Laravel (Render) + Neon DB.</p>
          </section>
        )}

        {currentView === 'login' && (
          <form onSubmit={handleLogin} style={{ background: '#111827', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1f2937' }}>
            <h2>Iniciar Sesión</h2>
            <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
            <button type="submit" style={{ width: '100%', padding: '9px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px' }}>Entrar</button>
          </form>
        )}

        {currentView === 'projects' && user && (
          <div>
            <h2>Proyectos en Vivo (PostgreSQL Neon)</h2>
            <ul>
              {projects.map(p => <li key={p.id}>{p.title}</li>)}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}