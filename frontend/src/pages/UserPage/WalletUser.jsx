import React, { useEffect, useState } from "react";
import { getWalletBalance, addToWallet, getWalletTransactions } from "../../services/userApi";

const WalletUser = () => {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    try {
      const data = await getWalletBalance();
      setBalance(data.balance);
    } catch (err) {
      console.log("Balance Fetch Error:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await getWalletTransactions();
      setTransactions(data.transactions);
    } catch (err) {
      console.log("Transaction Fetch Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;

    try {
      const numericAmount = Number(amount);
      const data = await addToWallet(numericAmount);

      setBalance(data.balance);
      setAmount("");

      // refresh transactions
      fetchTransactions();

    } catch (err) {
      console.log("Wallet Add Error:", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] pt-20 pb-10 flex flex-col items-center">

      {/* BALANCE CARD */}
      <div className="bg-white shadow-md rounded-2xl px-6 py-6 w-[400px] text-center border mb-6">
        <p className="text-[#8c6be8] text-xl font-semibold">Your Balance</p>
        <p className="text-3xl font-bold mt-2">₹ {balance}</p>
      </div>

      {/* ADD MONEY CARD */}
      <div className="bg-white shadow-lg rounded-3xl px-10 py-8 border w-[400px] mb-6">
        <p className="text-[#8c6be8] text-lg font-semibold mb-4">Add Money</p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="number"
            className="border-b border-black outline-none text-lg px-2 w-40 bg-transparent mb-6"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />

          <button
            type="submit"
            className="bg-[#ff3c00] text-white font-semibold px-10 py-3 rounded-full text-lg hover:bg-[#e63500] transition"
          >
            Add Money
          </button>
        </form>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white shadow-lg rounded-3xl px-8 py-6 border w-[400px]">
        <p className="text-[#8c6be8] text-lg font-semibold mb-4">Recent Transactions</p>

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center">No transactions found</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <div key={index} className="flex justify-between border-b pb-2">
                <span className={`font-semibold ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {tx.type === "credit" ? "+" : "-"} ₹{tx.amount}
                </span>
                <span className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default WalletUser;
