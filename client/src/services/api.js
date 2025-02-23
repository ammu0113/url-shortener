import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (credentials) => api.post("/user/login", credentials),
  register: (userData) => api.post("/user/register", userData),
  logout: () => api.post("/user/logout"),
  getProfile: () => api.get("/user/profile"),
};

export const urls = {
  create: (urlData) => api.post("/url/shorten", urlData),
  getAll: () => api.get("/url/all"),
  getAnalytics: (shortId) => api.get(`/url/analytics/${shortId}`),
  delete: (shortId) => api.delete(`/url/${shortId}`),
  update: (shortId, data) => api.put(`/url/${shortId}`, data),
  toggleStatus: (shortId) => api.patch(`/url/toggle/${shortId}`),
};

// Add error handling helper
const handleApiError = (error) => {
  console.error("API Error:", error);

  // Check if it's a 401 (Unauthorized)
  if (error.response?.status === 401) {
    // Optionally handle token refresh or logout
    localStorage.removeItem("token"); // Clear invalid token
    window.location.href = "/login"; // Redirect to login
  }

  throw error; // Re-throw to be handled by the component
};

export default api;
