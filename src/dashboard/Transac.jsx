import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaDownload, FaSearch, FaFilter } from 'react-icons/fa';

function Transac() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(res.data);
    } catch (err) {
      setError('Error fetching transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.preparation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || transaction.date.includes(filterDate);
    return matchesSearch && matchesDate;
  });

  const exportTransactionPDF = (transaction) => {
    // This would integrate with jsPDF for detailed transaction export
    alert(`Exporting transaction for ${transaction.medicineName}`);
  };

  const getTotalRevenue = () => {
    return transactions.reduce((sum, transaction) => sum + transaction.totalPrice, 0);
  };

  const getTotalUnitsSold = () => {
    return transactions.reduce((sum, transaction) => sum + transaction.quantity, 0);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-center font-[500] text-emerald-600 text-3xl mb-8">Transaction Records</h1>
      
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-blue-800">Total Transactions</h3>
          <p className="text-3xl font-bold text-blue-600">{transactions.length}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-green-800">Total Units Sold</h3>
          <p className="text-3xl font-bold text-green-600">{getTotalUnitsSold()}</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-purple-800">Total Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">BDT {getTotalRevenue()}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            className="border p-3 pl-10 rounded-lg w-full"
            placeholder="Search by medicine name or preparation..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          <input
            type="date"
            className="border p-3 rounded-lg"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-emerald-100">
              <th className="border border-gray-300 p-3 text-left font-semibold">Date</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Medicine Name</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Preparation</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Quantity</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Price Per Unit</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Total Price</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => (
                <tr key={transaction._id || index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-3 font-medium">
                    {transaction.medicineName}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {transaction.preparation}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {transaction.quantity}
                  </td>
                  <td className="border border-gray-300 p-3">
                    BDT {transaction.pricePerUnit}
                  </td>
                  <td className="border border-gray-300 p-3 font-semibold">
                    BDT {transaction.totalPrice}
                  </td>
                  <td className="border border-gray-300 p-3">
                    <button
                      onClick={() => exportTransactionPDF(transaction)}
                      className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600 flex items-center gap-2"
                    >
                      <FaDownload className="text-sm" />
                      Export
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border border-gray-300 p-6 text-center text-gray-500">
                  {transactions.length === 0 ? 'No transactions found' : 'No transactions match your search criteria'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Export All Button */}
      {transactions.length > 0 && (
        <div className="mt-6 text-center">
          <button
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 font-semibold flex items-center gap-2 mx-auto"
            onClick={() => alert('Exporting all transactions...')}
          >
            <FaDownload />
            Export All Transactions
          </button>
        </div>
      )}
    </div>
  );
}

export default Transac;
