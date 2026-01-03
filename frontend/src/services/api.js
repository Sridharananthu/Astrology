import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {},
});

// ---------------------------------------------
// REQUEST INTERCEPTOR (attach correct token)
// ---------------------------------------------
API.interceptors.request.use(
  (config) => {
    const role = localStorage.getItem("role");

    let token = null;

    if (role === "admin") {
      token = localStorage.getItem("adminToken");
    } else {
      // user or pandit uses normal token
      token = localStorage.getItem("token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------
// RESPONSE INTERCEPTOR (handle 401 & redirect)
// ---------------------------------------------
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url;
    const status = error.response?.status;

    const isLoginRoute =
      url === "/auth/login" ||
      url === "/pandit/login" ||
      url === "/admin/login";

    // If unauthorized and NOT login route => logout and redirect
    if (status === 401 && !isLoginRoute) {
      const role = localStorage.getItem("role");

      // clear all tokens safely
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("role");

      if (role === "pandit") {
        window.location.href = "/pandit/login";
      } else if (role === "admin") {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login"; // user
      }
    }

    return Promise.reject(error);
  }
);

export default API;
