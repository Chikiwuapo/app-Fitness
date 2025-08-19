import React from 'react'
import '../styles/Features.css'

const Features = () => {
  const features = [
    {
      icon: '📱',
      title: 'App Móvil',
      description: 'Accede a tus entrenamientos desde cualquier lugar con nuestra app móvil optimizada.'
    },
    {
      icon: '🎯',
      title: 'Entrenamientos Personalizados',
      description: 'Rutinas adaptadas a tu nivel, objetivos y disponibilidad de tiempo.'
    },
    {
      icon: '📊',
      title: 'Seguimiento de Progreso',
      description: 'Monitorea tu evolución con métricas detalladas y gráficos interactivos.'
    },
    {
      icon: '👥',
      title: 'Comunidad Activa',
      description: 'Conecta con otros usuarios, comparte logros y participa en desafíos.'
    },
    {
      icon: '🍎',
      title: 'Planificación Nutricional',
      description: 'Recibe recomendaciones nutricionales personalizadas para complementar tu entrenamiento.'
    },
    {
      icon: '🏆',
      title: 'Sistema de Logros',
      description: 'Gana badges y recompensas por alcanzar tus metas de fitness.'
    }
  ]

  return (
    <section id="features" className="section features">
      <div className="container">
        <h2 className="section-title">Características Principales</h2>
        <p className="section-subtitle">
          Descubre todo lo que FitLife tiene para ofrecerte en tu camino hacia una vida más saludable
        </p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
