  const handleQuickBmi = async () => {
    const height_cm = Number(quickHeight)
    const weight_kg = Number(quickWeight)
    if (!Number.isFinite(height_cm) || height_cm < 50 || height_cm > 300) {
      await Swal.fire({ icon: 'warning', title: 'Altura inválida', text: 'Ingresa una altura entre 50 y 300 cm.' })
      return
    }
    if (!Number.isFinite(weight_kg) || weight_kg <= 0) {
      await Swal.fire({ icon: 'warning', title: 'Peso inválido', text: 'Ingresa un peso válido en kg.' })
      return
    }
    try {
      const { bmi, category } = await healthService.bmiCalculatePublic({ height_cm, weight_kg })
      await Swal.fire({
        icon: 'info',
        title: 'Resultado IMC',
        html: `<div style="font-size:18px">IMC: <b>${bmi}</b><br/>Categoría: <b>${category}</b></div>`,
        confirmButtonText: 'Aceptar'
      })
    } catch (err) {
      console.error(err)
      await Swal.fire({ icon: 'error', title: 'No se pudo calcular', text: 'Intenta nuevamente más tarde.' })
    }
  }
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { healthService } from '../services/healthService'
import WomanImg from '../assets/Mujer.png'
import Header from '../components/Header'
import WhatWeOffer from '../components/WhatWeOffer'
import FAQ from '../components/FAQ'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import '../styles/Home.css'

const Home = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [quickHeight, setQuickHeight] = useState('')
  const [quickWeight, setQuickWeight] = useState('')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="home">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="title-line">Descubre tu</span>
                <span className="title-highlight">Salud Ideal</span>
                <span className="title-line">con IMC</span>
              </h1>
              <p className="hero-subtitle">
                Calcula tu Índice de Masa Corporal de forma rápida y precisa. 
                Conoce tu estado de salud y recibe recomendaciones personalizadas.
              </p>
              <div className="hero-buttons">
                <a href="#quick-bmi" className="btn btn-primary btn-glow">
                  <span className="btn-text">Calcular IMC</span>
                  <span className="btn-icon">⚡</span>
                </a>
                <a href="#what-we-offer" className="btn btn-outline">
                  Aprender Más
                </a>
              </div>
            </div>
            <div className="hero-visual">
              {/* Background woman image synced with circle animations */}
              <img src={WomanImg} alt="Mujer" className="hero-woman" />
            </div>
          </div>
        </div>
        <div className="floating-elements">
          <div className="floating-element element-1">💪</div>
          <div className="floating-element element-2">🏃‍♂️</div>
          <div className="floating-element element-3">🥗</div>
          <div className="floating-element element-4">⚖️</div>
        </div>
      </section>

      {/* What We Offer Section */}
      <WhatWeOffer />

      {/* Quick BMI Calculator (UI only) */}
      <section id="quick-bmi" className="quick-bmi-section">
        <div className="container">
          <div className="quick-bmi-header">
            <h2 className="section-title">
              <span>Calculadora rápida de</span>
              <div className="bmi-circle bmi-circle--small" aria-hidden="true">
                <div className="circle-inner circle-inner--small">
                  <span className="bmi-text">IMC</span>
                  <div className="pulse-ring pulse-ring--small"></div>
                </div>
              </div>
            </h2>
          </div>

          <div className="quick-bmi-card">
            <div className="quick-bmi-grid">
              <div className="input-group">
                <label className="input-label" htmlFor="quick-height">Altura (cm)</label>
                <input
                  id="quick-height"
                  type="number"
                  placeholder="Ej. 170"
                  className="input-control"
                  value={quickHeight}
                  onChange={(e) => setQuickHeight(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="quick-weight">Peso (kg)</label>
                <input
                  id="quick-weight"
                  type="number"
                  placeholder="Ej. 68"
                  className="input-control"
                  value={quickWeight}
                  onChange={(e) => setQuickWeight(e.target.value)}
                />
              </div>
            </div>

            <button type="button" className="btn btn-primary btn-glow quick-bmi-btn" onClick={handleQuickBmi}>
              Calcular IMC
            </button>
          </div>

          <div className="quick-bmi-note">
            <span className="note-text">¿Quieres un cálculo más específico y recomendaciones?</span>
            <Link to="/registro" className="btn btn-primary btn-glow quick-bmi-cta">Realiza la encuesta</Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Section */}
      <ContactForm />

      <Footer />
    </div>
  )
}

export default Home
