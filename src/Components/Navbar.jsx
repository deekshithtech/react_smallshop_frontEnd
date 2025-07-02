// src/Components/Navbar.js
import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/items" className="text-xl font-bold">Store Management</Link>
          <div className="flex space-x-4">
            <Link to="/items" className="px-3 py-2 rounded hover:bg-purple-600 transition">Products</Link>
            <Link to="/inventory" className="px-3 py-2 rounded hover:bg-purple-600 transition">Inventory</Link>
            <Link to="/purchases" className="px-3 py-2 rounded hover:bg-purple-600 transition">Purchases</Link>
            <Link to="/shipping" className="px-3 py-2 rounded hover:bg-purple-600 transition">Shipping</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar