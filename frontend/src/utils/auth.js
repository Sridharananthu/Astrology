import API from "../services/api";

export async function logout() {
  try {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      await API.post(
        "/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✔ Backend updated isLoggedIn=false");
    }

    // Clear everything
    localStorage.clear();

    // Redirect based on role
    if (role === "pandit") {
      window.location.href = "/pandit/login";
    } else if (role === "admin") {
      window.location.href = "/admin/login";
    } else {
      window.location.href = "/login"; // user
    }

  } catch (err) {
    console.warn("⚠️ Backend logout failed:", err.message);
    localStorage.clear();
    window.location.href = "/login";
  }
}
// ----------------------------
// ADMIN AUTH HELPERS
// ----------------------------

const ADMIN_TOKEN_KEY = "adminToken";
const ADMIN_INFO_KEY = "adminInfo";

// store admin token & info
export function setAdminToken(token, admin = null) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem("role", "admin");
  if (admin) localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(admin));
}

// get admin token
export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

// remove admin token
export function removeAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_INFO_KEY);
}

// get admin details
export function getAdminInfo() {
  const data = localStorage.getItem(ADMIN_INFO_KEY);
  return data ? JSON.parse(data) : null;
}

export function isTokenExpired() {
  const expiry = localStorage.getItem("tokenExpiry");
  if (!expiry) return false;
  return Date.now() > parseInt(expiry);
}
