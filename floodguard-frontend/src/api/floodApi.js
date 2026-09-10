import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://floodguard-ai-23yq.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCurrentFlood = async () => {
  const response = await api.get('/api/flood/current');
  return response.data;
};

export const getWeather = async () => {
  const response = await api.get('/api/weather/current');
  return response.data;
};

export const predictFlood = async (data) => {
  const response = await api.post('/api/flood/predict', data);
  return response.data;
};

export const submitReport = async (data) => {
  const response = await api.post('/api/reports', data);
  return response.data;
};

export const getAlerts = async () => {
  const response = await api.get('/api/alerts');
  return response.data;
};

export default api;
