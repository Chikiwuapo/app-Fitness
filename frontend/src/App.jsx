import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/users/Dashboard'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import SurveyStart from './pages/surveys/SurveyStart'
import SurveyReport from './pages/surveys/SurveyReport'
import Registro from './pages/users/Registro'

function PrivateRoute({ children }) {
  const token = (() => {
    try { return localStorage.getItem('authToken') } catch { return null }
  })()
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* Redirecciones a la ruta canónica de registro */}
          <Route path="/register" element={<Navigate to="/registro" replace />} />
          <Route path="/signup" element={<Navigate to="/registro" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/surveys/start" element={<SurveyStart />} />
          <Route path="/surveys/report" element={<SurveyReport />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
