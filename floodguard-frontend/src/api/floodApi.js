import axios from 'axios'

const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://floodguard-ai-23yq.onrender.com'
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
}

const API_BASE = getApiBase()

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
export const getReports = () => api.get('/api/reports')
export const updateReportStatus = (id, data) => api.patch(`/api/reports/${id}/status`, data)
export const analyzeReportImage = (data) => api.post('/api/reports/analyze-image', data)
export const getAlerts = () => api.get('/api/alerts')
export const getAssistant = (data) => api.post('/api/alerts/assistant', data)
export const getShelters = () => api.get('/api/evacuation/shelters')
export const getEvacuationRoute = (data) => api.post('/api/evacuation/route', data)
export const triggerSOS = (data) => api.post('/api/sos/trigger', data)
export const getActiveSOS = () => api.get('/api/sos/active')
export const dispatchSOS = (id, data) => api.patch(`/api/sos/${id}/dispatch`, data)
export const getImpactEstimation = (data) => api.post('/api/impact/estimate', data)
export const getCityImpactSummary = (params) => api.get('/api/impact/city-summary', { params })
export const sendBroadcast = (data) => api.post('/api/broadcast/send', data)
export const getBroadcastHistory = () => api.get('/api/broadcast/history')
export const getHistoricalAnalytics = (params) => api.get('/api/history/analytics', { params })
export const getNeighborhoodFrequency = () => api.get('/api/history/neighborhood-frequency')
export const loginUser = (data) => api.post('/api/auth/login', data)
export const registerUser = (data) => api.post('/api/auth/register', data)

export default api
