import React, { useEffect, useRef, useState } from "react";
import "../css/SearchBar.css";
import { getAllUsers } from "../api/userApi";
import { useNavigate } from "react-router-dom";

function SearchBar({ setAlert }) {
  const [userSuggestions, setUserSuggestions] = useState([]);

  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  const inputRef = useRef(null);

  const handleSearch = () => {
    let selectedValue = inputRef.current.value;
    if (selectedValue === "") {
      setAlert({
        type: "Warning",
        message: "Please enter a username",
      });
      return;
    } else if (!userSuggestions.includes(selectedValue)) {
      setAlert({
        type: "Warning",
        message: "User does not exist",
      });
      return;
    }
    navigate("/profile/" + selectedValue);
    inputRef.current.value = "";
    setSuggestions([]);
  };

  const handleSelection = (e) => {
    inputRef.current.value = e.target.innerText;
  };

  const handleKeyUp = (e) => {
    let input = e.target.value;
    let emptyArray = [];
    if (input) {
      emptyArray = userSuggestions.filter((data) => {
        return data.toLowerCase().startsWith(input.toLowerCase());
      });
    }
    setSuggestions(emptyArray);
  };

  useEffect(() => {
    getAllUsers().then((users) => {
      let usersArray = [];
      for (let i = 0; i < users.length; i++) {
        usersArray.push(users[i].userName);
      }
      setUserSuggestions(usersArray);
    });
  }, []);

  return (
    <div className="search-bar-container">
      <div className="search-input">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onKeyUp={handleKeyUp}
        />
        <div
          className="autocom-box"
          style={{ display: suggestions.length === 0 ? "none" : "block" }}
        >
          {suggestions.map((data, index) => {
            return (
              <li key={index} onClick={handleSelection}>
                {data}
              </li>
            );
          })}
        </div>
        <div className="icon" onClick={handleSearch}>
          <i className="fas fa-search"></i>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
