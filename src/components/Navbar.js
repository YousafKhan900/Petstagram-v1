import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import SearchBar from "./SearchBar";
import "../css/Navbar.css";
import { getUserDataEmail, logoutUser } from "../api/userApi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function Navbar({ setAlert }) {
  const [user, setUser] = useState(null);
  //useState outputs a variable with a state(state of click being false in this case)
  //and outputs a function to change the state setClick
  const [click, setClick] = useState(false);
  const [UI, setUI] = useState(true);

  const handleLogout = async () => {
    await logoutUser();
    if (user) {
      setAlert({
        type: "Success",
        message: "User logged out successfully",
      });
    }
    setUser(null);
  };

  //handleClick is a function that sets click state to the opposite of what it was
  const handleClick = () => setClick(!click);
  //closeMobileMenu is a function to set click state to false, used to close the mobile menu when an item is clicked
  const closeMobileMenu = () => setClick(false);
  //function to show and hide the menu button when the screen width is changed
  const showUI = () => {
    if (window.innerWidth <= 960) {
      setUI(false);
    } else {
      setUI(true);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserDataEmail(user.email).then((userData) => {
          setUser(userData);
        });
      } else {
      }
    });
    showUI();
  }, []);

  window.addEventListener("resize", showUI);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <i className="fa-solid fa-dog" style={{ paddingRight: "5px" }} />{" "}
            {UI && <>Petstagram</>}
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/feed" className="nav-links" onClick={closeMobileMenu}>
                Feed
              </Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link
                    to={"/profile/" + user.userName}
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/post"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Post
                  </Link>
                </li>
              </>
            ) : (
              <></>
            )}
            {/* <li className="nav-item">
              <Link
                to="/profile"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/signup"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Post
              </Link>
            </li> */}
            <li>
              <Link
                to="/login"
                className="nav-links-mobile"
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
              >
                {user ? <>Logout</> : <>Login</>}
              </Link>
            </li>
          </ul>
          {user ? (
            <div className="search-bar-wrapper">
              <SearchBar setAlert={setAlert} />
            </div>
          ) : (
            <></>
          )}

          {UI && (
            <Button
              buttonStyle="btn--outline"
              to="/login"
              onClick={handleLogout}
            >
              {user ? <>Logout</> : <>Login</>}
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
