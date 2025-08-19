import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const healthService = {
  async ping() {
    const { data } = await api.get('/health/test/');
    return data;
  },
  async bmiCalculatePublic({ height_cm, weight_kg, body_fat_pct }) {
    // Build absolute URL to avoid '/api' base interfering
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const apiOrigin = apiUrl.replace(/\/?api\/?$/, ''); // remove trailing /api
    const url = `${apiOrigin}/public/calculate-bmi/`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ height_cm, weight_kg, body_fat_pct }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'BMI public request failed');
    }
    return res.json();
  },
  async bmiCalculate({ height_cm, weight_kg, body_fat_pct }) {
    const { data } = await api.post('/health/bmi/', { height_cm, weight_kg, body_fat_pct });
    return data; // { bmi, category }
  },
  async listMetrics() {
    const { data } = await api.get('/health/metrics/');
    return data;
  },
  async addMetric({ height_cm, weight_kg, body_fat_pct }) {
    const { data } = await api.post('/health/metrics/', { height_cm, weight_kg, body_fat_pct });
    return data;
  },
};