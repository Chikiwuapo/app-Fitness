import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  const location = useLocation();

  const handleSectionLink = (selector, e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      try {
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {}
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">FitLife</h3>
            <p className="footer-description">
              Transforma tu vida con la plataforma de fitness más completa.
              Alcanza tus objetivos con entrenamientos personalizados y una
              comunidad motivadora.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                📱
              </a>
              <a href="#" className="social-link">
                📘
              </a>
              <a href="#" className="social-link">
                📷
              </a>
              <a href="#" className="social-link">
                🐦
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Producto</h4>
            <ul className="footer-links">
              <li>
                <Link
                  to="/#quick-bmi"
                  onClick={(e) => handleSectionLink("#quick-bmi", e)}
                >
                  Calculadora rápida
                </Link>
              </li>
              <li>
                <Link to="/registro">Descargar App</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Compañía</h4>
            <ul className="footer-links">
              <li>
                <Link
                  to="/#what-we-offer"
                  onClick={(e) => handleSectionLink("#what-we-offer", e)}
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/#faq" onClick={(e) => handleSectionLink("#faq", e)}>
                  Conoce más
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Soporte</h4>
            <ul className="footer-links">
              <li>
                <Link
                  to="/#comunidad"
                  onClick={(e) => handleSectionLink("#comunidad", e)}
                >
                  Comunidad
                </Link>
              </li>
              <li>
                <Link
                  to="/#contact"
                  onClick={(e) => handleSectionLink("#contact", e)}
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 FitLife. Todos los derechos reservados.</p>
            <div className="footer-bottom-links">
              <Link to="/login">Iniciar Sesión</Link>
              <Link to="/registro">Registrarse</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
