import { useMemo, useRef, useState, useEffect } from 'react'
import styles from '../styles/AgeStep.module.css'

// Dropdown personalizado para seleccionar año de nacimiento (1990-2023)
export default function AgeStep({ value, onChange, label = 'Año de nacimiento' }) {
  const years = useMemo(() => {
    const arr = []
    for (let y = 2023; y >= 1990; y--) arr.push(y)
    return arr
  }, [])

  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (!open) return
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        listRef.current && !listRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <button
        ref={btnRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{value || 'Selecciona un año'}</span>
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden className={styles.chev}>
          <path d="M5 7l5 6 5-6" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          className={styles.list}
          role="listbox"
          tabIndex={-1}
        >
          {years.map((y) => (
            <li
              key={y}
              role="option"
              aria-selected={value === y}
              className={value === y ? `${styles.option} ${styles.selected}` : styles.option}
              onClick={() => {
                onChange?.(y)
                setOpen(false)
              }}
            >
              {y}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
