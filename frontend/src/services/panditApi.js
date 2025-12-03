// src/services/panditApi.js
import API from "./api";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// GET DASHBOARD
export const getPanditDashboard = async (panditId) => {
  const res = await API.get(`/pandit/${panditId}/dashboard`, authHeader());
  return res.data;
};

// TOGGLE STATUS (must include auth header)
export const setPanditOnlineStatus = async (panditId, isOnline) => {
  const res = await API.patch(
    `/pandit/${panditId}/online-status`,
    { isOnline },
    authHeader()
  );
  return res.data;
};

// PANDIT REQUESTS
export const getPanditRequests = async (panditId) => {
  const res = await API.get(`/pandit/${panditId}/requests`, authHeader());
  return res.data;
};

// ACTIVE SESSIONS
export const getPanditActiveSessions = async (panditId) => {
  const res = await API.get(`/pandit/${panditId}/active-sessions`, authHeader());
  return res.data;
};

// TRANSACTIONS
export const getPanditTransactions = async (panditId) => {
  const res = await API.get(`/pandit/${panditId}/transactions`, authHeader());
  return res.data;
};

// HISTORY
export const getPanditHistory = async (panditId) => {
  const res = await API.get(`/pandit/${panditId}/history`, authHeader());
  return res.data;
};

// NEW: set session status (chat / call / null)
export const setPanditSessionStatus = async (panditId, status) => {
  const res = await API.patch(`/pandit/${panditId}/session-status`, { status }, authHeader());
  return res.data;
};
