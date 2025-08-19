import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/WhatWeOffer.css'

const WhatWeOffer = () => {
  const offerings = [
    {
      icon: '⚖️',
      title: 'IMC (BMI)',
      description: 'Te ofrecemos un cálculo exacto de IMC (Índice de masa corporal) para conocer tu estado de salud actual.',
      features: ['Cálculo preciso', 'Interpretación de resultados', 'Recomendaciones personalizadas']
    },
    {
      icon: '🏃‍♂️',
      title: 'Rutinas',
      description: 'Te ofrecemos una rutina personalizada de acuerdo a tu IMC calculado y objetivos de fitness.',
      features: ['Entrenamientos adaptados', 'Diferentes niveles', 'Progresión gradual']
    },
    {
      icon: '🥗',
      title: 'Rutina de Dieta',
      description: 'Recibe un plan nutricional personalizado basado en tu IMC, objetivos y preferencias alimentarias.',
      features: ['Plan nutricional adaptado', 'Recetas saludables', 'Seguimiento de calorías']
    },
    {
      icon: '📊',
      title: 'Seguimientos',
      description: 'Te ofreceremos una sección para agregar rutinas y verificar tu avance en tiempo real.',
      features: ['Monitoreo continuo', 'Métricas detalladas', 'Historial de progreso']
    }
  ]

  return (
    <section id="what-we-offer" className="what-we-offer-section">
      <div className="container">
        <h2 className="section-title">
          ¿Qué te <span className="title-accent">ofrecemos</span>?
        </h2>
        <p className="section-subtitle">
          Al ingresar tus datos como usuario te ofrecemos:
        </p>
        
        <div className="offerings-grid">
          {offerings.map((offering, index) => (
            <div key={index} className="offering-card" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="offering-icon">{offering.icon}</div>
              <h3 className="offering-title">{offering.title}</h3>
              <p className="offering-description">{offering.description}</p>
              
              <ul className="offering-features">
                {offering.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="feature-item">
                    <span className="feature-check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="offering-cta">
                <Link to="/registro" className="btn btn-outline">
                  Comenzar Ahora
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="impact-section" id="comunidad">
          <div className="impact-content">
            <div className="impact-text">
              <p className="impact-label">Más de</p>
              <h3 className="impact-number">50 mil</h3>
              <p className="impact-description">
                Personas han mejorado su vida después de este cálculo
              </p>
            </div>
            
            <div className="impact-cta">
              <h4 className="cta-text">No esperes más</h4>
              <p className="cta-subtext">realiza el cálculo que mejore tu salud</p>
              <a href="#quick-bmi" className="btn btn-primary btn-large">
                Calcular IMC
              </a>
            </div>
          </div>
          
          <div className="impact-illustration">
            <div className="exercise-figures">
              <div className="figure figure-1">
                <div className="figure-icon">👵</div>
                <div className="figure-dumbbells">💪</div>
              </div>
              <div className="figure figure-2">
                <div className="figure-icon">👴</div>
                <div className="figure-dumbbells">💪</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhatWeOffer 