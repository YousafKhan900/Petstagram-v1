import React from "react";
import "./SearchBar.css";

function SearchBar() {
  return (
    <div className="search-bar-container">
      <form className="search-bar-form">
        <input className="search-box" placeholder="Search" />
        <button className="search-icon">
          <i class="fas fa-search"></i>
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
