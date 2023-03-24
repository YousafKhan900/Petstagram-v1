import React from "react";
import "../../css/App.css";
import Footer from "../Footer";
import LoginSection from "../LoginSection";

export default function Login({ setAlert, setUser }) {
  return (
    <>
      <LoginSection setAlert={setAlert} />
      <Footer />
    </>
  );
}
