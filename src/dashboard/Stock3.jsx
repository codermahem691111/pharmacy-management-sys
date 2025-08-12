import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Stock3() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMomBabyCareProducts();
  }, []);

  const fetchMomBabyCareProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medicines');
      // Filter medicines by type to show only mom and baby care products
      const momBabyCareProducts = res.data.filter(med => med.type === 'momBabyCare');
      setMedicines(momBabyCareProducts);
    } catch (err) {
      console.error('Error fetching mom & baby care products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this mom & baby care product?');
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/medicines/${id}`);
      if (res.status === 200) {
        setMedicines(prev => prev.filter(med => med._id !== id));
        alert('Mom & Baby Care Product deleted successfully!');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete mom & baby care product');
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.preparation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.targetAge || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-pink-800">Mom & Baby Care Product Stock</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search mom & baby care products..."
        className="border p-2 mb-4 w-full rounded"
      />

      {filteredMedicines.length === 0 ? (
        <div className="text-gray-500">No mom & baby care products found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-pink-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Preparation</th>
              <th className="p-2">Category</th>
              <th className="p-2">Target Age</th>
              <th className="p-2">Price</th>
              <th className="p-2">Units</th>
              <th className="p-2">Expiry</th>
              <th className="p-2">Safety Notes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map(med => (
              <tr key={med._id} className="border-b hover:bg-pink-50">
                <td className="p-2 font-medium">{med.name}</td>
                <td className="p-2">{med.preparation}</td>
                <td className="p-2">{med.category || '-'}</td>
                <td className="p-2 bg-pink-100 px-2 py-1 rounded text-sm">{med.targetAge || '-'}</td>
                <td className="p-2 font-semibold">BDT {med.pricePerUnit}</td>
                <td className="p-2">{med.unitsAvailable}</td>
                <td className="p-2">{new Date(med.expiryDate).toLocaleDateString()}</td>
                <td className="p-2 max-w-xs truncate" title={med.safetyNotes}>
                  {med.safetyNotes || '-'}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(med._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Stock3;
