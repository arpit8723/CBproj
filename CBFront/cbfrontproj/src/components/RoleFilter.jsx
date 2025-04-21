import React from 'react';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

const RoleFilter = ({ roleFilter, setRoleFilter, filterOpen, setFilterOpen }) => {
  const handleFilterClick = () => {
    setFilterOpen(!filterOpen);
  };
  
  const handleFilterSelect = (value) => {
    setRoleFilter(value);
    setFilterOpen(false);
  };

  return (
    <div className="flex items-center gap-1">
      Role
      <div className="relative inline-block text-left">
        <button
          onClick={handleFilterClick}
          className="inline-flex items-center justify-center text-blue-800 hover:text-blue-600 focus:outline-none transition-colors"
        >
          <FiFilter className="w-4 h-4" />
          <FiChevronDown 
            className={`ml-1 w-3 h-3 transition-transform ${filterOpen ? 'rotate-180' : ''}`}
          />
        </button>
        
        {/* Dropdown menu */}
        <div 
          className={`absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 z-10 ${
            filterOpen
              ? 'transform opacity-100 scale-100'
              : 'transform opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="py-1">
            <button
              onClick={() => handleFilterSelect("")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                roleFilter === "" 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => handleFilterSelect("ADMIN")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                roleFilter === "ADMIN" 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              ADMIN
            </button>
            <button
              onClick={() => handleFilterSelect("CUSTOMER")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                roleFilter === "CUSTOMER" 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              CUSTOMER
            </button>
            <button
              onClick={() => handleFilterSelect("READONLY")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                roleFilter === "READONLY" 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              READONLY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleFilter;