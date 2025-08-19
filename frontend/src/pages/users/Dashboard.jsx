import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/Dashboard.css";
import { authService } from "../../services/authService";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [survey, setSurvey] = useState(null); // datos del usuario
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    bodyType: "",
    goal: "",
  });
  const navigate = useNavigate();

  // Efecto para sincronizar datos cuando el usuario vuelve a iniciar sesión
  useEffect(() => {
    // Solo verificar si hay token, sin recargar la página
    const token = localStorage.getItem("access");
    if (token) {
      console.log("Usuario autenticado detectado");
    }
  }, []);

  // Intento de llamada a backend (SQLite vía API). Si falla, usa localStorage como mock.
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      // Verificar si el usuario está autenticado
      if (!authService.isAuthenticated()) {
        console.log("Usuario no autenticado, cargando datos locales...");
        // Cargar solo datos locales si no hay autenticación
        try {
          const { user, survey } = authService.getStoredUser();
          if (!cancelled) {
            if (user) {
              setUser(user);
              setAvatarUrl(user?.avatarUrl || "");
            }
            if (survey) {
              setFormData(survey);
              setSurvey(survey);
            }
          }
        } catch (error) {
          console.log("Error al cargar datos locales:", error);
        }
        return;
      }

      console.log("Usuario autenticado, cargando datos del backend...");

      try {
        // 1) Cargar datos del usuario real desde backend
        const me = await authService.me();
        let profile = null;
        try {
          profile = await authService.getProfile();
        } catch (error) {
          console.log("No se pudo cargar el perfil:", error);
        }

        if (!cancelled) {
          // Usar directamente el first_name del usuario si está disponible
          const name =
            me?.first_name ||
            profile?.first_name ||
            me?.email?.split("@")[0] ||
            "Usuario";

          // Cargar foto de perfil desde localStorage si existe
          let userAvatarUrl = "";
          try {
            const storedUserData = localStorage.getItem("userData");
            if (storedUserData) {
              const parsedUserData = JSON.parse(storedUserData);
              userAvatarUrl = parsedUserData.avatarUrl || "";
            }
          } catch (error) {
            console.log("Error al cargar foto de perfil:", error);
          }

          setUser({ name, email: me?.email || "", avatarUrl: userAvatarUrl });
          setAvatarUrl(userAvatarUrl);

          // Inicializar formData con datos del perfil del backend
          const profileData = {
            age: profile?.age_year || profile?.birth_year || "",
            height: profile?.height_cm || profile?.initial_weight_kg || "",
            weight: profile?.weight_kg || profile?.initial_weight_kg || "",
            bodyType: profile?.body_type || "",
            goal: profile?.goal || "",
          };

          setFormData(profileData);

          // También actualizar el estado survey para compatibilidad
          if (profile?.age_year || profile?.height_cm || profile?.weight_kg) {
            setSurvey({
              age: profileData.age,
              height: profileData.height,
              weight: profileData.weight,
              bodyType: profileData.bodyType,
              goal: profileData.goal,
            });
          }
        }

        // 2) Intentar cargar encuestas del usuario (solo si hay datos del perfil)
        if (profile?.age_year || profile?.height_cm || profile?.weight_kg) {
          try {
            const surveys = await authService.listSurveys();
            if (!cancelled && Array.isArray(surveys) && surveys.length > 0) {
              const latest = surveys[0];
              const surveyData = {
                age: latest?.age_year || profileData.age || 0,
                height: latest?.height_cm || profileData.height || 0,
                weight: Number(latest?.weight_kg || profileData.weight || 0),
                bodyType: latest?.body_type || profileData.bodyType || "",
                goal: latest?.goal || profileData.goal || "",
              };

              // Actualizar ambos estados
              setFormData((prev) => ({ ...prev, ...surveyData }));
              setSurvey(surveyData);
            }
          } catch (error) {
            console.log("No se pudieron cargar las encuestas:", error);
          }
        }
      } catch (error) {
        console.log("Error al cargar datos del usuario:", error);
        // fallback a localStorage si no hay sesión
        try {
          const { user, survey } = authService.getStoredUser();

          if (!cancelled && user) {
            setUser(user);
            setAvatarUrl(user?.avatarUrl || "");
          }

          if (!cancelled && survey) {
            setFormData(survey);
            setSurvey(survey);
          }
        } catch (localError) {
          console.log("Error al cargar datos locales:", localError);
        }
      }
    };

    // Solo ejecutar fetchData una vez al montar el componente
    fetchData();

    return () => {
      cancelled = true;
    };
  }, []); // Sin dependencias para que solo se ejecute una vez

  // Cálculos derivados para gráficos
  const metrics = useMemo(() => {
    // Solo mostrar métricas si hay datos válidos en TODOS los campos requeridos
    const hasValidData =
      formData.age &&
      formData.height &&
      formData.weight &&
      Number(formData.age) > 0 &&
      Number(formData.height) > 0 &&
      Number(formData.weight) > 0;

    if (!hasValidData) return null;

    const h = Number(formData.height);
    const w = Number(formData.weight);
    const age = Number(formData.age);
    const bmi = +(w / Math.pow(h / 100, 2)).toFixed(1);
    const bmiCap = Math.max(10, Math.min(40, bmi));
    return { h, w, age, bmi, bmiCap };
  }, [formData]);

  // Función para verificar si hay datos suficientes para mostrar gráficos
  const hasData = useMemo(() => {
    return (
      formData.age &&
      formData.height &&
      formData.weight &&
      Number(formData.age) > 0 &&
      Number(formData.height) > 0 &&
      Number(formData.weight) > 0
    );
  }, [formData]);

  // Componentes de gráficos profesionales
  const ProfessionalDonutChart = ({
    value = 0,
    max = 40,
    size = 280,
    isEmpty = false,
  }) => {
    if (isEmpty) {
      return (
        <div className="chart-empty-state">
          <div className="empty-icon">📊</div>
          <h4>Sin datos de IMC</h4>
          <p>Completa tu perfil para ver tu índice de masa corporal</p>
        </div>
      );
    }

    const percentage = (value / max) * 100;
    const strokeDasharray = `${percentage} ${100 - percentage}`;

    return (
      <div className="professional-donut-chart">
        <div className="chart-container">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <linearGradient
                id="donutGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <filter id="donutGlow">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Fondo del gráfico */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 20}
              fill="none"
              stroke="#1f2937"
              strokeWidth="16"
            />

            {/* Progreso del gráfico */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 20}
              fill="none"
              stroke="url(#donutGradient)"
              strokeWidth="16"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              filter="url(#donutGlow)"
            />

            {/* Valor central */}
            <text
              x={size / 2}
              y={size / 2 - 10}
              fill="#ffffff"
              fontSize="48"
              fontWeight="700"
              textAnchor="middle"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {value}
            </text>
            <text
              x={size / 2}
              y={size / 2 + 20}
              fill="#9ca3af"
              fontSize="16"
              fontWeight="500"
              textAnchor="middle"
              fontFamily="Inter, system-ui, sans-serif"
            >
              IMC
            </text>
          </svg>
        </div>

        {/* Información adicional */}
        <div className="chart-info">
          <div className="info-item">
            <span className="info-label">Estado</span>
            <span
              className={`info-value status-${
                value < 18.5
                  ? "underweight"
                  : value < 25
                  ? "normal"
                  : value < 30
                  ? "overweight"
                  : "obese"
              }`}
            >
              {value < 18.5
                ? "Bajo peso"
                : value < 25
                ? "Normal"
                : value < 30
                ? "Sobrepeso"
                : "Obesidad"}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Rango saludable</span>
            <span className="info-value">18.5 - 24.9</span>
          </div>
        </div>
      </div>
    );
  };

  const ProfessionalBarChart = ({
    data,
    width = 600,
    height = 300,
    isEmpty = false,
  }) => {
    if (isEmpty) {
      return (
        <div className="chart-empty-state">
          <div className="empty-icon">📈</div>
          <h4>Sin datos de medidas</h4>
          <p>Completa tu perfil para ver tus estadísticas</p>
        </div>
      );
    }

    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const barWidth = (width - 120) / data.length;

    return (
      <div className="professional-bar-chart">
        <div className="chart-header">
          <h4>Resumen de Medidas</h4>
          <div className="chart-legend">
            {data.map((item, index) => (
              <div key={item.label} className="legend-item">
                <div className={`legend-color color-${index + 1}`}></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient
                id="barGradient1"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient
                id="barGradient2"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient
                id="barGradient3"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* Líneas de cuadrícula */}
            {Array.from({ length: 5 }, (_, i) => {
              const y = height - 80 - (i * (height - 80)) / 4;
              return (
                <g key={i}>
                  <line
                    x1="60"
                    y1={y}
                    x2={width - 60}
                    y2={y}
                    stroke="#374151"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  <text
                    x="40"
                    y={y + 4}
                    fill="#9ca3af"
                    fontSize="12"
                    textAnchor="end"
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {Math.round(maxValue * (i / 4))}
                  </text>
                </g>
              );
            })}

            {/* Barras */}
            {data.map((item, index) => {
              const barHeight = (item.value / maxValue) * (height - 80);
              const x = 80 + index * barWidth;
              const y = height - 80 - barHeight;
              const gradientId = `barGradient${index + 1}`;

              return (
                <g key={item.label}>
                  <rect
                    x={x + 10}
                    y={y}
                    width={barWidth - 20}
                    height={barHeight}
                    fill={`url(#${gradientId})`}
                    rx="6"
                    ry="6"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={height - 60}
                    fill="#d1d5db"
                    fontSize="14"
                    fontWeight="600"
                    textAnchor="middle"
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {item.label}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={y - 10}
                    fill="#ffffff"
                    fontSize="16"
                    fontWeight="700"
                    textAnchor="middle"
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {item.value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const ProfessionalLineChart = ({
    data,
    width = 600,
    height = 300,
    isEmpty = false,
  }) => {
    if (isEmpty) {
      return (
        <div className="chart-empty-state">
          <div className="empty-icon">📊</div>
          <h4>Sin datos de progreso</h4>
          <p>Completa tu perfil para ver tu evolución</p>
        </div>
      );
    }

    // Datos simulados para el gráfico de líneas
    const chartData = [
      { month: "Ene", value: 70 },
      { month: "Feb", value: 72 },
      { month: "Mar", value: 71 },
      { month: "Abr", value: 69 },
      { month: "May", value: 68 },
      { month: "Jun", value: 67 },
    ];

    const maxValue = Math.max(...chartData.map((d) => d.value));
    const minValue = Math.min(...chartData.map((d) => d.value));
    const range = maxValue - minValue;

    // Generar puntos del gráfico
    const points = chartData.map((item, index) => {
      const x = 80 + (index * (width - 160)) / (chartData.length - 1);
      const y =
        height - 80 - ((item.value - minValue) / range) * (height - 120);
      return { x, y, ...item };
    });

    // Generar path para la línea
    const pathData = points
      .map((point, index) => {
        if (index === 0) return `M ${point.x} ${point.y}`;
        return `L ${point.x} ${point.y}`;
      })
      .join(" ");

    return (
      <div className="professional-line-chart">
        <div className="chart-header">
          <h4>Evolución del Peso</h4>
          <div className="chart-controls">
            <button className="control-btn active">Mensual</button>
            <button className="control-btn">Trimestral</button>
            <button className="control-btn">Anual</button>
          </div>
        </div>

        <div className="chart-container">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Líneas de cuadrícula */}
            {Array.from({ length: 5 }, (_, i) => {
              const y = height - 80 - (i * (height - 120)) / 4;
              return (
                <g key={i}>
                  <line
                    x1="60"
                    y1={y}
                    x2={width - 60}
                    y2={y}
                    stroke="#374151"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  <text
                    x="40"
                    y={y + 4}
                    fill="#9ca3af"
                    fontSize="12"
                    textAnchor="end"
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {Math.round(minValue + range * (i / 4))}
                  </text>
                </g>
              );
            })}

            {/* Línea del gráfico */}
            <path
              d={pathData}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#lineGlow)"
            />

            {/* Puntos del gráfico */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#ffffff"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <text
                  x={point.x}
                  y={point.y - 15}
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {point.value}kg
                </text>
              </g>
            ))}

            {/* Etiquetas del eje X */}
            {points.map((point, index) => (
              <text
                key={index}
                x={point.x}
                y={height - 20}
                fill="#9ca3af"
                fontSize="14"
                fontWeight="500"
                textAnchor="middle"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {point.month}
              </text>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  // Se eliminaron datos y gráficos del dashboard

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="dashboard-main">
            {/* Mensaje informativo */}
            {!hasData && (
              <div className="info-message">
                <h3>¡Bienvenido a FitLife!</h3>
                <p>
                  Para ver tus gráficos y métricas personalizadas, necesitas
                  completar <strong>el formulario</strong>, para realizarlo da click en el botón "Realizar formulario".
                </p>
                <div className="required-fields">
                  <span>📏 Altura (cm)</span>
                  <span>⚖️ Peso (kg)</span>
                  <span>🎂 Edad</span>
                </div>
              </div>
            )}

            {/* Gráficos (mock) sobre los datos de la encuesta */}
            {hasData && metrics && (
              <div className="charts-grid">
                <div className="chart-card large">
                  <h3>IMC Actual</h3>
                  <ProfessionalDonutChart value={metrics.bmiCap} max={40} />
                </div>
                <div className="chart-card large">
                  <h3>Resumen de Medidas</h3>
                  <ProfessionalBarChart
                    data={[
                      { label: "Edad", value: metrics.age || 0 },
                      { label: "Altura", value: metrics.h || 0 },
                      { label: "Peso", value: metrics.w || 0 },
                    ]}
                  />
                </div>
                <div className="chart-card full-width">
                  <h3>Evolución del Peso</h3>
                  <ProfessionalLineChart data={[]} />
                </div>
              </div>
            )}

            {/* Gráficos vacíos cuando no hay datos */}
            {!hasData && (
              <div className="charts-grid">
                <div className="chart-card large">
                  <h3>IMC Actual</h3>
                  <ProfessionalDonutChart isEmpty={true} />
                </div>
                <div className="chart-card large">
                  <h3>Resumen de Medidas</h3>
                  <ProfessionalBarChart isEmpty={true} />
                </div>
                <div className="chart-card full-width">
                  <h3>Evolución del Peso</h3>
                  <ProfessionalLineChart isEmpty={true} />
                </div>
              </div>
            )}

            {/* Acceso Rápido (debajo de los gráficos) */}
            <div className="quick-access">
              <div className="quick-access-card">
                <div className="card-header">
                  <h3>🏃‍♂️ Rutina de Hoy</h3>
                  <span className="status completed">Completada</span>
                </div>
                <p>Entrenamiento de fuerza - 45 min</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveSection("routine")}
                >
                  Ver Detalles
                </button>
              </div>

              <div className="quick-access-card">
                <div className="card-header">
                  <h3>🥗 Plan de Dieta</h3>
                  <span className="status pending">Pendiente</span>
                </div>
                <p>Desayuno: Avena con frutas - 320 cal</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => setActiveSection("diet")}
                >
                  Ver Menú
                </button>
              </div>

              <div className="quick-access-card">
                <div className="card-header">
                  <h3>📊 Próxima Medición</h3>
                  <span className="status upcoming">En 2 días</span>
                </div>
                <p>Peso e IMC - Seguimiento semanal</p>
                <button
                  className="btn btn-outline"
                  onClick={() => setActiveSection("tracking")}
                >
                  Programar
                </button>
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="profile-section">
            <h2>Perfil del Usuario</h2>

            {/* Resumen de datos en tiempo real */}
            {(formData.age || formData.height || formData.weight) && (
              <div className="data-summary">
                <h4>Resumen de tus datos:</h4>
                <div className="summary-grid">
                  {formData.age && <span>Edad: {formData.age} años</span>}
                  {formData.height && <span>Altura: {formData.height} cm</span>}
                  {formData.weight && <span>Peso: {formData.weight} kg</span>}
                  {formData.bodyType && <span>Tipo: {formData.bodyType}</span>}
                  {formData.goal && <span>Objetivo: {formData.goal}</span>}
                </div>
              </div>
            )}

            <div className="profile-card">
              <div className="profile-avatar">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="avatar-img" />
                ) : (
                  <div className="avatar-fallback">👤</div>
                )}
                <label className="avatar-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = () => {
                        const dataUrl = String(reader.result || "");
                        setAvatarUrl(dataUrl);

                        // Actualizar el estado del usuario con la nueva foto
                        setUser((prev) => ({
                          ...prev,
                          avatarUrl: dataUrl,
                        }));

                        // Guardar en localStorage
                        try {
                          const currentUserData =
                            localStorage.getItem("userData");
                          const userData = currentUserData
                            ? JSON.parse(currentUserData)
                            : {};
                          userData.avatarUrl = dataUrl;
                          localStorage.setItem(
                            "userData",
                            JSON.stringify(userData)
                          );
                          console.log(
                            "Foto de perfil guardada en localStorage"
                          );
                        } catch (error) {
                          console.log(
                            "Error al guardar foto en localStorage:",
                            error
                          );
                        }

                        // Mostrar confirmación
                        alert("¡Foto de perfil actualizada!");
                      };
                      reader.readAsDataURL(file);
                    }}
                    style={{ display: "none" }}
                  />
                  Cambiar foto
                </label>
              </div>

              <form
                className="profile-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = new FormData(e.currentTarget);
                  const updated = {
                    name: form.get("name") || user?.name || "",
                    email: form.get("email") || user?.email || "",
                    age: Number(form.get("age") || 0),
                    height: Number(form.get("height") || 0),
                    weight: Number(form.get("weight") || 0),
                    bodyType: String(form.get("bodyType") || ""),
                    goal: String(form.get("goal") || ""),
                    avatarUrl: avatarUrl || user?.avatarUrl || "",
                  };

                  // Validar que los campos requeridos estén completos
                  if (!updated.age || !updated.height || !updated.weight) {
                    alert(
                      "Por favor completa todos los campos requeridos: Edad, Altura y Peso"
                    );
                    return;
                  }

                  // Actualizar el estado local inmediatamente para los gráficos
                  const newFormData = {
                    age: updated.age || "",
                    height: updated.height || "",
                    weight: updated.weight || "",
                    bodyType: updated.bodyType || "",
                    goal: updated.goal || "",
                  };

                  setFormData(newFormData);

                  // También actualizar el estado survey para compatibilidad
                  setSurvey(newFormData);

                  // Mostrar mensaje de confirmación
                  alert(
                    "¡Datos guardados exitosamente! Los gráficos se han actualizado."
                  );

                  // Intentar guardar en backend si hay sesión
                  try {
                    await authService.updateProfile({
                      first_name: updated.name || "",
                      height_cm: updated.height || null,
                      weight_kg: updated.weight || null,
                      body_type: updated.bodyType || "",
                      goal: updated.goal || "",
                      age_year: updated.age || null,
                    });
                    console.log("Perfil actualizado en backend");
                  } catch (error) {
                    console.log(
                      "Error al actualizar perfil en backend:",
                      error
                    );
                  }

                  try {
                    await authService.createSurvey({
                      age_year: updated.age || null,
                      height_cm: updated.height || null,
                      weight_kg: updated.weight || null,
                      body_type: updated.bodyType || "",
                      goal: updated.goal || "",
                    });
                    console.log("Encuesta creada en backend");
                  } catch (error) {
                    console.log("Error al crear encuesta en backend:", error);
                  }

                  // Guardar en localStorage como respaldo
                  try {
                    const userData = {
                      name: updated.name,
                      email: updated.email,
                      avatarUrl: updated.avatarUrl,
                    };
                    localStorage.setItem("userData", JSON.stringify(userData));

                    const surveyData = {
                      age: updated.age,
                      height: updated.height,
                      weight: updated.weight,
                      bodyType: updated.bodyType,
                      goal: updated.goal,
                    };
                    localStorage.setItem(
                      "surveyData",
                      JSON.stringify(surveyData)
                    );

                    console.log("Datos guardados en localStorage");
                  } catch (error) {
                    console.log("Error al guardar en localStorage:", error);
                  }

                  // Actualizar el estado del usuario
                  setUser((prev) => ({
                    ...prev,
                    name: updated.name,
                    email: updated.email,
                  }));
                }}
              >
                <div className="profile-grid">
                  <div className="form-row">
                    <label>Nombre</label>
                    <input
                      name="name"
                      defaultValue={user?.name || ""}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="form-row">
                    <label>Correo</label>
                    <input
                      name="email"
                      type="email"
                      defaultValue={user?.email || ""}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div className="form-row">
                    <label>Edad</label>
                    <input
                      name="age"
                      type="number"
                      min="0"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          age: e.target.value,
                        }))
                      }
                      placeholder="Años"
                    />
                  </div>
                  <div className="form-row">
                    <label>Altura (cm)</label>
                    <input
                      name="height"
                      type="number"
                      min="0"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          height: e.target.value,
                        }))
                      }
                      placeholder="cm"
                    />
                  </div>
                  <div className="form-row">
                    <label>Peso (kg)</label>
                    <input
                      name="weight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          weight: e.target.value,
                        }))
                      }
                      placeholder="kg"
                    />
                  </div>
                  <div className="form-row">
                    <label>Tipo de cuerpo</label>
                    <select
                      name="bodyType"
                      value={formData.bodyType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bodyType: e.target.value,
                        }))
                      }
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="ectomorfo">Ectomorfo</option>
                      <option value="mesomorfo">Mesomorfo</option>
                      <option value="endomorfo">Endomorfo</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Objetivo</label>
                    <select
                      name="goal"
                      value={formData.goal}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          goal: e.target.value,
                        }))
                      }
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="perder_grasa">Perder grasa</option>
                      <option value="mantener">Mantener</option>
                      <option value="ganar_musculo">Ganar músculo</option>
                    </select>
                  </div>
                </div>
                <div className="profile-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      !formData.age || !formData.height || !formData.weight
                    }
                  >
                    {!formData.age || !formData.height || !formData.weight
                      ? "Completa los datos requeridos"
                      : "Guardar cambios"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={async () => {
						const res = await Swal.fire({
							title: "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer",
							icon: "warning",
							showCancelButton: true,
							confirmButtonText: "Sí, eliminar",
							cancelButtonText: "Cancelar",
							backdrop: true,
							background: "#111",
							color: "#fff",
						  });
                      if (res.isConfirmed) {
                        try {
                          await authService.deleteAccount();
                        } catch (error) {
                          alert(
                            "Error al eliminar la cuenta: " +
                              (error?.response?.data?.detail ||
                                "Error desconocido")
                          );
                        }
						await Swal.fire({
							title: "Confirmación realizada, ¡cuenta eliminada!",
							icon: "success",
							timer: 1600,
							timerProgressBar: true,
							showConfirmButton: false,
							backdrop: true,
							background: "#111",
							color: "#fff",
							didOpen: () => {
							  Swal.showLoading();
							},
							showClass: { popup: "swal2-show" },
							hideClass: { popup: "swal2-hide" },
						  });
						navigate("/login", { replace: true });
                      }
                    }}
                  >
                    Eliminar cuenta
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case "tracking":
        return (
          <div className="tracking-section">
            <h2>Seguimiento</h2>
            <p>
              Revisa tu progreso y próximas mediciones. Los gráficos se basan en
              tu encuesta.
            </p>
            <div className="charts-grid" style={{ marginTop: "1.5rem" }}>
              <div className="chart-card">
                <h3>IMC Actual</h3>
                {metrics ? (
                  <ProfessionalDonutChart value={metrics.bmiCap} max={40} />
                ) : (
                  <ProfessionalDonutChart isEmpty={true} />
                )}
              </div>
              <div className="chart-card">
                <h3>Medidas</h3>
                {metrics ? (
                  <ProfessionalBarChart
                    data={[
                      { label: "Edad", value: metrics.age || 0 },
                      { label: "Altura", value: metrics.h || 0 },
                      { label: "Peso", value: metrics.w || 0 },
                    ]}
                  />
                ) : (
                  <ProfessionalBarChart isEmpty={true} />
                )}
              </div>
            </div>
          </div>
        );

      case "diet":
        return (
          <div className="diet-section">
            <h2>Plan de Dieta</h2>
            <p>
              Sección de dieta en desarrollo... Aquí podrás ver y editar tu plan
              alimenticio.
            </p>
          </div>
        );

      case "routine":
        return (
          <div className="routine-section">
            <h2>Rutina</h2>
            <p>Sección de rutina en desarrollo...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {/* Barra Lateral */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">FitLife</h2>
          <div className="user-welcome-section">
            <div className="user-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="sidebar-avatar" />
              ) : (
                <div className="sidebar-avatar-fallback">👤</div>
              )}
            </div>
            <p className="user-welcome">
              ¡Hola, {user?.name || user?.email || "Usuario"}!
            </p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${
              activeSection === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveSection("dashboard")}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Inicio</span>
          </button>

          <button
            className={`nav-item ${
              activeSection === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveSection("profile")}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Perfil</span>
          </button>

          <button
            className={`nav-item ${
              activeSection === "tracking" ? "active" : ""
            }`}
            onClick={() => setActiveSection("tracking")}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Seguimiento</span>
          </button>

          <button
            className={`nav-item ${
              activeSection === "routine" ? "active" : ""
            }`}
            onClick={() => setActiveSection("routine")}
          >
            <span className="nav-icon">💪</span>
            <span className="nav-text">Rutina</span>
          </button>

          <button
            className={`nav-item ${activeSection === "diet" ? "active" : ""}`}
            onClick={() => setActiveSection("diet")}
          >
            <span className="nav-icon">🥗</span>
            <span className="nav-text">Dieta</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            className="btn btn-outline btn-logout"
            onClick={async () => {
              const res = await Swal.fire({
                title: "¿Seguro que quieres cerrar sesión?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, cerrar",
                cancelButtonText: "Cancelar",
                backdrop: true,
                background: "#111",
                color: "#fff",
              });
              if (res.isConfirmed) {
                try {
                  localStorage.removeItem("authToken");
                } catch {}
                await Swal.fire({
                  title: "Confirmación realizada, ¡vuelve pronto!",
                  icon: "success",
                  timer: 1600,
                  timerProgressBar: true,
                  showConfirmButton: false,
                  backdrop: true,
                  background: "#111",
                  color: "#fff",
                  didOpen: () => {
                    Swal.showLoading();
                  },
                  showClass: { popup: "swal2-show" },
                  hideClass: { popup: "swal2-hide" },
                });
                navigate("/login", { replace: true });
              }
            }}
          >
            <span className="btn-icon">🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="main-content">
        <header className="content-header">
          <h1>
            {activeSection === "dashboard"
              ? "Dashboard"
              : activeSection === "profile"
              ? "Perfil"
              : activeSection === "tracking"
              ? "Seguimiento"
              : activeSection === "diet"
              ? "Dieta"
              : activeSection === "routine"
              ? "Rutina"
              : "Dashboard"}
          </h1>
          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                // Recargar datos manualmente
                window.location.reload();
              }}
            >
              <span className="btn-icon">🔄</span>
              Refrescar Datos
            </button>
            <Link to="/surveys/start" className="btn btn-primary">
              <span className="btn-icon">➕</span>
              Realizar formulario
            </Link>
          </div>
        </header>

        {renderMainContent()}
      </main>
    </div>
  );
};

export default Dashboard;
