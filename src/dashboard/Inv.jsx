import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const categories = [
  {
    label: 'Solid Dosage Forms',
    options: [
      'Tablets - Plain',
      'Tablets - Chewable',
      'Tablets - Dispersible',
      'Tablets - Sublingual',
      'Capsules - Hard Gelatin',
      'Capsules - Soft Gelatin',
      'Lozenges / Troches',
      'Powders / Granules',
      'Effervescent Tablets',
    ],
  },
  {
    label: 'Semi-Solid Dosage Forms',
    options: ['Creams', 'Ointments', 'Gels', 'Pastes'],
  },
  {
    label: 'Liquid Dosage Forms',
    options: [
      'Syrups',
      'Suspensions',
      'Emulsions',
      'Drops - Eye',
      'Drops - Ear',
      'Drops - Nasal',
      'Mouthwash / Gargles',
    ],
  },
  {
    label: 'Injectable & Parenteral',
    options: ['Vials', 'Ampoules', 'Pre-filled Syringes', 'IV Infusion Bags'],
  },
  {
    label: 'External / Topical Applications',
    options: [
      'Lotions',
      'Medicated Patches',
      'Sprays',
      'Shampoos - Medicated',
    ],
  },
  {
    label: 'Special Dosage Forms',
    options: [
      'Inhalers - MDI',
      'Inhalers - DPI',
      'Nebulizer Solutions',
      'Suppositories - Rectal',
      'Suppositories - Vaginal',
      'Pessaries',
    ],
  },
];

function Inv() {
  const [medicine, setMedicine] = useState({
    name: '',
    preparation: '',
    category: '',
    pricePerUnit: '',
    unitsAvailable: '',
    expiryDate: '',
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicine((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category) => {
    setMedicine((prev) => ({ ...prev, category }));
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/medicines', medicine);
      alert('Medicine added successfully!');
      setMedicine({
        name: '',
        preparation: '',
        category: '',
        pricePerUnit: '',
        unitsAvailable: '',
        expiryDate: '',
      });
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('Error adding medicine');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add New Medicine
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Medicine Name
          </label>
          <input
            name="name"
            value={medicine.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Preparation */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preparation
          </label>
          <input
            name="preparation"
            value={medicine.preparation}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Custom Category Dropdown */}
        <div ref={dropdownRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            className="w-full border p-2 rounded flex justify-between items-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <span>
              {medicine.category ? medicine.category : 'Select dosage form'}
            </span>
            <svg
              className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                dropdownOpen ? 'transform rotate-180' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded border bg-white shadow-lg">
              {categories.map(({ label, options }) => (
                <div key={label} className="px-3 py-1">
                  <div className="text-xs font-semibold text-gray-500 mb-1 border-b pb-1">
                    {label}
                  </div>
                  {options.map((option) => (
                    <div
                      key={option}
                      onClick={() => handleCategorySelect(option)}
                      className={`cursor-pointer rounded px-2 py-1 hover:bg-blue-100 ${
                        medicine.category === option
                          ? 'bg-blue-200 font-semibold'
                          : ''
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Per Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price Per Unit (BDT)
          </label>
          <input
            type="number"
            name="pricePerUnit"
            value={medicine.pricePerUnit}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Units Available */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Units Available
          </label>
          <input
            type="number"
            name="unitsAvailable"
            value={medicine.unitsAvailable}
            onChange={handleChange}
            required
            min="0"
            step="1"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expiry Date
          </label>
          <input
            type="date"
            name="expiryDate"
            value={medicine.expiryDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Add Medicine
        </button>
      </form>

      <div className="mt-4">
        <Link
          to="/stock"
          className="block w-full bg-green-500 text-white text-center py-2 rounded hover:bg-green-600 transition duration-200"
        >
          View Stock
        </Link>
      </div>
    </div>
  );
}

export default Inv;
