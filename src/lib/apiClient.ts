import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  // If we're in the browser and on the production domain, use API subdomain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'www.devspacee.me' || hostname === 'devspacee.me') {
      return 'https://api.devspacee.me'; // Use API subdomain for production
    }
  }
  
  // For development or when API_URL is explicitly set
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: getBaseURL(),
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
