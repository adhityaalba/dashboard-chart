// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4 text-xl font-bold">
        <img src="https://dibuiltadi.com/assets/img/DIBUILTADI.png" alt="" />
      </div>
      <ul className="mt-4">
        <li className="p-2 hover:bg-gray-700">
          <NavLink to="/dashboard" className="block" activeClassName="bg-gray-700">
            Dashboard
          </NavLink>
        </li>
        <li className="p-2 hover:bg-gray-700">
          <NavLink to="/account" className="block" activeClassName="bg-gray-700">
            Account
          </NavLink>
        </li>
        <li className="p-2 hover:bg-gray-700">
          <NavLink to="/coupon" className="block" activeClassName="bg-gray-700">
            Coupon
          </NavLink>
        </li>
        <li className="p-2 hover:bg-gray-700">
          <NavLink to="/order" className="block" activeClassName="bg-gray-700">
            Order
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
