import React, { useEffect, useState } from "react";
import { getUserDataEmail, uploadPost } from "../../api/userApi";
import "../../css/App.css";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

export default function PostPage({ setAlert }) {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [caption, setCaption] = useState("");

  const handlePost = async () => {
    await uploadPost(user, image, caption)
      .then(
        setAlert({
          type: "Success",
          message: "Post uploaded successfully",
        }),
        navigate("/profile/" + user.userName)
      )
      .catch((error) => {
        setAlert({
          type: "Error",
          message: "An error occurred while uploading the post",
        });
        console.log(error);
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, async function (user) {
      if (!user) {
        setAlert({
          type: "Warning",
          message: "User is not logged in",
        });
        navigate("/");
      } else {
        const userData = await getUserDataEmail(user.email);
        setUser(userData);
      }
    });
  }, [setAlert, navigate]);
  return (
    <div>
      <h1 className="pt-6 text-4xl text-center">Post On Petstagram</h1>
      <h3 className="mt-4 text-center text-primary">
        remember, only posts related to your pet!
      </h3>
      <div className=" mt-4 flex flex-col justify-center items-center p-3">
        <div className="flex sm:w-1/3 w-full aspect-square relative border border-black rounded-sm justify-center items-center hover:bg-gray-300">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
          <p className="">Choose a Photo</p>
          {image ? (
            <img
              className="absolute object-cover h-full w-full"
              src={URL.createObjectURL(image)}
              alt="post"
            />
          ) : null}
        </div>
        <div className="flex flex-col justify-center items-center mt-4 sm:w-1/2 w-full">
          <input
            className="border border-black rounded-sm p-1 w-full bg-transparent"
            placeholder="Caption"
            onChange={(e) => {
              setCaption(e.target.value);
            }}
          />
          <button
            className="text-black text-md bg-transparent border border-black rounded-sm hover:bg-primary 
          hover:text-white w-full px-2 py-1 my-5 text-center transition-all duration-300 ease-in-out"
            onClick={handlePost}
          >
            Upload Image
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
