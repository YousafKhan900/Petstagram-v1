import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/userApi";

function SignUpSection({ setAlert }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [petName, setPetName] = useState("");
  const [userName, setUserName] = useState("");
  const [petType, setPetType] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
      petName,
      userName,
      petType,
    };

    await createUser(user)
      .then(() => {
        setAlert({
          type: "Success",
          message: "User created successfully",
        });
        navigate("/feed");
      })
      .catch((error) => {
        setAlert({
          type: "Error",
          message: error.message,
        });
      });
  };

  return (
    <div className="bg-hero bg-cover bg-no-repeat bg-center h-screen flex flex-col justify-center items-center">
      <h1 className="text-white md:text-7xl text-5xl">Sign Up to Petstagram</h1>
      <form className="mt-10 flex flex-col">
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="pet_name"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Pet Name
            </label>
            <input
              type="text"
              id="pet_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              onInput={(e) => {
                setPetName(e.target.value);
              }}
              required
            />
          </div>
          <div>
            <label
              htmlFor="user_name"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="user_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              onInput={(e) => {
                setUserName(e.target.value);
              }}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="pet-type"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Pet Type
            </label>
            <select
              id="pet-type"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              onInput={(e) => {
                setPetType(e.target.value);
              }}
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="fish">Fish</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="email"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              onInput={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="password"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
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
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-10 text-white text-lg bg-transparent border border-white rounded-sm hover:bg-white hover:text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium w-full sm:w-auto px-5 py-2.5 text-center transition-all duration-300 ease-in-out"
          onClick={handleSignup}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUpSection;
