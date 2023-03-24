import React from "react";
import "../../css/App.css";
import SignUpSection from "../SignUpSection";
import Footer from "../Footer";

export default function SignUp({ setAlert }) {
  return (
    <>
      <SignUpSection setAlert={setAlert} />
      <Footer />
    </>
  );
}
