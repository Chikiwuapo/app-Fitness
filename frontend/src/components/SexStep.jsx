import styles from '../styles/SexStep.module.css'

// Paso para seleccionar sexo: 'male' | 'female' | 'prefer_not'
// Props: value, onChange(value), onNext()
export default function SexStep({ value = '', onChange, onNext }) {
  const select = (val) => {
    onChange?.(val)
    onNext?.()
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>¿Cuál es tu sexo?</h2>
      <p className={styles.helper}>Elige tu sexo biológico para recomendaciones relacionadas con tu fisiología.</p>

      <div className={styles.cards}>
        <button
          type="button"
          className={value === 'female' ? `${styles.card} ${styles.active}` : styles.card}
          onClick={() => select('female')}
        >
          <span className={styles.icon} aria-hidden>♀</span>
          <span className={styles.cardLabel}>Mujer</span>
        </button>
        <button
          type="button"
          className={value === 'male' ? `${styles.card} ${styles.active}` : styles.card}
          onClick={() => select('male')}
        >
          <span className={styles.icon} aria-hidden>♂</span>
          <span className={styles.cardLabel}>Hombre</span>
        </button>
      </div>

      <button type="button" className={styles.skip} onClick={() => select('prefer_not')}>
        Preferiría no decirlo
      </button>
    </div>
  )
}
