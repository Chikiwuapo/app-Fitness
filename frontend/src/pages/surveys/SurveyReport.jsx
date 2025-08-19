import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../../styles/SurveyReport.module.css'
import '../../styles/SurveyLayout.css'
import { FaChartPie } from 'react-icons/fa'

function bmiCategory(bmi) {
  if (bmi < 18.5) return { key: 'under', label: 'Bajo peso', healthy: false, color: '#60a5fa' }
  if (bmi < 25) return { key: 'normal', label: 'Peso saludable', healthy: true, color: '#10b981' }
  if (bmi < 30) return { key: 'over', label: 'Sobrepeso', healthy: false, color: '#f59e0b' }
  return { key: 'obese', label: 'Obesidad', healthy: false, color: '#ef4444' }
}

export default function SurveyReport() {
  const location = useLocation()
  const navigate = useNavigate()

  const data = useMemo(() => {
    // Preferir state, fallback a localStorage
    const fromState = location.state
    if (fromState) return fromState
    try {
      const raw = localStorage.getItem('surveyData')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [location.state])

  useEffect(() => {
    if (!data || !data.height || !data.weight || !data.age) {
      navigate('/surveys/start', { replace: true })
    }
  }, [data, navigate])

  if (!data) return null

  const heightCm = Number(data.height)
  const weightKg = Number(data.weight)
  const meters = heightCm / 100
  const bmi = weightKg && meters ? +(weightKg / (meters * meters)).toFixed(1) : null
  const cat = bmi ? bmiCategory(bmi) : null

  const age = (() => {
    const y = Number(data.age)
    if (!Number.isFinite(y)) return '—'
    const currentYear = new Date().getFullYear()
    return Math.max(currentYear - y, 0)
  })()

  // Para el indicador, normalizar BMI entre 15 y 40
  const minB = 15, maxB = 40
  const clamp = (v, a, b) => Math.max(a, Math.min(v, b))
  const percent = bmi ? ((clamp(bmi, minB, maxB) - minB) / (maxB - minB)) * 100 : 0

  return (
    <div className="surveyPage">
      <div className="glow" />
      <section className={styles.page}>
        <h1 className={styles.pageTitle}>
          <FaChartPie style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Tu informe de salud
        </h1>

        <div className={styles.card}>
          <div className={styles.cardHeader}>Resumen personalizado</div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.muted}>Género</span>
              <span className={styles.value}>{data.sex === 'male' ? 'Hombre' : data.sex === 'female' ? 'Mujer' : 'Prefiere no decirlo'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.muted}>Edad</span>
              <span className={styles.value}>{age}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.muted}>Altura</span>
              <span className={styles.value}>{heightCm} cm</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.muted}>Peso</span>
              <span className={styles.value}>{weightKg.toFixed(1)} kg</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.muted}>Tipo de cuerpo</span>
              <span className={styles.value}>
                {data.bodyType === 'ecto' ? 'Ectomorfo' : data.bodyType === 'meso' ? 'Mesomorfo' : data.bodyType === 'endo' ? 'Endomorfo' : '—'}
              </span>
            </div>
          </div>

          <div className={styles.bmiCard}>
            <div className={styles.bmiTitle}>Tu IMC</div>
            <div className={styles.bmiValue}>{bmi ?? '—'}</div>
            {cat && (
              <div className={styles.bmiStatus} style={{ color: cat.color }}>
                <span className={styles.dot} style={{ backgroundColor: cat.color }} />
                {cat.label}
              </div>
            )}

            <div className={styles.scale}>
              <div className={styles.segment} style={{ background: '#60a5fa' }} title="15 - 18.4" />
              <div className={styles.segment} style={{ background: '#10b981' }} title="18.5 - 24.9" />
              <div className={styles.segment} style={{ background: '#f59e0b' }} title="25 - 29.9" />
              <div className={styles.segment} style={{ background: '#ef4444' }} title=">= 30" />
              <div className={styles.pointer} style={{ left: `${percent}%` }} />
            </div>

            <div className={styles.scaleLabels}>
              <span>15</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.primary} onClick={() => navigate('/')}>Entendido</button>
        </div>
      </section>
    </div>
  )
}
