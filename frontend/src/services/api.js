import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

/* ==============================
   🔐 REQUEST INTERCEPTOR
   Attaches token for User, Pandit, or Admin
   ============================== */
API.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("token");
    const panditToken = localStorage.getItem("panditToken");
    const adminToken = localStorage.getItem("adminToken");

    // ✅ Priority: Admin > Pandit > User
    const token = adminToken || panditToken || userToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ==============================
   ⚠️ RESPONSE INTERCEPTOR
   Handles token expiry or access denial
   ============================== */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("⚠️ Unauthorized or expired session. Logging out...");

      // Remove all possible tokens
      localStorage.removeItem("token");
      localStorage.removeItem("panditToken");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("userEmail");

      // Redirect to correct login page
      const currentPath = window.location.pathname;
      if (currentPath.includes("/pandit")) {
        window.location.href = "/pandit/login";
      } else if (currentPath.includes("/admin")) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      console.warn("🚫 Forbidden: Access denied.");
    }

    return Promise.reject(error);
  }
);

/* ==============================
   👤 AUTH ROUTES
   ============================== */
export const registerUser = (payload) => API.post("/auth/register", payload);
export const loginUser = (payload) => API.post("/auth/login", payload);
export const logoutUser = () => {
  const token = localStorage.getItem("token");
  return API.post(
    "/auth/logout",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

/* ==============================
   🧘‍♂️ PANDIT ROUTES
   ============================== */
export const getAstrologers = () => API.get("/astrologers");
export const getAstrologerById = (id) => API.get(`/astrologers/${id}`);

export const registerPandit = (formData) =>
  API.post("/pandits/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const loginPandit = (payload) => API.post("/pandits/login", payload);

export const getPanditDashboard = (panditId) =>
  API.get(`/pandits/${panditId}/dashboard`);

/* ==============================
   💬 CHAT ROUTES
   ============================== */
export const startChatSession = (userId, panditId) =>
  API.post("/chat/start", { userId, panditId });

/* ==============================
   🧾 USER DASHBOARD
   ============================== */
export const getUserDashboard = (userId) =>
  API.get(`/user/${userId}/dashboard`);

export default API;
