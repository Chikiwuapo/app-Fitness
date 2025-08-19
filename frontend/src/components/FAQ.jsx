import React, { useState } from 'react'
import '../styles/FAQ.css'

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqs = [
    {
      id: 1,
      question: "¿Qué es el IMC y por qué es importante?",
      answer: "El Índice de Masa Corporal (IMC) es una medida que relaciona tu peso con tu altura para determinar si tienes un peso saludable. Es importante porque te ayuda a entender si tu peso está en un rango saludable, lo que es fundamental para prevenir problemas de salud y establecer metas realistas de fitness."
    },
    {
      id: 2,
      question: "¿Cómo se calcula el IMC?",
      answer: "El IMC se calcula dividiendo tu peso en kilogramos entre tu altura en metros al cuadrado (kg/m²). Por ejemplo, si pesas 70 kg y mides 1.70 m, tu IMC sería: 70 ÷ (1.70)² = 70 ÷ 2.89 = 24.2 kg/m²."
    },
    {
      id: 3,
      question: "¿Qué significan los rangos de IMC?",
      answer: "Los rangos de IMC son: Bajo peso (< 18.5), Peso normal (18.5 - 24.9), Sobrepeso (25 - 29.9), y Obesidad (≥ 30). Estos rangos te ayudan a entender tu estado de salud actual y establecer objetivos apropiados."
    },
    {
      id: 4,
      question: "¿Puedo confiar en el cálculo de IMC?",
      answer: "El IMC es una herramienta validada por la Organización Mundial de la Salud y es útil para la mayoría de las personas. Sin embargo, no considera factores como masa muscular, edad, sexo o composición corporal. Siempre consulta con un profesional de la salud para una evaluación completa."
    },
    {
      id: 5,
      question: "¿Qué rutinas me recomiendan según mi IMC?",
      answer: "Nuestras rutinas se personalizan según tu IMC, nivel de condición física y objetivos. Para personas con sobrepeso, recomendamos ejercicios de bajo impacto como caminar, nadar o yoga. Para peso normal, puedes incluir entrenamiento de fuerza y cardio moderado."
    },
    {
      id: 6,
      question: "¿Cómo puedo contactar a un personal trainer?",
      answer: "Puedes contactar directamente a nuestros personal trainers certificados a través del botón 'Contactar Trainer' en la sección de contacto. Ellos te ayudarán a crear un plan personalizado y te guiarán en tu viaje de fitness."
    }
  ]

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <h2 className="section-title">
          <span className="title-accent">Preguntas</span> Frecuentes
        </h2>
        <p className="section-subtitle">
          Resolvemos las dudas más comunes sobre fitness, IMC y nuestros servicios
        </p>
        
        <div className="faq-container">
          {faqs.map((faq) => (
            <div key={faq.id} className={`faq-item ${openFAQ === faq.id ? 'active' : ''}`}>
              <button 
                className="faq-question-btn"
                onClick={() => toggleFAQ(faq.id)}
              >
                <span className="faq-question-text">{faq.question}</span>
                <span className="faq-toggle">
                  {openFAQ === faq.id ? '−' : '+'}
                </span>
              </button>
              
              <div className={`faq-answer ${openFAQ === faq.id ? 'show' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ 