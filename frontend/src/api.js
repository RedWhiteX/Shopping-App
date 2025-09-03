
import axios from "axios";

// 1. Add the 'export' keyword here
// export const BASE_URL = "http://127.0.0.1:8002/api/";
export const BASE_URL = `${window.location.origin}/api/`;
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, 
});

// --- Interceptor to ADD the token to requests ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Interceptor to REFRESH the token on 401 failure ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) {
            window.location.href = '/login';
            return Promise.reject(error);
        }

        const response = await axios.post(`${BASE_URL}token/refresh/`, { refresh });
        const newAccessToken = response.data.access;

        localStorage.setItem("access", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;