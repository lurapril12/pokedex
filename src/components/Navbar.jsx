import { useState } from 'react';
import logo from '../assets/logo.png';

const Navbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-700">
      <div className="flex items-center">
        <img
          src={logo}
          alt="Pokemon Logo"
          className="h-20 w-40 mr-2"
        />
      </div>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mx-auto p-2 rounded-full border-none"
        />
      </div>
    </div>
  );
};

export default Navbar;