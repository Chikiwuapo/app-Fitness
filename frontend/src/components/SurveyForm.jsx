import { useState, useMemo } from 'react'
import styles from '../styles/SurveyForm.module.css'
import AgeStep from './AgeStep.jsx'
import HeightStep from './HeightStep.jsx'
import WeightStep from './WeightStep.jsx'
import SexStep from './SexStep.jsx'
import BodyTypeStep from './BodyTypeStep.jsx'

// Campos de ejemplo: edad, altura (cm), peso (kg), objetivo y nivel actividad
export default function SurveyForm({ onSubmit }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    age: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    sex: '', // 'male' | 'female' | 'prefer_not'
    bodyType: '', // 'ecto' | 'meso' | 'endo'
    goal: 'mantener',
    activity: 'moderado',
  })
  const totalSteps = 7

  const progress = useMemo(() => Math.round(((step + 1) / totalSteps) * 100), [step])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validateStep = () => {
    // Validación sencilla por paso
    if (step === 0) {
      const age = Number(form.age)
      return Number.isFinite(age) && age > 0
    }
    if (step === 1) {
      const height = Number(form.height) // en cm
      return Number.isFinite(height) && height >= 100
    }
    if (step === 2) {
      const weight = Number(form.weight)
      return Number.isFinite(weight) && weight >= 30 && weight <= 200
    }
    if (step === 3) {
      return ['male', 'female', 'prefer_not'].includes(form.sex)
    }
    if (step === 5) {
      return ['ecto', 'meso', 'endo'].includes(form.bodyType)
    }
    return true
  }

  const handleNext = () => {
    if (!validateStep()) return
    setStep((s) => Math.min(s + 1, totalSteps - 1))
  }
  const handlePrev = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateStep()) return
    if (onSubmit) {
      onSubmit(form)
    } else {
      try {
        localStorage.setItem('surveyData', JSON.stringify(form))
        console.info('Survey data stored in localStorage (mock).')
      } catch {}
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.progress} aria-label={`Paso ${step + 1} de ${totalSteps}`}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        <span className={styles.progressText}>{`Paso ${step + 1} de ${totalSteps}`}</span>
      </div>

      {step === 0 && (
        <section className={styles.step}>
          <h2>Tu edad</h2>
          <AgeStep
            value={form.age}
            onChange={(y) => setForm((f) => ({ ...f, age: y }))}
            label="Año de nacimiento"
          />
        </section>
      )}

      {step === 1 && (
        <section className={styles.step}>
          <HeightStep
            value={form.height}
            unit={form.heightUnit}
            onChange={(cm, unit) => setForm((f) => ({ ...f, height: cm, heightUnit: unit }))}
            onNext={() => setStep((s) => Math.min(s + 1, totalSteps - 1))}
          />
        </section>
      )}

      {step === 2 && (
        <section className={styles.step}>
          <WeightStep
            value={form.weight}
            onChange={(kg) => setForm((f) => ({ ...f, weight: kg }))}
            onNext={() => setStep((s) => Math.min(s + 1, totalSteps - 1))}
          />
        </section>
      )}

      {step === 3 && (
        <section className={styles.step}>
          <SexStep
            value={form.sex}
            onChange={(val) => setForm((f) => ({ ...f, sex: val }))}
            onNext={() => setStep((s) => Math.min(s + 1, totalSteps - 1))}
          />
        </section>
      )}

      {step === 4 && (
        <section className={styles.step}>
          <h2>Tu objetivo</h2>
          <label className={styles.label} htmlFor="goal">Objetivo</label>
          <select
            id="goal"
            value={form.goal}
            onChange={update('goal')}
            className={`${styles.select} ${styles.selectGoal}`}
          >
            <option value="bajar">Bajar de peso</option>
            <option value="mantener">Mantener</option>
            <option value="subir">Subir masa</option>
          </select>
        </section>
      )}

      {step === 5 && (
        <section className={styles.step}>
          <BodyTypeStep
            value={form.bodyType}
            onChange={(val) => setForm((f) => ({ ...f, bodyType: val }))}
            onNext={() => setStep((s) => Math.min(s + 1, totalSteps - 1))}
            videoUrl={"https://www.youtube.com/embed/dQw4w9WgXcQ"}
          />
        </section>
      )}

      {step === 6 && (
        <section className={styles.step}>
          <h2>Nivel de actividad</h2>
          <label className={styles.label} htmlFor="activity">Actividad</label>
          <select
            id="activity"
            value={form.activity}
            onChange={update('activity')}
            className={styles.select}
          >
            <option value="bajo">Bajo</option>
            <option value="moderado">Moderado</option>
            <option value="alto">Alto</option>
          </select>
          <div className={styles.summary}>
            <h3>Resumen</h3>
            <ul>
              <li>
                Edad: {(() => {
                  const y = Number(form.age)
                  if (!Number.isFinite(y)) return '—'
                  const currentYear = new Date().getFullYear()
                  return Math.max(currentYear - y, 0)
                })()} años
              </li>
              <li>Altura: {form.height} cm</li>
              <li>Peso: {form.weight} kg</li>
              <li>Sexo: {form.sex === 'male' ? 'Hombre' : form.sex === 'female' ? 'Mujer' : 'Prefiere no decirlo'}</li>
              <li>Tipo de cuerpo: {form.bodyType === 'ecto' ? 'Ectomorfo' : form.bodyType === 'meso' ? 'Mesomorfo' : form.bodyType === 'endo' ? 'Endomorfo' : '—'}</li>
              <li>Objetivo: {form.goal}</li>
              <li>Actividad: {form.activity}</li>
            </ul>
          </div>
        </section>
      )}

      <div className={styles.actions}>
        <button type="button" onClick={handlePrev} disabled={step === 0} className={styles.secondary}>
          Atrás
        </button>
        {step === 1 || step === 2 ? null : step < totalSteps - 1 ? (
          <button type="button" onClick={handleNext} className={styles.primary} disabled={!validateStep()}>
            Siguiente
          </button>
        ) : (
          <button type="submit" className={styles.primary}>
            Enviar
          </button>
        )}
      </div>
    </form>
  )
}
