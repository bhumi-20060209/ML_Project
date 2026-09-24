import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor for auth token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cardio_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.error || error.response?.data?.message || 'Network or Server Error',
      details: error.response?.data?.details || null,
      status: error.response?.status || 500
    };
    return Promise.reject(customError);
  }
);

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
};

export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats'),
};

export const predictionApi = {
  predict: (payload) => apiClient.post('/predictions/predict', payload),
  getHistory: (params) => apiClient.get('/predictions/history', { params }),
  getById: (id) => apiClient.get(`/predictions/history/${id}`),
  deletePrediction: (id) => apiClient.delete(`/predictions/history/${id}`),
};

export const modelsApi = {
  getModels: () => apiClient.get('/models'),
  getById: (id) => apiClient.get(`/models/${id}`),
};

export const analyticsApi = {
  getOverview: () => apiClient.get('/analytics/overview'),
  getAgeDistribution: () => apiClient.get('/analytics/age-distribution'),
  getGenderDistribution: () => apiClient.get('/analytics/gender-distribution'),
  getPredictionDistribution: () => apiClient.get('/analytics/prediction-distribution'),
  getBpDistribution: () => apiClient.get('/analytics/bp-distribution'),
  getLifestyleDistribution: () => apiClient.get('/analytics/lifestyle-distribution'),
};

export const datasetApi = {
  getSummary: () => apiClient.get('/dataset/summary'),
  getColumns: () => apiClient.get('/dataset/columns'),
  getSample: (params) => apiClient.get('/dataset/sample', { params }),
  getStatistics: () => apiClient.get('/dataset/statistics'),
};

export const settingsApi = {
  getSettings: () => apiClient.get('/settings'),
  updateSettings: (payload) => apiClient.put('/settings', payload),
};

export default apiClient;
