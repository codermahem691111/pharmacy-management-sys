import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaPills, FaCalendarAlt, FaBoxes } from 'react-icons/fa';
import axios from 'axios';

function Reminder() {
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLowStockMedicines();
  }, []);

  const fetchLowStockMedicines = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/medicines/low-stock');
      setLowStockMedicines(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch low stock medicines');
      console.error('Error fetching low stock medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (daysUntilExpiry <= 7) return { status: 'expiring soon', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    if (daysUntilExpiry <= 30) return { status: 'expiring this month', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'valid', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const getStockStatus = (units) => {
    if (units === 0) return { status: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (units <= 2) return { status: 'Critical', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (units <= 4) return { status: 'Low', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { status: 'Normal', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={fetchLowStockMedicines}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <FaExclamationTriangle className="text-red-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Low Stock Reminders</h1>
              <p className="text-gray-600">Medicines requiring immediate attention</p>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{lowStockMedicines.length}</p>
                </div>
                <FaBoxes className="text-red-500 text-2xl" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {lowStockMedicines.filter(m => m.unitsAvailable <= 2).length}
                  </p>
                </div>
                <FaExclamationTriangle className="text-orange-500 text-2xl" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {lowStockMedicines.filter(m => getDaysUntilExpiry(m.expiryDate) <= 7).length}
                  </p>
                </div>
                <FaCalendarAlt className="text-yellow-500 text-2xl" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(lowStockMedicines.map(m => m.category)).size}
                  </p>
                </div>
                <FaPills className="text-blue-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Medicines List */}
        {lowStockMedicines.length === 0 ? (
          <div className="text-center py-12">
            <FaPills className="text-green-500 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Good!</h3>
            <p className="text-gray-600">No medicines are currently running low on stock.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Medicines</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medicine Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Units Available
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Until Expiry
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lowStockMedicines.map((medicine, index) => {
                    const stockStatus = getStockStatus(medicine.unitsAvailable);
                    const expiryStatus = getExpiryStatus(medicine.expiryDate);
                    const daysUntilExpiry = getDaysUntilExpiry(medicine.expiryDate);
                    
                    return (
                      <tr key={medicine._id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaPills className="text-blue-500 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                              <div className="text-sm text-gray-500">{medicine.preparation}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {medicine.category}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.color}`}>
                            {stockStatus.status}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-lg font-semibold ${stockStatus.color}`}>
                              {medicine.unitsAvailable}
                            </span>
                            <span className="text-gray-500 ml-1">units</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {formatDate(medicine.expiryDate)}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expiryStatus.bgColor} ${expiryStatus.color}`}>
                            {daysUntilExpiry < 0 
                              ? 'Expired' 
                              : daysUntilExpiry === 0 
                                ? 'Expires Today' 
                                : `${daysUntilExpiry} days`
                            }
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchLowStockMedicines}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reminder;
