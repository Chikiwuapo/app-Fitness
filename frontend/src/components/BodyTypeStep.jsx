import styles from '../styles/BodyTypeStep.module.css'
import ImgEcto from '../assets/Ectomorfo.png'
import ImgMeso from '../assets/Mesomorfo.png'
import ImgEndo from '../assets/Endomorfo.png'

// Body type step with video and hover info cards
// Props: value ('ecto'|'meso'|'endo'|''), onChange(v), onNext(), videoUrl
export default function BodyTypeStep({ value = '', onChange, onNext, videoUrl }) {
  const select = (v) => {
    onChange?.(v)
    onNext?.()
  }

  const types = [
    {
      key: 'ecto',
      title: 'Ectomorfo',
      imgAlt: 'Ectomorfo',
      imgSrc: ImgEcto,
      desc:
        'El ectomorfo tiene complexión delgada, huesos finos y extremidades largas. Metabolismo rápido, le cuesta ganar masa muscular. Requiere dieta alta en calorías y fuerza para desarrollar músculo.',
    },
    {
      key: 'meso',
      title: 'Mesomorfo',
      imgAlt: 'Mesomorfo',
      imgSrc: ImgMeso,
      desc:
        'El mesomorfo tiene complexión atlética y buena proporción muscular. Gana músculo y fuerza con facilidad y responde bien al entrenamiento. Con dieta equilibrada puede mantenerse en forma.',
    },
    {
      key: 'endo',
      title: 'Endomorfo',
      imgAlt: 'Endomorfo',
      imgSrc: ImgEndo,
      desc:
        'El endomorfo presenta tendencia a acumular grasa y metabolismo más lento. Gana peso con facilidad, por ello requiere controlar la dieta y combinar cardio con fuerza para mantenerse en forma.',
    },
  ]

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>¿Qué tipo de cuerpo tienes?</h2>

      <div className={styles.videoBox}>
        {videoUrl ? (
          <iframe
            className={styles.video}
            src={videoUrl}
            title="Tipo de cuerpo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className={styles.videoPlaceholder}>VIDEO</div>
        )}
      </div>

      <h3 className={styles.subtitle}>Tipos de cuerpo</h3>
      <div className={styles.grid}>
        {types.map((t) => (
          <button
            key={t.key}
            type="button"
            className={value === t.key ? `${styles.card} ${styles.active}` : styles.card}
            onClick={() => select(t.key)}
          >
            <div className={styles.figure}>
              <img className={styles.figureImg} src={t.imgSrc} alt={t.imgAlt} />
            </div>
            <div className={styles.hoverInfo}>
              <p>{t.desc}</p>
            </div>
            <span className={styles.cardLabel}>{t.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
