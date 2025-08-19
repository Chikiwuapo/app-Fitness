import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/LoginForm.css';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdLogin } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { authService } from '../services/authService';
import Swal from 'sweetalert2';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const next = search.get('next');

    const togglePassword = () => setShowPassword((v) => !v);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (!email || !password) {
                setError('Completa email y contraseña.');
            } else {
                await authService.login({ email, password });
                showRedirectToast().then(() => {
                    navigate('/dashboard', { replace: true });
                });
            }
        } catch (err) {
            setError(err?.response?.data?.detail || 'Error al iniciar sesión. Verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    const showRedirectToast = () => {
        return Swal.fire({
            title: 'Redirigiendo a la encuesta...',
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
            text: 'Por favor, ingrese con sus credenciales.',
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

    return (
        <div className="login-page">
            <Header />
            <div className="login-container">
            <div className="floating-elements">
                <div className="floating-element element-1">💪</div>
                <div className="floating-element element-2">🏃‍♂️</div>
                <div className="floating-element element-3">🥗</div>
                <div className="floating-element element-4">⚖️</div>
            </div>
            <div className="login-card glass">
                <h1 className="login-title">Ingresa sesión</h1>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="form-error" role="alert" style={{ color: '#ff6b6b', marginBottom: 12 }}>
                            {error}
                        </div>
                    )}
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

                    <div className="remember-me">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Recordar contraseña</label>
                    </div>

                    <div className="forgot-password">
                        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                    </div>

                    <div className="login-actions">
                        <button type="submit" className="btn btn-primary btn-glow btn-large login-button" disabled={loading}>
                            <MdLogin size={20} />
                            {loading ? 'Ingresando...' : ' Ingresar'}
                        </button>

                        
                    </div>

                    <div className="social-login">
                        <button type="button" className="btn btn-outline btn-large google-button" onClick={handleGoogle}>
                            <FcGoogle size={22} /> Continuar con Google
                        </button>
                    </div>

                    <div className="register-link">
                        {(() => {
                            const suffix = next ? `?next=${encodeURIComponent(next)}` : '';
                            return (
                                <span>
                                    ¿No tienes una cuenta? <Link to={`/registro${suffix}`}>Regístrate aquí</Link>
                                </span>
                            );
                        })()}
                    </div>
                </form>
            </div>

            <div className="welcome-message">
                <h2>Fit <span className="fit">Life</span></h2>
                <h3>Login</h3>
                <p>Accede para obtener más beneficios</p>
                <h1>← Ingresa tus datos</h1>
            </div>
            </div>
            <Footer />
        </div>
    );
};

export default LoginForm;
