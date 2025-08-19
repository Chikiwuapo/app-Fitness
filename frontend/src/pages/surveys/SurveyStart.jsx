import { useNavigate } from 'react-router-dom'
import { FaHeartbeat, FaDumbbell, FaChartLine, FaClock } from 'react-icons/fa'
import SurveyForm from '../../components/SurveyForm.jsx'
import { authService } from '../../services/authService'
import Swal from 'sweetalert2'
import '../../styles/SurveyLayout.css'

export default function SurveyStart() {
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    // Mapear datos del formulario al payload del backend
    const currentYear = new Date().getFullYear()
    const ageYear = Number.isFinite(Number(data.age)) ? Math.max(currentYear - Number(data.age), 0) : null
    const payload = {
      age_year: ageYear || null,
      height_cm: Number(data.height) || null,
      weight_kg: Number(data.weight) || null,
      sex: data.sex === 'prefer_not' ? 'other' : data.sex || null,
      body_type: data.bodyType || '',
      goal: data.goal || '',
      activity: data.activity || '',
      data: {},
    }

    try {
      const res = await authService.createSurvey(payload)
      // Guardar último perfil/survey para inicializar dashboard rápido
      try { localStorage.setItem('lastProfile', JSON.stringify(res?.profile || {})) } catch {}
      await Swal.fire({
        icon: 'success',
        title: 'Formulario enviado',
        text: 'Tus datos fueron guardados en tu perfil.',
        timer: 1400,
        showConfirmButton: false
      })
      navigate('/dashboard', { replace: true, state: { profile: res?.profile, survey: res?.survey } })
    } catch (error) {
      console.error('Error al enviar formulario', error)
      const msg = error?.response?.data?.detail || 'Revisa los datos e intenta nuevamente.'
      await Swal.fire({ icon: 'error', title: 'No se pudo guardar', text: msg })
    }
  }

  return (
    <div className="surveyPage">
      <div className="glow" />
      <div className="glow left" />
      <div className="surveyContainer">
        <header className="surveyHero" aria-live="polite">
          <h1 className="surveyTitle">
            Comencemos tu viaje fitness
          </h1>
          <p className="surveySubtitle">
            Responde unas breves preguntas para crear un plan a tu medida: objetivos, hábitos y tu estado actual.
          </p>
          <div className="surveyKpis">
            <span className="badge" title="Recomendaciones de salud">
              <FaHeartbeat /> Mejoras personalizadas
            </span>
            <span className="badge" title="Rutinas y ejercicios">
              <FaDumbbell /> Rutinas sugeridas
            </span>
            <span className="badge" title="Seguimiento de progreso">
              <FaChartLine /> Progreso visible
            </span>
            <span className="badge" title="Solo te tomará 2 minutos">
              <FaClock /> 2 min aprox.
            </span>
          </div>
        </header>

        <SurveyForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
