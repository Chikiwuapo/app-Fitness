import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSectionLink = (selector, e) => {
    if (e) e.preventDefault()
    try {
      const el = document.querySelector(selector)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } catch {}
    setIsMenuOpen(false)
  }

  const handleNavClick = (e, selector) => {
    if (location.pathname === '/') {
      handleSectionLink(selector, e)
    } else {
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="nav-brand">
            <Link to="/" className="logo">FitLife</Link>
          </div>

          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/#home" className="nav-link" onClick={(e) => handleNavClick(e, '#home')}>
              Inicio
            </Link>
            <Link to="/#what-we-offer" className="nav-link" onClick={(e) => handleNavClick(e, '#what-we-offer')}>
              Servicios
            </Link>
            <Link to="/#faq" className="nav-link" onClick={(e) => handleNavClick(e, '#faq')}>
              FAQ
            </Link>
            <Link to="/#contact" className="nav-link" onClick={(e) => handleNavClick(e, '#contact')}>
              Contacto
            </Link>
            <div className="nav-buttons">
              <Link to="/login" className="btn btn-outline">Iniciar Sesión</Link>
              <Link to="/registro" className="btn btn-primary">Registrarse</Link>
            </div>
          </div>

          <div className="nav-toggle" onClick={toggleMenu}>
            <span className="hamburger"></span>
            <span className="hamburger"></span>
            <span className="hamburger"></span>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
