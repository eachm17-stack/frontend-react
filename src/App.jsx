import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'https://laravel-task-api.onrender.com/api';
  const clean = envUrl.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const API_BASE = getApiBaseUrl();

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [currentView, setCurrentView] = useState(() => (user ? 'projects' : 'home'));
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    if (user && currentView === 'projects') {
      setLoadingProjects(true);
      fetch(`${API_BASE}/projects`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
        .then((r) => r.json())
        .then((d) => setProjects(Array.isArray(d) ? d : []))
        .catch(console.error)
        .finally(() => setLoadingProjects(false));
    }
  }, [user, currentView, token]);

  const handleAuthSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userToken) {
      localStorage.setItem('token', userToken);
    }
    setCurrentView('projects');
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, { method: 'POST' });
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setCurrentView('home');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="app-nav">
        <div className="nav-brand" onClick={() => setCurrentView('home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span>TaskSaas Cloud</span>
        </div>

        <div className="nav-actions">
          <button
            className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentView('home')}
          >
            Inicio
          </button>

          {user && (
            <button
              className={`nav-btn ${currentView === 'projects' ? 'active' : ''}`}
              onClick={() => setCurrentView('projects')}
            >
              Proyectos
            </button>
          )}

          {user ? (
            <>
              <div className="user-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>{user.name || user.email}</span>
              </div>
              <button className="nav-btn" style={{ color: '#ef4444' }} onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <button
                className={`nav-btn ${currentView === 'login' ? 'active' : ''}`}
                onClick={() => setCurrentView('login')}
              >
                Ingresar
              </button>
              <button
                className="btn-primary"
                style={{ marginTop: 0, padding: '0.45rem 1rem', fontSize: '0.875rem' }}
                onClick={() => setCurrentView('register')}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content View */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
        {currentView === 'home' && (
          <section className="animate-fade-in" style={{ textAlign: 'center', maxWidth: '680px', marginTop: '3rem' }}>
            <span style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
              Arquitectura Cloud Desacoplada
            </span>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '1.5rem 0 1rem', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
              Gestión Inteligente de Proyectos
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Plataforma optimizada con React 19 en el cliente y Laravel Breeze API en el backend para una experiencia segura, rápida y escalable.
            </p>
            {!user ? (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  className="btn-primary"
                  style={{ width: 'auto', padding: '0.85rem 2rem' }}
                  onClick={() => setCurrentView('register')}
                >
                  Comenzar gratis
                </button>
                <button
                  className="nav-btn"
                  style={{ border: '1px solid var(--border-color)', padding: '0.85rem 1.75rem', borderRadius: 'var(--radius-sm)' }}
                  onClick={() => setCurrentView('login')}
                >
                  Ya tengo cuenta
                </button>
              </div>
            ) : (
              <button
                className="btn-primary"
                style={{ width: 'auto', padding: '0.85rem 2rem', margin: '0 auto' }}
                onClick={() => setCurrentView('projects')}
              >
                Ver Mis Proyectos
              </button>
            )}
          </section>
        )}

        {currentView === 'login' && (
          <Login
            onLoginSuccess={handleAuthSuccess}
            onNavigateToRegister={() => setCurrentView('register')}
            apiBaseUrl={API_BASE}
          />
        )}

        {currentView === 'register' && (
          <Register
            onRegisterSuccess={handleAuthSuccess}
            onNavigateToLogin={() => setCurrentView('login')}
            apiBaseUrl={API_BASE}
          />
        )}

        {currentView === 'projects' && user && (
          <section className="glass-card animate-fade-in" style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Proyectos en Vivo</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Conectado a la API PostgreSQL Neon DB</p>
              </div>
            </div>

            {loadingProjects ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '2rem', justifyContent: 'center' }}>
                <div className="spinner"></div>
                <span style={{ color: '#94a3b8' }}>Cargando proyectos...</span>
              </div>
            ) : projects.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {projects.map((p) => (
                  <li
                    key={p.id}
                    style={{
                      background: 'rgba(31, 41, 55, 0.5)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1rem',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{p.title || p.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                      Activo
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                <p>No hay proyectos registrados en la base de datos.</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}