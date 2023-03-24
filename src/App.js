import "./css/App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Profile from "./components/pages/Profile";
import PostPage from "./components/pages/PostPage";
import SignUp from "./components/pages/SignUp";
import Login from "./components/pages/Login";
import Alert from "./components/Alert";
import Feed from "./components/pages/Feed";
import { useState } from "react";

function App() {
  const [alert, setAlert] = useState(null);

  return (
    <>
      <Router>
        <Navbar setAlert={setAlert} />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route
            path="/profile/:username"
            exact
            element={<Profile setAlert={setAlert} />}
          />
          <Route
            path="/post"
            exact
            element={<PostPage setAlert={setAlert} />}
          />
          <Route
            path="/sign-up"
            exact
            element={<SignUp setAlert={setAlert} />}
          />
          <Route path="/login" exact element={<Login setAlert={setAlert} />} />
          <Route path="/feed" exact element={<Feed setAlert={setAlert} />} />
        </Routes>
      </Router>
      {alert ? <Alert {...alert} deleteAlert={() => setAlert(null)} /> : null}
    </>
  );
}

export default App;
