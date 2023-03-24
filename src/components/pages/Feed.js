import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import Post from "../Post";
import {
  getAllPosts,
  getPostsOfFollowing,
  getUserDataEmail,
} from "../../api/userApi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

function Feed({ setAlert }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, function (user) {
      if (!user) {
        setAlert({
          type: "Warning",
          message: "User is not logged in",
        });
        getAllPosts()
          .then((posts) => {
            setPosts(posts);
          })
          .catch((error) => {
            setAlert({
              type: "Error",
              message: error.message,
            });
          });
      } else {
        const setUserPosts = async () => {
          const userData = await getUserDataEmail(user.email);
          const posts = await getPostsOfFollowing(userData);
          setPosts(posts);
        };

        setUserPosts().catch((error) => {
          setAlert({
            type: "Error",
            message: error.message,
          });
        });
      }
    });
  }, [setAlert]);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        {posts.map((post, index) => {
          return <Post key={index} post={post} setAlert={setAlert} />;
        })}
        <p className="mt-3 mb-5 text-lg">There are no more recent posts.</p>
      </div>
      <Footer />
    </>
  );
}

export default Feed;
