import axios from 'axios'

const API_BASE = 'https://floodguard-ai-23yq.onrender.com'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const getCurrentFlood = () => api.get('/api/flood/current')
export const getWeather = () => api.get('/api/weather/current')
export const predictFlood = (data) => api.post('/api/flood/predict', data)
export const submitReport = (data) => api.post('/api/reports', data)
export const getAlerts = () => api.get('/api/alerts')
export const getAssistant = (data) => api.post('/api/alerts/assistant', data)

export default api
