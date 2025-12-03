import API from "./api";

export const getUserDashboard = async () => {
  const res = await API.get("/user/dashboard");
  return res.data;
};

export const addToWallet = async (amount) => {
  const res = await API.post("/user/wallet/add", { amount });
  return res.data;
};

export const getWalletBalance = async () => {
  const res = await API.get("/user/wallet/balance");
  return res.data;
};

export const getWalletTransactions = async () => {
  const res = await API.get("/user/wallet/transactions");
  return res.data;
};

export const debitWallet = async (panditId) => {
  console.log("debiting amount for", panditId);
  const res = await API.post("/user/wallet/debit", { panditId });
  return res.data;
};