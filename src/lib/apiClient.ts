import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use((config) => {
  // Token is handled via cookies, so no need to manually add it
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User profile functions
export const getUserProfile = async () => {
  const response = await apiClient.get('/api/users/profile');
  return response.data;
};

export const updateUserProfile = async <T>(profileData: T) => {
  const response = await apiClient.put('/api/users/profile', profileData);
  return response.data;
};

export const getUserByUsername = async (username: string) => {
  const response = await apiClient.get(`/api/users/${username}`);
  return response.data;
};

export default apiClient;
