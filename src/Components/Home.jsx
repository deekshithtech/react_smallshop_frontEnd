import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === 'customer') {
      navigate('/purchases');
    } else if (role === 'shop') {
      navigate('/items');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-green-500 bg-opacity-90 rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-white mb-8">
          Welcome! Who are you?
        </h1>
        <div className="flex flex-col space-y-6">
          <button
            onClick={() => handleRoleSelection('customer')}
            className="py-3 rounded-xl bg-blue-600 text-white text-xl font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Customer
          </button>
          <button
            onClick={() => handleRoleSelection('shop')}
            className="py-3 rounded-xl bg-green-600 text-white text-xl font-semibold shadow-md hover:bg-green-700 transition"
          >
            Shop Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
