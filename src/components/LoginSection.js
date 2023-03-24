import React, { useState } from "react";
import { loginUser, resetPassword } from "../api/userApi";
import { useNavigate } from "react-router-dom";

function LoginSection({ setAlert }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleForgotPassword() {
    if (email === "") {
      setAlert({ type: "Error", message: "Please enter your email" });
      return;
    }
    await resetPassword(email)
      .then(() => {
        setAlert({ type: "Success", message: "Password reset email sent" });
      })
      .catch((error) => {
        setAlert({ type: "Error", message: error.message });
      });
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    await loginUser(email, password)
      .then(() => {
        navigate("/feed");
        setAlert({ type: "Success", message: "Logged in successfully" });
      })
      .catch((error) => {
        setAlert({ type: "Error", message: "Invalid email or password" });
      });
  };

  return (
    <div className="bg-hero bg-cover bg-no-repeat bg-center h-screen flex flex-col justify-center items-center">
      <h1 className="text-white md:text-7xl text-5xl">Log in</h1>
      <form className="mt-10 flex flex-col min-w-full">
        <div className="flex flex-col items-center min-w-full">
          <div className="flex flex-col w-1/2">
            <label
              htmlFor="email"
              className="block mb-2 text-md font-medium text-white self-center"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              onInput={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="pet@petstagram.ie"
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label
              htmlFor="password"
              className="block mb-2 mt-2 text-md font-medium text-white self-center "
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              onInput={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        </div>
        <div
          className="self-center mt-3 cursor-pointer underline text-gray-800"
          onClick={handleForgotPassword}
        >
          Forgot Password
        </div>
        <button
          type="submit"
          className="mt-10 text-white text-lg bg-transparent border border-white rounded-sm hover:bg-white hover:text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium w-1/2 self-center px-5 py-2.5 text-center transition-all duration-300 ease-in-out"
          onClick={handleLogin}
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginSection;
