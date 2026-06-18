import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pcbaAPI = {
  // PCBA operations
  createPCBA: (data) => api.post('/pcbas', data),
  getAllPCBAs: () => api.get('/pcbas'),
  getPCBA: (identifier) => api.get(`/pcbas/${encodeURIComponent(identifier)}`),
  updatePCBAStatus: (id, status) => api.patch(`/pcbas/${encodeURIComponent(id)}`, { status }),

  // Assembly records
  createAssemblyRecord: (data) => api.post('/assembly-records', data),
  getAssemblyRecords: (pcbaId) => api.get(`/assembly-records/${encodeURIComponent(pcbaId)}`),

  // Test records
  createTestRecord: (data) => api.post('/test-records', data),
  getTestRecords: (pcbaId) => api.get(`/test-records/${encodeURIComponent(pcbaId)}`),

  // Components
  addComponent: (data) => api.post('/components', data),

  // Statistics
  getStatistics: () => api.get('/statistics'),
};

export default api;
