import { useEffect, useMemo, useState } from 'react'
import styles from '../styles/HeightStep.module.css'

// Componente de altura con selector de unidades y validación
// Props: value (numero), unit ('cm'|'ft'), onChange(val, unit), onNext()
export default function HeightStep({ value = '', unit = 'cm', onChange, onNext }) {
  const [localUnit, setLocalUnit] = useState(unit)
  const [localVal, setLocalVal] = useState(value)
  const minCm = 100
  const maxCm = 250

  useEffect(() => {
    setLocalUnit(unit)
  }, [unit])

  useEffect(() => {
    setLocalVal(value)
  }, [value])

  const placeholder = useMemo(() => (localUnit === 'cm' ? 'Ej. 170' : 'Ej. 5.7'), [localUnit])

  const toCm = (val, u) => {
    const num = Number(val)
    if (!Number.isFinite(num) || num <= 0) return NaN
    return u === 'cm' ? num : num * 30.48 // 1 ft = 30.48 cm
  }

  const isValid = useMemo(() => {
    const cm = toCm(localVal, localUnit)
    return Number.isFinite(cm) && cm >= minCm && cm <= maxCm
  }, [localVal, localUnit])

  const sliderValueCm = useMemo(() => {
    const cm = toCm(localVal, localUnit)
    if (!Number.isFinite(cm)) return minCm
    return Math.min(Math.max(Math.round(cm), minCm), maxCm)
  }, [localVal, localUnit])

  const sliderPercent = useMemo(() => {
    return ((sliderValueCm - minCm) / (maxCm - minCm)) * 100
  }, [sliderValueCm])

  const handleNext = () => {
    if (!isValid) return
    const cm = toCm(localVal, localUnit)
    onChange?.(cm, localUnit)
    onNext?.()
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Tu altura</h2>
      <div className={styles.row}>
        <div className={styles.inputBox}>
          <label htmlFor="height" className={styles.label}>Altura</label>
          <input
            id="height"
            type="number"
            step="any"
            min={localUnit === 'cm' ? minCm : (minCm / 30.48).toFixed(2)}
            max={localUnit === 'cm' ? maxCm : (maxCm / 30.48).toFixed(2)}
            inputMode="decimal"
            className={styles.input}
            placeholder={placeholder}
            value={localVal}
            onChange={(e) => setLocalVal(e.target.value)}
          />
        </div>
        <div className={styles.unitBox}>
          <span className={styles.unitLabel}>Unidad</span>
          <div className={styles.unitSwitch}>
            <button
              type="button"
              className={localUnit === 'cm' ? `${styles.unitBtn} ${styles.active}` : styles.unitBtn}
              onClick={() => setLocalUnit('cm')}
            >
              cm
            </button>
            <button
              type="button"
              className={localUnit === 'ft' ? `${styles.unitBtn} ${styles.active}` : styles.unitBtn}
              onClick={() => setLocalUnit('ft')}
            >
              ft
            </button>
          </div>
        </div>
      </div>

      <div className={styles.sliderWrap}>
        <input
          type="range"
          min={minCm}
          max={maxCm}
          value={sliderValueCm}
          onChange={(e) => {
            const cm = Number(e.target.value)
            if (localUnit === 'cm') {
              setLocalVal(String(cm))
            } else {
              const ft = cm / 30.48
              setLocalVal(String(Math.round(ft * 10) / 10))
            }
          }}
          className={styles.slider}
          style={{ ['--sx'] : `${sliderPercent}%` }}
        />
        <div className={styles.sliderMeta}>
          <span>{minCm} cm</span>
          <span>{maxCm} cm</span>
        </div>
        <p className={styles.hint}>Rango permitido: {minCm}–{maxCm} cm</p>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={handleNext} disabled={!isValid}>
          Siguiente
        </button>
      </div>
    </div>
  )
}
