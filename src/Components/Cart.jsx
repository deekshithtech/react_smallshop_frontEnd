import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const { state } = useLocation();
  const customerId = state?.customerId;

  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/purchases/${customerId}`);
        setOrders(res.data);

        const totalAmount = res.data.reduce((sum, item) => sum + item.total_price, 0);
        setTotal(totalAmount);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.detail || 'Failed to fetch orders');
      }
    };

    if (customerId) fetchOrders();
  }, [customerId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">🛒 Your Order Summary</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {orders.length === 0 && !error ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((item, idx) => (
            <div key={idx} className="border rounded p-4 bg-white shadow-md">
              <h2 className="text-lg font-semibold text-gray-800">{item.item_name}</h2>
              <p className="text-sm text-gray-600">{item.item_description}</p>
              <p>Quantity: <span className="font-medium">{item.quantity}</span></p>
              <p>Total Price: ₹<span className="font-semibold">{item.total_price}</span></p>
              <p className="text-sm text-gray-500">Ordered At: {item.ordered_at}</p>
            </div>
          ))}

          <div className="text-right text-xl font-bold text-purple-800 border-t pt-4">
            Grand Total: ₹{total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
