import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Stock4() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRareMedicines();
  }, []);

  const fetchRareMedicines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medicines');
      // Filter medicines by type to show only rare medicines
      const rareMedicines = res.data.filter(med => med.type === 'rareMedicine');
      setMedicines(rareMedicines);
    } catch (err) {
      console.error('Error fetching rare medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this rare medicine?');
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/medicines/${id}`);
      if (res.status === 200) {
        setMedicines(prev => prev.filter(med => med._id !== id));
        alert('Rare Medicine deleted successfully!');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete rare medicine');
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.preparation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.rarityLevel || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.specialHandling || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-red-800">Rare Medicine Stock</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search rare medicines..."
        className="border p-2 mb-4 w-full rounded"
      />

      {filteredMedicines.length === 0 ? (
        <div className="text-gray-500">No rare medicines found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-red-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Preparation</th>
              <th className="p-2">Category</th>
              <th className="p-2">Rarity Level</th>
              <th className="p-2">Special Handling</th>
              <th className="p-2">Price</th>
              <th className="p-2">Units</th>
              <th className="p-2">Expiry</th>
              <th className="p-2">Clinical Notes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map(med => (
              <tr key={med._id} className="border-b hover:bg-red-50">
                <td className="p-2 font-medium">{med.name}</td>
                <td className="p-2">{med.preparation}</td>
                <td className="p-2">{med.category || '-'}</td>
                <td className="p-2 bg-red-100 px-2 py-1 rounded text-sm font-semibold">{med.rarityLevel || '-'}</td>
                <td className="p-2 bg-yellow-100 px-2 py-1 rounded text-sm">{med.specialHandling || '-'}</td>
                <td className="p-2 font-semibold">BDT {med.pricePerUnit}</td>
                <td className="p-2">{med.unitsAvailable}</td>
                <td className="p-2">{new Date(med.expiryDate).toLocaleDateString()}</td>
                <td className="p-2 max-w-xs truncate" title={med.clinicalNotes}>
                  {med.clinicalNotes || '-'}
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

export default Stock4;
