import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaShoppingCart, FaMoneyBillWave, FaCalendarAlt, FaSearch, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

function Customer() {
  const [medicines, setMedicines] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showCustomers, setShowCustomers] = useState(false);
  const [form, setForm] = useState({ name: '', product: '', billPaid: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/medicines');
      setMedicines(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError('Error fetching medicines. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Error fetching customers. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear any previous error/success messages when user types
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validation
    if (!form.name.trim()) {
      setError('Customer name is required');
      return;
    }
    if (!form.product.trim()) {
      setError('Product name is required');
      return;
    }
    if (!form.billPaid || form.billPaid <= 0) {
      setError('Bill amount must be greater than 0');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const response = await axios.post('http://localhost:5000/api/customers', {
        name: form.name.trim(),
        product: form.product.trim(),
        billPaid: Number(form.billPaid)
      });

      setSuccess('Customer record added successfully!');
      setForm({ name: '', product: '', billPaid: '' });
      
      // Refresh customers list if it's currently shown
      if (showCustomers) {
        await fetchCustomers();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error adding customer:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to add customer. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewCustomers = async () => {
    if (!showCustomers) {
      await fetchCustomers();
    }
    setShowCustomers(v => !v);
  };

  const filteredCustomers = customers.filter(cust =>
    cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !showCustomers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
          <p className="text-gray-600">Add and manage customer records</p>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Add Customer Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FaPlus className="mr-2 text-blue-600" />
            Add New Customer
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-gray-500" />
                  Customer Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaShoppingCart className="inline mr-2 text-gray-500" />
                  Product
                </label>
                <input
                  name="product"
                  value={form.product}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-gray-500" />
                  Bill Amount (BDT)
                </label>
                <input
                  type="number"
                  name="billPaid"
                  value={form.billPaid}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" />
                    Add Customer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* View Customers Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FaEye className="mr-2 text-green-600" />
              Customer Records
            </h2>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
              onClick={handleViewCustomers}
            >
              {showCustomers ? (
                <>
                  <FaEyeSlash className="mr-2" />
                  Hide Customers
                </>
              ) : (
                <>
                  <FaEye className="mr-2" />
                  View Customers
                </>
              )}
            </button>
          </div>

          {showCustomers && (
            <div>
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search by customer name or product..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Customers Table */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading customers...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left p-3 text-sm font-medium text-gray-700">Customer Name</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-700">Product</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-700">Bill Amount</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-8 text-gray-500">
                            {searchTerm ? 'No customers found matching your search.' : 'No customer records found.'}
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map(cust => (
                          <tr key={cust._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 text-sm text-gray-900 font-medium">{cust.name}</td>
                            <td className="p-3 text-sm text-gray-700">{cust.product}</td>
                            <td className="p-3 text-sm text-gray-900 font-semibold">BDT {cust.billPaid.toFixed(2)}</td>
                            <td className="p-3 text-sm text-gray-600 flex items-center">
                              <FaCalendarAlt className="mr-2 text-gray-400" />
                              {new Date(cust.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Summary */}
              {filteredCustomers.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Showing {filteredCustomers.length} customer record{filteredCustomers.length !== 1 ? 's' : ''}
                    {searchTerm && ` matching "${searchTerm}"`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Customer;
