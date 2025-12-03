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

export function isTokenExpired() {
  const expiry = localStorage.getItem("tokenExpiry");
  if (!expiry) return false;
  return Date.now() > parseInt(expiry);
}
