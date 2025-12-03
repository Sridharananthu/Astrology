import API from "./api";

/* ---------------- AUTH ---------------- */
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  return true;
};

/* ---------------- WALLET ---------------- */
export const addToWallet = async (amount) => {
  const res = await API.post("/user/wallet/add", { amount });
  return res.data;
};

export const getWalletBalance = async () => {
  const res = await API.get("/user/wallet/balance");
  return res.data;
};

/* ---------------- PANDIT AUTH ---------------- */
export const loginPandit = async (data) => {
  const res = await API.post("/pandit/login", data);
  return res.data;
};

export const registerPandit = async (formData) => {
  const res = await API.post("/pandit/register", formData);
  return res.data;
};

/* ---------------- ADMIN AUTH ---------------- */
export const loginAdmin = async (data) => {
  const res = await API.post("/admin/login", data);
  return res.data;
};

export const registerAdmin = async (data) => {
  const res = await API.post("/admin/register", data);
  return res.data;
};
