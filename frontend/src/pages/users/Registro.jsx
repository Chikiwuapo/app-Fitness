import React, { useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Registro.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { MdPerson, MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdPersonAdd } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { authService } from '../../services/authService';
import Swal from 'sweetalert2';

const Registro = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const next = search.get('next');

  const togglePassword = () => setShowPassword((v) => !v);

  const showRegisteredToast = () => {
    return Swal.fire({
      title: 'Registro confirmado',
      icon: 'success',
      timer: 1700,
      timerProgressBar: true,
      showConfirmButton: false,
      backdrop: true,
      background: '#111',
      color: '#fff',
      didOpen: () => {
        Swal.showLoading();
      },
      showClass: { popup: 'swal2-show' },
      hideClass: { popup: 'swal2-hide' },
    });
  };

  const handleGoogle = () => {
    Swal.fire({
        title: 'Función en mantenimiento',
        text: 'Por favor, resgistre sus datos.',
        icon: 'info',
        timer: 2200,
        timerProgressBar: true,
        showConfirmButton: false,
        backdrop: true,
        background: '#111',
        color: '#fff',
        showClass: { popup: 'swal2-show' },
        hideClass: { popup: 'swal2-hide' },
    });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const nameT = name.trim();
    const emailT = email.trim();
    if (!nameT || !emailT || !password) {
      setError('Completa todos los campos.');
      return;
    }
    const emailOk = /.+@.+\..+/.test(emailT);
    if (!emailOk) {
      setError('Ingresa un email válido.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      // Registrar el usuario
      await authService.register({ email: emailT, password, name: nameT });
      // Hacer login automáticamente
      await authService.login({ email: emailT, password });
      // Redirigir al Dashboard
      showRegisteredToast().then(() => {
        navigate(`/dashboard` , { replace: true });
      });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Error al registrarte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-Page">
      <Header />
      <div className="registro-container">
        <div className="floating-elements">
          <div className="floating-element element-1">💪</div>
          <div className="floating-element element-2">🏃‍♂️</div>
          <div className="floating-element element-3">🥗</div>
          <div className="floating-element element-4">⚖️</div>
        </div>
        <div className="registro-card glass">
          <h1 className="registro-title">Bienvenido</h1>

          <form className="registro-form" onSubmit={handleSubmit}>
            {error && (
              <div className="form-error" role="alert" style={{ color: '#ff6b6b', marginBottom: 12 }}>
                {error}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="name">
                <MdPerson style={{ verticalAlign: 'middle', marginRight: 6 }} /> Nombre de usuario
              </label>
              <input
                type="text"
                id="name"
                className="form-input"
                placeholder="Ingresa tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <MdEmail style={{ verticalAlign: 'middle', marginRight: 6 }} /> Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group password-group">
              <label htmlFor="password">
                <MdLock style={{ verticalAlign: 'middle', marginRight: 6 }} /> Contraseña
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePassword}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group password-group">
              <label htmlFor="confirm">
                <MdLock style={{ verticalAlign: 'middle', marginRight: 6 }} /> Volver a escribir la contraseña
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirm"
                  className="form-input"
                  placeholder="Vuelve a ingresar tu contraseña"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePassword}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
            </div>

            <div className="registro-actions">
              <button type="submit" className="btn btn-primary btn-glow btn-large registro-button" disabled={loading}>
                <MdPersonAdd size={20} />
                {loading ? ' Registrando...' : ' Registrarse'}
              </button>
            </div>

            <div className="social-registro">
              <button type="button" className="btn btn-outline btn-large google-button" onClick={handleGoogle}>
                <FcGoogle size={22} /> Continuar con Google
              </button>
            </div>

            <div className="register-link">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </div>
          </form>
        </div>

        <div className="welcome-message">
          <h2>Fit <span className="fit">Life</span></h2>
          <h3>Registro</h3>
          <p>Para obtener más beneficios registrate aquí</p>
          <h1>← Ingresa tus datos</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Registro;