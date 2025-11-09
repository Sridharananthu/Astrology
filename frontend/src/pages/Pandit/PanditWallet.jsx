import React, { useState } from "react";
import { Wallet, IndianRupee, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const PanditWallet = () => {
  // Mock data (will be replaced by backend later)
  const [walletData, setWalletData] = useState({
    totalEarnings: 5000,
    adminShare: 1000,
    availableBalance: 4000,
    transactions: [
      {
        id: "TXN101",
        client: "Ramesh Kumar",
        amount: 1200,
        date: "2025-11-05",
        type: "credit",
      },
      {
        id: "TXN102",
        client: "Sneha",
        amount: 800,
        date: "2025-11-07",
        type: "credit",
      },
      {
        id: "TXN103",
        client: "Admin Share",
        amount: 500,
        date: "2025-11-08",
        type: "debit",
      },
    ],
  });

  const handleWithdraw = () => {
    alert("Withdrawal request sent to Admin ✅ (Backend integration pending)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f29] to-[#111633] text-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#d4af37] flex items-center gap-2">
          <Wallet className="text-[#d4af37]" /> Pandit Wallet
        </h1>
        <button
          onClick={handleWithdraw}
          className="bg-[#d4af37] text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          Withdraw Funds
        </button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#161b3d] border border-[#2e3261] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[#d4af37] flex items-center gap-2">
            <IndianRupee /> Total Earnings
          </h2>
          <p className="text-2xl mt-2 font-bold text-green-400">
            ₹{walletData.totalEarnings}
          </p>
        </div>
        <div className="bg-[#161b3d] border border-[#2e3261] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[#d4af37]">Admin Share</h2>
          <p className="text-2xl mt-2 font-bold text-red-400">
            ₹{walletData.adminShare}
          </p>
        </div>
        <div className="bg-[#161b3d] border border-[#2e3261] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[#d4af37]">
            Available Balance
          </h2>
          <p className="text-2xl mt-2 font-bold text-yellow-400">
            ₹{walletData.availableBalance}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#161b3d] border border-[#2e3261] rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-[#d4af37] mb-4">
          Transaction History
        </h3>
        <table className="w-full text-left text-gray-300 text-sm">
          <thead>
            <tr className="border-b border-[#2e3261] text-gray-400">
              <th className="pb-2">Transaction ID</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {walletData.transactions.map((txn) => (
              <tr
                key={txn.id}
                className="border-b border-[#2e3261]/50 hover:bg-[#0b0f29] transition"
              >
                <td className="py-2">{txn.id}</td>
                <td>{txn.client}</td>
                <td>₹{txn.amount}</td>
                <td className="flex items-center gap-1">
                  {txn.type === "credit" ? (
                    <ArrowDownCircle className="text-green-400" size={16} />
                  ) : (
                    <ArrowUpCircle className="text-red-400" size={16} />
                  )}
                  <span
                    className={`${
                      txn.type === "credit" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {txn.type === "credit" ? "Credit" : "Debit"}
                  </span>
                </td>
                <td>{txn.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanditWallet;
