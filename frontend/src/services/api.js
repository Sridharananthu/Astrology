import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {},
});

// ---------------------------------------------
// REQUEST INTERCEPTOR (attach token)
// ---------------------------------------------
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------
// RESPONSE INTERCEPTOR (handle 401 correctly)
// ---------------------------------------------
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url;
    const status = error.response?.status;

    // Routes that should NOT trigger logout
    const isLoginRoute =
      url === "/auth/login" ||
      url === "/pandit/login" ||
      url === "/admin/login";

    if (status === 401 && !isLoginRoute) {
      // Remove token
      localStorage.removeItem("token");

      // Determine role
      const role = localStorage.getItem("role");

      // Redirect based on role
      if (role === "pandit") {
        window.location.href = "/pandit/login";
      } else if (role === "admin") {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
