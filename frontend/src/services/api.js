import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // You can modify the request config here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const response = await axios.post('/auth/refresh');
        const { accessToken } = response.data.data;

        // Update the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh')
};

// Skills endpoints
export const skillsAPI = {
  getAllSkills: (page = 1, limit = 10) => api.get(`/skills?page=${page}&limit=${limit}`),
  getSkill: (id) => api.get(`/skills/${id}`),
  createSkill: (skillData) => api.post('/skills', skillData),
  updateSkill: (id, skillData) => api.patch(`/skills/${id}`, skillData),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
  updateProgress: (id, progressData) => api.post(`/skills/${id}/progress`, progressData)
};

export default api;