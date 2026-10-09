import React, { useState } from 'react';

export default function Register({ onRegisterSuccess, onNavigateToLogin, apiBaseUrl }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Front-end validations
    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        onRegisterSuccess(data.user, data.token);
      } else {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          setError(Array.isArray(firstError) ? firstError[0] : firstError);
        } else {
          setError(data.message || data.error || 'No se pudo completar el registro.');
        }
      }
    } catch (err) {
      console.error('Error de registro:', err);
      setError('Error al conectar con el servidor. Verifique su conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in">
      <div className="auth-header">
        <h2 className="auth-title">Crear Cuenta</h2>
        <p className="auth-subtitle">Regístrate para comenzar a gestionar tus proyectos</p>
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
          <label className="form-label" htmlFor="name">Nombre Completo</label>
          <div className="input-wrapper">
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>
        </div>

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
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
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

        <div className="form-group">
          <label className="form-label" htmlFor="passwordConfirmation">Confirmar Contraseña</label>
          <div className="input-wrapper">
            <input
              id="passwordConfirmation"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="Repite tu contraseña"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner"></div>
              <span>Registrando...</span>
            </>
          ) : (
            <span>Crear Cuenta</span>
          )}
        </button>
      </form>

      <div className="auth-footer">
        ¿Ya tienes una cuenta?
        <button type="button" className="auth-link" onClick={onNavigateToLogin}>
          Inicia sesión
        </button>
      </div>
    </div>
  );
}
