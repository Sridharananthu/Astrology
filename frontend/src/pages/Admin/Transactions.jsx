import { useState, useEffect } from "react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setTransactions([
      { id: 1, user: "Amit Verma", pandit: "Pandit Rajesh", amount: 500, date: "2025-11-08" },
      { id: 2, user: "Riya Sen", pandit: "Pandit Meera", amount: 1200, date: "2025-11-07" },
    ]);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Transactions</h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-3">User</th>
              <th className="p-3">Pandit</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{t.user}</td>
                <td className="p-3">{t.pandit}</td>
                <td className="p-3">₹{t.amount}</td>
                <td className="p-3">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
