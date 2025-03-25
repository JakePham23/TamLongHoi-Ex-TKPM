import React from "react";
import { FaSearch } from "react-icons/fa";
import "../styles/components/SearchInput.scss"; // File CSS riêng cho search input

const SearchInput = ({ placeholder, onChange }) => {
  return (
    <div className="search-input">
      <FaSearch className="search-icon" />
      <input type="text" placeholder={placeholder} onChange={onChange} />
    </div>
  );
};

export default SearchInput;
