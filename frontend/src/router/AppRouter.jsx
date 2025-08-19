import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import AboutUs from '../pages/AboutUs.jsx'
import Login from '../pages/Login.jsx'
import CalculateBMI from '../pages/CalculateBMI.jsx'
import Register from '../pages/Register.jsx'
import SurveyStart from '../pages/surveys/SurveyStart.jsx'
import SurveyReport from '../pages/surveys/SurveyReport.jsx'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/calculate-bmi" element={<CalculateBMI />} />
      <Route path="/register" element={<Register />} />
      <Route path="/surveys/start" element={<SurveyStart />} />
      <Route path="/surveys/report" element={<SurveyReport />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
