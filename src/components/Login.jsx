import React, { useState } from 'react';

export default function Login({ onLoginSuccess, onNavigateToRegister, apiBaseUrl }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        onLoginSuccess(data.user, data.token);
      } else {
        setError(data.error || data.message || 'Credenciales inválidas. Inténtelo de nuevo.');
      }
    } catch (err) {
      console.error('Error de autenticación:', err);
      setError('Error al conectar con el servidor. Verifique su conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in">
      <div className="auth-header">
        <h2 className="auth-title">Iniciar Sesión</h2>
        <p className="auth-subtitle">Accede a tu cuenta de TaskSaas Cloud</p>
      </div>

      {error && (
        <div className="alert-error" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Correo Electrónico</label>
          <div className="input-wrapper">
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Contraseña</label>
          <div className="input-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner"></div>
              <span>Ingresando...</span>
            </>
          ) : (
            <span>Ingresar</span>
          )}
        </button>
      </form>

      <div className="auth-footer">
        ¿No tienes una cuenta?
        <button type="button" className="auth-link" onClick={onNavigateToRegister}>
          Regístrate aquí
        </button>
      </div>
    </div>
  );
}
