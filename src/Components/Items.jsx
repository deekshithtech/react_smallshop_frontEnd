import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Items = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const categories = ['Electronics', 'Clothing', 'Groceries', 'Home', 'Other'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/items/');
      if (res.data.success) {
        setItems(res.data.data);
        setFilteredItems(res.data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    const results = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(results);
  }, [searchTerm, items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
      quantity: 10
    };

    try {
      if (editingId) {
        const res = await axios.patch(`http://localhost:8000/api/items/${editingId}`, payload);
        if (res.data.success) {
          fetchItems();
        }
      } else {
        const res = await axios.post('http://localhost:8000/api/items/', payload);
        if (res.data.success) {
          fetchItems();
        }
      }

      setFormData({ name: '', description: '', price: '', category: 'Electronics', image: '' });
      setPreviewImage('');
      setEditingId(null);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image || ''
    });
    setEditingId(item.item_id);
    setPreviewImage(item.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

const handleDelete = async (id) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this item?');
  if (!confirmDelete) return;

  try {
    const res = await axios.delete(`http://localhost:8000/api/items/${id}`);
    if (res.status === 204 || res.data?.success) {
      setItems(prevItems => prevItems.filter(item => item.item_id !== id));
      setFilteredItems(prevItems => prevItems.filter(item => item.item_id !== id));
    } else {
      alert('Failed to delete the item!');
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Something went wrong while deleting.');
  }
};


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-200 rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Product Add by Shop Owner</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
          />
        </div>

        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-purple-700 mb-4">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg bg-blue-100"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg bg-white"
                    required
                    step="0.01"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg bg-white"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image (local preview only)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-50 bg-white"
                  />
                  {previewImage && (
                    <img src={previewImage} alt="Preview" className="mt-2 h-20 w-20 object-cover border rounded" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.item_id} className="bg-white border rounded-lg shadow p-4">
              <div className="h-40 flex items-center justify-center bg-gray-100 mb-4">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-purple-700 font-bold">${item.price.toFixed(2)}</span>
                <span className="bg-gray-200 text-xs px-2 py-1 rounded">{item.category}</span>
              </div>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-purple-600 hover:text-purple-900"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(item.item_id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Items;
