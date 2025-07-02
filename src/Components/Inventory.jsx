import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaBoxOpen } from 'react-icons/fa';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/inventory/');
      setInventory(res.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  const handleEdit = (inv) => {
    setEditingId(inv.inventory_id);
    setNewQuantity(String(inv.quantity));
  };

  const handleUpdate = async (id) => {
    if (newQuantity === '' || isNaN(newQuantity) || !Number.isInteger(Number(newQuantity))) {
      alert("Please enter a valid whole number.");
      return;
    }

    try {
      await axios.patch(`http://localhost:8000/api/inventory/${id}`, {
        quantity: parseInt(newQuantity, 10),
      });
      setEditingId(null);
      setNewQuantity('');
      fetchInventory();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const getStockStatus = (quantity) => (quantity <= 0 ? 'Out of Stock' : 'In Stock');

  const getStatusColor = (status) =>
    status === 'Out of Stock' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Inventory Management</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-sm  font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-sm  font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.length > 0 ? (
                inventory.map((inv) => {
                  const status = getStockStatus(inv.quantity);
                  const colorClass = getStatusColor(status);
                  return (
                    <tr key={inv.inventory_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {inv.item?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorClass}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === inv.inventory_id ? (
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={newQuantity}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value)) {
                                setNewQuantity(value);
                              }
                            }}
                            className="border px-2 py-1 w-20"
                          />
                        ) : (
                          inv.quantity
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === inv.inventory_id ? (
                          <button
                            onClick={() => handleUpdate(inv.inventory_id)}
                            className={`px-3 py-1 rounded text-white ${
                              newQuantity === '' || isNaN(newQuantity)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 cursor-pointer'
                            }`}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(inv)}
                            className="text-purple-600 hover:text-purple-900 cursor-pointer"
                          >
                            <FaEdit />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center px-6 py-8 text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <FaBoxOpen className="text-3xl mb-2" />
                      No inventory data found.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
