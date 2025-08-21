// import axios from "axios";

// export const BASE_URL = 'http://127.0.0.1:8002/api/'

// const api = axios.create({
//     baseURL: BASE_URL,
//     withCredentials: true,
// })

// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("access")
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`
//         }
//         console.log("Request Headers:", config.headers);
//         return config
//     },
//     (error) => {
//         console.log(error)
//         return Promise.reject(error)
//     }
// )
// export default api

// src/api.js







// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8002/api/",
// });

// // --- Interceptor to ADD the token to requests ---
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


// // --- Interceptor to REFRESH the token on 401 failure ---
// api.interceptors.response.use(
//   // If the request was successful, just return the response
//   (response) => response,
//   // If the request failed
//   async (error) => {
//     const originalRequest = error.config;

//     // Check if the error is 401 and it's the first time this request failed
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Mark it as retried

//       try {
//         const refresh = localStorage.getItem("refresh");
//         if (!refresh) {
//             // If no refresh token, redirect to login
//             window.location.href = '/login';
//             return Promise.reject(error);
//         }

//         // Request a new access token
//         const response = await axios.post("http://127.0.0.1:8002/api/token/refresh/", { refresh });
//         const newAccessToken = response.data.access;

//         // Store the new token
//         localStorage.setItem("access", newAccessToken);

//         // Update the header for the original request and retry it
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);

//       } catch (refreshError) {
//         // If refresh fails, clear storage and redirect to login
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
//     // For any other errors, just pass them along
//     return Promise.reject(error);
//   }
// );

// export default api;






// src/api.js
import axios from "axios";

// 1. Add the 'export' keyword here
export const BASE_URL = "http://127.0.0.1:8002/api/";

const api = axios.create({
  baseURL: BASE_URL,
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