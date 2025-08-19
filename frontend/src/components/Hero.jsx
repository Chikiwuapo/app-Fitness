import React from 'react'
import '../styles/Hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Transforma tu vida con
              <span className="highlight"> FitLife</span>
            </h1>
            <p className="hero-subtitle">
              La plataforma de fitness más completa para alcanzar tus objetivos. 
              Entrenamientos personalizados, seguimiento de progreso y una comunidad 
              que te motiva a ser tu mejor versión.
            </p>
            <div className="hero-buttons">
              <a href="/register" className="btn btn-primary btn-large">
                Comenzar Gratis
              </a>
              <a href="#features" className="btn btn-outline btn-large">
                Ver Características
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Usuarios Activos</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Entrenamientos</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Satisfacción</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-placeholder">
              <div className="fitness-icon">💪</div>
              <p>Imagen de Fitness</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 