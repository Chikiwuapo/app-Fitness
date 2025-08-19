import { useEffect, useMemo, useState } from 'react'
import styles from '../styles/WeightStep.module.css'

// Componente de peso con input + slider (kg)
// Props: value (kg), onChange(kg), onNext()
export default function WeightStep({ value = '', onChange, onNext }) {
  const [localVal, setLocalVal] = useState(value)
  const min = 30
  const max = 200

  useEffect(() => {
    setLocalVal(value)
  }, [value])

  const isValid = useMemo(() => {
    const num = Number(localVal)
    return Number.isFinite(num) && num >= min && num <= max
  }, [localVal])

  const sliderValue = useMemo(() => {
    const num = Number(localVal)
    if (!Number.isFinite(num)) return min
    return Math.min(Math.max(Math.round(num), min), max)
  }, [localVal])

  const sliderPercent = useMemo(() => {
    return ((sliderValue - min) / (max - min)) * 100
  }, [sliderValue])

  const handleNext = () => {
    if (!isValid) return
    onChange?.(Number(localVal))
    onNext?.()
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Tu peso</h2>
      <div className={styles.row}>
        <div className={styles.inputBox}>
          <label htmlFor="weight-input" className={styles.label}>Peso (kg)</label>
          <input
            id="weight-input"
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            className={styles.input}
            placeholder="Ej. 70"
            value={localVal}
            onChange={(e) => setLocalVal(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.sliderWrap}>
        <input
          type="range"
          min={min}
          max={max}
          value={sliderValue}
          className={styles.slider}
          onChange={(e) => setLocalVal(e.target.value)}
          style={{ ['--sx']: `${sliderPercent}%` }}
        />
        <div className={styles.scale}>
          <span>{min} kg</span>
          <span>{max} kg</span>
        </div>
      </div>

      <p className={styles.hint}>Rango permitido: {min}–{max} kg</p>

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={handleNext} disabled={!isValid}>
          Siguiente
        </button>
      </div>
    </div>
  )
}
