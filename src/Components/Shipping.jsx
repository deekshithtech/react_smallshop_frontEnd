import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OrderSuccessModal from './OrderSuccessModal';

const Shipping = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.cart) {
    navigate('/items');
    return null;
  }

  const { cart = [], total = 0 } = state;

  const [form, setForm] = useState({ name: '', phone: '', address: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderItems = cart.map(item => ({
        item_id: item.id,
        quantity: item.quantity,
        item_name: item.name,
        item_description: item.description,
        total_price: item.price * item.quantity
      }));

      const orderData = { customer: form, items: orderItems, total };

      const response = await axios.post('http://localhost:8000/api/purchases/', orderData);

      if (response.data.success) {
        setOrderDetails({
          customer: form,
          items: cart,
          orderId: response.data.order_id || Date.now().toString(),
          total,
          date: new Date().toLocaleDateString()
        });
        setOrderSuccess(true);
      } else {
        throw new Error(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setOrderSuccess(false);
    navigate('/items', { state: { success: true } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        
        {/* Shipping Form */}
        <div className="backdrop-blur-lg bg-white/30 border border-white/40 shadow-2xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-6">🚚 Shipping Details</h2>

          {error && (
            <p className="text-red-600 bg-red-100 p-2 rounded mb-4 text-sm">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-white/70 backdrop-blur border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-600"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-white/70 backdrop-blur border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-600"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-white/70 backdrop-blur border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-600"
              required
            />
            <textarea
              name="address"
              placeholder="Shipping Address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white/70 backdrop-blur border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-600"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-4 bg-gradient-to-r cursor-pointer from-purple-600 to-purple-400 text-white font-semibold rounded-lg transition transform hover:scale-105 hover:shadow-xl ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Placing Order...' : `Place Order - ₹${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="backdrop-blur-lg bg-white/30 border border-white/40 shadow-2xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">🛒 Order Summary</h2>

          <ul className="space-y-5">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-700">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-600 font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">₹{item.price} each</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-300 mt-6 pt-4">
            <div className="flex justify-between font-semibold text-gray-800 text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Shipping: <strong>FREE</strong></p>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      {orderSuccess && (
        <OrderSuccessModal orderDetails={orderDetails} onClose={closeModal} />
      )}
    </div>
  );
};

export default Shipping;
