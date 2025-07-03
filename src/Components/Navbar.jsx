// src/Components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeClass =
    "bg-purple-700 rounded px-3 py-2 font-semibold text-white";

  const inactiveClass =
    "px-3 py-2 rounded hover:bg-purple-600 transition text-gray-200";

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <NavLink to="/items" className="text-xl font-bold">
            Store Management
          </NavLink>
          <div className="flex space-x-4">
              <NavLink
              to="/"
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
            >
              Home
            </NavLink>
            <NavLink
              to="/items"
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
            >
              Products
            </NavLink>
            <NavLink
              to="/inventory"
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
            >
              Inventory
            </NavLink>
            <NavLink
              to="/purchases"
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
            >
              Purchases
            </NavLink>
          
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
