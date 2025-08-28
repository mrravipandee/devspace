import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  // If we're in the browser and on the production domain, use relative URLs
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'www.devspacee.me' || hostname === 'devspacee.me') {
      return ''; // Use relative URLs for production to share cookies
    }
  }
  
  // For development or when API_URL is explicitly set
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use((config) => {
  // Log request in development
  if (process.env.NODE_ENV === 'development') {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.message);
    
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
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

// Achievement functions
export const getAchievements = async (username: string) => {
  const response = await apiClient.get(`/api/${username}/achievements`);
  return response.data;
};

export const createAchievement = async (achievementData: any) => {
  const response = await apiClient.post('/api/achievements', achievementData);
  return response.data;
};

export const updateAchievement = async (id: string, achievementData: any) => {
  const response = await apiClient.put(`/api/achievements/${id}`, achievementData);
  return response.data;
};

export const deleteAchievement = async (id: string) => {
  const response = await apiClient.delete(`/api/achievements/${id}`);
  return response.data;
};

export default apiClient;
