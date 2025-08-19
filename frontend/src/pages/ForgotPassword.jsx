import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/LoginForm.css';
import { MdEmail, MdSend } from 'react-icons/md';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock: simulamos solicitud enviada
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-container">
        <div className="floating-elements">
          <div className="floating-element element-1">📧</div>
          <div className="floating-element element-2">🔒</div>
          <div className="floating-element element-3">✅</div>
          <div className="floating-element element-4">📨</div>
        </div>

        <div className="login-card glass" style={{ maxWidth: 560 }}>
          <h1 className="login-title">Recuperar contraseña</h1>

          {!sent ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">
                  <MdEmail style={{ verticalAlign: 'middle', marginRight: 6 }} /> Email asociado a tu cuenta
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-actions">
                <button type="submit" className="btn btn-primary btn-glow btn-large" disabled={loading}>
                  <MdSend size={20} /> {loading ? 'Enviando...' : 'Enviar enlace'}
                </button>
                <Link to="/login" className="btn btn-outline btn-large">Volver al login</Link>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <h3 style={{ marginBottom: 10 }}>¡Revisa tu correo!</h3>
              <p style={{ color: '#d0d0d0', marginBottom: 20 }}>
                Si existe una cuenta asociada a <b>{email}</b>, te enviamos un enlace para restablecer tu contraseña.
              </p>
              <div className="login-actions">
                <Link to="/login" className="btn btn-primary btn-glow btn-large">Ir al login</Link>
                <button className="btn btn-outline btn-large" onClick={() => setSent(false)}>Enviar a otro correo</button>
              </div>
            </div>
          )}
        </div>

        <div className="welcome-message">
          <h2>Feti <span className="fit">Life</span></h2>
          <h3>Recupera</h3>
          <p>Te ayudamos a restablecer tu acceso</p>
          <h1>← Ingresa tu email</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
