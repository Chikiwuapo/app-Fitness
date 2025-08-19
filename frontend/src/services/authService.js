import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function saveTokens({ access, refresh }) {
  if (access) {
    localStorage.setItem('access', access);
    localStorage.setItem('authToken', access); // compat con lógica previa
  }
  if (refresh) localStorage.setItem('refresh', refresh);
}

export const authService = {
  async register({ email, password, name }) {
    const { data } = await api.post('/auth/register/', { email, password, name });
    return data;
  },
  async login({ email, password }) {
    const { data } = await api.post('/auth/login/', { email, password });
    saveTokens(data);
    return data;
  },
  async refresh() {
    const refresh = localStorage.getItem('refresh');
    const { data } = await api.post('/auth/refresh/', { refresh });
    saveTokens(data);
    return data;
  },
  logout() {
    // Limpiar tokens de autenticación
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('authToken');
    
    // Limpiar datos del usuario (opcional, para mantener datos locales)
    // localStorage.removeItem('userData');
    // localStorage.removeItem('surveyData');
    
    console.log('Sesión cerrada, tokens eliminados');
  },
  async me() {
    const { data } = await api.get('/auth/me/');
    return data;
  },
  async getProfile() {
    const { data } = await api.get('/auth/profile/');
    return data;
  },
  async updateProfile(payload) {
    const { data } = await api.put('/auth/profile/', payload);
    return data;
  },
  async requestPasswordReset(email) {
    const { data } = await api.post('/auth/password/reset/', { email });
    return data;
  },
  async listSurveys() {
    const { data } = await api.get('/auth/surveys/');
    return data;
  },
  async createSurvey(payload) {
    const { data } = await api.post('/auth/surveys/', payload);
    return data;
  },
  async deleteAccount() {
    const { data } = await api.delete('/auth/delete-account/');
    this.logout(); // Limpiar tokens después de eliminar cuenta
    return data;
  },
  isAuthenticated() {
    const token = localStorage.getItem('access');
    return !!token;
  },
  getStoredUser() {
    try {
      const userData = localStorage.getItem('userData');
      const surveyData = localStorage.getItem('surveyData');
      return {
        user: userData ? JSON.parse(userData) : null,
        survey: surveyData ? JSON.parse(surveyData) : null
      };
    } catch (error) {
      console.log('Error al obtener datos almacenados:', error);
      return { user: null, survey: null };
    }
  },
};