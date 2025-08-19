import React, { useState } from 'react'
import '../styles/ContactForm.css'
import trainerImage from '../assets/trainer.png'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica para enviar el formulario
    console.log('Formulario enviado:', formData)
    alert('¡Mensaje enviado! Te contactaremos pronto.')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">
          <span className="title-accent">Contáctanos</span>
        </h2>
        <p className="section-subtitle">
          ¿Tienes alguna pregunta o quieres más información? ¡Escríbenos!
        </p>
        
        <div className="contact-content">
          <div className="contact-form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Cuéntanos qué necesitas..."
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary btn-submit">
                <span className="btn-text">Enviar Mensaje</span>
                <span className="btn-icon">📧</span>
              </button>
            </form>
          </div>
          
          <div className="trainer-contact">
            <div className="trainer-card">
              <div className="trainer-image">
                <img src={trainerImage} alt="Personal Trainer" />
              </div>
              <div className="trainer-info">
                <h3>¿Necesitas un Personal Trainer?</h3>
                <p>Conecta directamente con nuestros expertos certificados para un entrenamiento personalizado.</p>
                <button className="btn btn-secondary btn-trainer">
                  <span className="btn-text">Contactar Trainer</span>
                  <span className="btn-icon">💪</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
