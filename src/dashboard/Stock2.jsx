import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Stock2() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElderCareMedicines();
  }, []);

  const fetchElderCareMedicines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medicines');
      // Filter medicines by type to show only elder care medicines
      const elderCareMedicines = res.data.filter(med => med.type === 'elderCare');
      setMedicines(elderCareMedicines);
    } catch (err) {
      console.error('Error fetching elder care medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this elder care medicine?');
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/medicines/${id}`);
      if (res.status === 200) {
        setMedicines(prev => prev.filter(med => med._id !== id));
        alert('Elder Care Medicine deleted successfully!');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete elder care medicine');
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.preparation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.ageGroup || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">Elder Care Medicine Stock</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search elder care medicine..."
        className="border p-2 mb-4 w-full rounded"
      />

      {filteredMedicines.length === 0 ? (
        <div className="text-gray-500">No elder care medicines found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Preparation</th>
              <th className="p-2">Category</th>
              <th className="p-2">Age Group</th>
              <th className="p-2">Price</th>
              <th className="p-2">Units</th>
              <th className="p-2">Expiry</th>
              <th className="p-2">Special Instructions</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map(med => (
              <tr key={med._id} className="border-b hover:bg-blue-50">
                <td className="p-2 font-medium">{med.name}</td>
                <td className="p-2">{med.preparation}</td>
                <td className="p-2">{med.category || '-'}</td>
                <td className="p-2 bg-blue-100 px-2 py-1 rounded text-sm">{med.ageGroup || '-'}</td>
                <td className="p-2 font-semibold">BDT {med.pricePerUnit}</td>
                <td className="p-2">{med.unitsAvailable}</td>
                <td className="p-2">{new Date(med.expiryDate).toLocaleDateString()}</td>
                <td className="p-2 max-w-xs truncate" title={med.specialInstructions}>
                  {med.specialInstructions || '-'}
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

export default Stock2;
