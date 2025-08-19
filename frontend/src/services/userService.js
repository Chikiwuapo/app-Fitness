import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const userService = {
  // Progreso
  async listProgress() {
    const { data } = await api.get('/progress/');
    return data;
  },
  async addProgress(payload) {
    const { data } = await api.post('/progress/', payload);
    return data;
  },
  async getProgressStats() {
    const { data } = await api.get('/progress/stats/');
    return data;
  },

  // Planes
  async generatePlans() {
    const { data } = await api.post('/plans/generate/');
    return data; // { diet, workout }
  },
  async listDietPlans() {
    const { data } = await api.get('/plans/diet/');
    return data;
  },
  async createDietPlan(payload) {
    const { data } = await api.post('/plans/diet/', payload);
    return data;
  },
  async listWorkoutPlans() {
    const { data } = await api.get('/plans/workout/');
    return data;
  },
  async createWorkoutPlan(payload) {
    const { data } = await api.post('/plans/workout/', payload);
    return data;
  },

  // Notificaciones
  async listNotifications() {
    const { data } = await api.get('/notifications/');
    return data;
  },
  async markNotificationRead(id) {
    const { data } = await api.post(`/notifications/${id}/read/`);
    return data;
  },
};