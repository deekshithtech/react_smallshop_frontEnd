import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaMinus, FaStar, FaCheck, FaTrash, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Purchases = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [addedItem, setAddedItem] = useState(null); // success message

  useEffect(() => {
    axios.get("http://localhost:8000/api/items/") // Update as needed
      .then(res => {
        if (res.data.success === "true") {
          const formatted = res.data.data.map(item => ({
            id: item.item_id,
            name: item.name,
            price: item.price,
            stock: item.inventory?.quantity || 0,
            image: `https://via.placeholder.com/200x200.png?text=${item.name}`,
            originalPrice: item.price + 100,
            rating: 4.3,
            reviews: 10
          }));
          setItems(formatted);
        }
      })
      .catch(err => console.error("Failed to fetch items:", err));
  }, []);

  const handleAddToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (!existing) {
      if (item.stock > 0) {
        setCart([...cart, { id: item.id, quantity: 1 }]);
        setAddedItem(item.name); // show success
        setTimeout(() => setAddedItem(null), 2000);
      } else {
        alert("Stock not available");
      }
    } else if (existing.quantity < item.stock) {
      setCart(cart.map(c =>
        c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
      setAddedItem(item.name); // show success
      setTimeout(() => setAddedItem(null), 2000);
    } else {
      alert("Stock not available");
    }
  };

  const handleQuantity = (id, type) => {
    setCart(prevCart =>
      prevCart.map(cartItem => {
        const matchedItem = items.find(i => i.id === id);
        const stock = matchedItem?.stock || 0;

        if (cartItem.id === id) {
          if (type === 'inc') {
            if (cartItem.quantity >= stock) {
              alert("Stock not available");
              return cartItem;
            }
            return { ...cartItem, quantity: cartItem.quantity + 1 };
          } else {
            return {
              ...cartItem,
              quantity: cartItem.quantity > 1 ? cartItem.quantity - 1 : 1
            };
          }
        }
        return cartItem;
      })
    );
  };

  const handleRemoveItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleRemoveAll = () => {
    setCart([]);
  };

  const isInCart = (id) => cart.some(c => c.id === id);
  const getQuantity = (id) => cart.find(c => c.id === id)?.quantity || 0;

  const getDiscountPercent = (price, original) => {
    return Math.round(((original - price) / original) * 100);
  };

  const getTotal = () => {
    return cart.reduce((sum, c) => {
      const item = items.find(i => i.id === c.id);
      return sum + item.price * c.quantity;
    }, 0);
  };

  return (
    <div className="container mx-auto px-2 py-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Available Products</h1>

      {/* ✅ Success Message */}
      {addedItem && (
        <div className="mb-4 px-3 py-2 bg-green-100 text-green-800 rounded shadow text-sm">
          ✅ {addedItem} added to cart!
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white shadow border rounded-lg overflow-hidden hover:shadow-md transition">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-contain bg-gray-50"
            />
            <div className="p-3">
              <h3 className="font-semibold text-sm mb-1 text-gray-800 truncate">{item.name}</h3>
              <p className="text-xs text-gray-600">
                Rs. <span className="font-semibold text-black">{item.price}</span>{' '}
                <span className="line-through text-xs">Rs. {item.originalPrice}</span>{' '}
                <span className="text-red-500 text-xs">
                  ({getDiscountPercent(item.price, item.originalPrice)}% OFF)
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Available: <span className="font-semibold">{item.stock}</span> in stock
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-yellow-500 flex items-center gap-1">
                  <FaStar className="text-yellow-400" /> {item.rating} ({item.reviews})
                </span>
                {item.stock <= 5 && item.stock > 0 && (
                  <span className="text-red-500 text-xs font-semibold">Few Left</span>
                )}
                {item.stock === 0 && (
                  <span className="text-red-600 text-xs font-semibold">Out of Stock</span>
                )}
              </div>

              {isInCart(item.id) ? (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <button
                      className="bg-gray-200 text-sm px-2 py-1 rounded hover:bg-gray-300"
                      onClick={() => handleQuantity(item.id, 'dec')}
                    >
                      <FaMinus />
                    </button>
                    <span className="text-sm font-medium">{getQuantity(item.id)}</span>
                    <button
                      className={`text-sm px-2 py-1 rounded ${
                        getQuantity(item.id) >= item.stock
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                      onClick={() => handleQuantity(item.id, 'inc')}
                      disabled={getQuantity(item.id) >= item.stock}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="w-full text-sm py-1 rounded flex items-center justify-center gap-1 bg-red-500 text-white hover:bg-red-600"
                  >
                    <FaTimes /> Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(item)}
                  className={`w-full mt-3 text-sm py-1 rounded flex items-center justify-center gap-1 ${
                    item.stock > 0
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                  disabled={item.stock === 0}
                >
                  <FaCheck /> {item.stock > 0 ? 'Add' : 'Out of Stock'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg border rounded-lg px-4 py-3 z-50">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-700">
              {cart.length} items selected | Total: <span className="font-semibold">Rs. {getTotal()}</span>
            </div>
            <button 
              onClick={handleRemoveAll}
              className="text-red-500 hover:text-red-700 ml-2"
              title="Remove all items"
            >
              <FaTrash />
            </button>
          </div>
          <button className="w-full bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm">
<Link 
  to="/shipping" 
  state={{ cart: cart, total: getTotal() }}
  className="w-full bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm block text-center"
>
  Purchase Now
</Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default Purchases;