import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Shipping = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { cart = [], total = 0 } = state || {};

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare order data for backend
      const orderItems = cart.map(item => ({
        item_id: item.id,
        quantity: item.quantity
      }));

      const orderData = {
        customer: form,
        items: orderItems,
        total
      };

      // Send to backend
      const response = await axios.post('http://localhost:8000/api/purchases/', orderData);
      
      if (response.data.success) {
        alert('✅ Order Placed Successfully!');
        navigate('/items', { state: { success: true } });
      } else {
        throw new Error(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Shipping Information</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          ❌ Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border p-4 rounded-lg shadow-md">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring-purple-500 focus:border-purple-500"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring-purple-500 focus:border-purple-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring-purple-500 focus:border-purple-500"
          required
        />

        <textarea
          name="address"
          placeholder="Shipping Address"
          value={form.address}
          onChange={handleChange}
          rows={3}
          className="w-full border px-3 py-2 rounded focus:ring-purple-500 focus:border-purple-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Processing...' : `Place Order (Rs. ${total})`}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🛒 Order Summary</h2>
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 border rounded p-3 bg-white shadow-sm">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-contain bg-gray-100 rounded border"
              />
              <div className="flex-1">
                <h3 className="text-md font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  Quantity: <span className="font-medium">{item.quantity}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Unit Price: Rs. {item.price}
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  Total: Rs. {item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-lg text-gray-800 border-t pt-4">
            Grand Total: Rs. {total}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;