import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "../../css/App.css";
import placeholder from "../../images/placeholder.png";
import Footer from "../Footer";
import {
  downloadImage,
  getPostsofUserName,
  getUserData,
  getUserDataEmail,
  likePost,
  checkUserLoggedIn,
  followUser,
  unfollowUser,
  uploadProfilePic,
  editUserBio,
  deletePost,
} from "../../api/userApi";

export default function Profile({ setAlert }) {
  const username = useParams().username;
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(placeholder);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [bio, setBio] = useState("");

  const changeProfilePic = async (e) => {
    await uploadProfilePic(e.target.files[0], currentUser.userName).catch(
      (error) => {
        setAlert({
          type: "Error",
          message: "There was an error uploading the image",
        });
      }
    );
  };

  const handleDelete = useCallback(
    async (id, user) => {
      await deletePost(id, user)
        .then(
          setAlert({
            type: "Success",
            message: "Post deleted",
          })
        )
        .catch((error) => {
          setAlert({
            type: "Error",
            message: "There was an error deleting the post",
          });
        });
    },
    [setAlert]
  );

  // const handleDelete = (id, user) => {
  //   deletePost(id, user).catch((error) => {
  //     setAlert({
  //       type: "Error",
  //       message: "There was an error deleting the post",
  //     });
  //     console.log(error);
  //     console.log("id: ", id);
  //     console.log("user: ", user);
  //   });
  // };
  const handleEdit = async () => {
    if (edit) {
      await editUserBio(currentUser.userName, bio);
    }
    setEdit(!edit);
  };

  const handleFollow = async () => {
    if (following) {
      await unfollowUser(currentUser.userName, username);
    } else {
      await followUser(currentUser.userName, username);
      console.log("follow");
    }
    setFollowing(!following);
  };

  const handleLike = (id) => {
    likePost(id).catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    const setUserData = async () => {
      const userData = await getUserData(username);
      const image = await downloadImage(userData.profilePic);
      const posts = await getPostsofUserName(username);

      const postItems = [];
      for (let i = 0; i < posts.length; i++) {
        const postId = posts[i].id;
        const postImage = await downloadImage(posts[i].image);
        const postDate = posts[i].date;
        const postItem = {
          id: postId,
          image: postImage,
          date: postDate,
        };
        postItems.push(postItem);
      }

      const currentUser = checkUserLoggedIn();
      const currentUserData = await getUserDataEmail(currentUser.email);

      setCurrentUser(currentUserData);

      if (userData.followers.includes(currentUserData.userName)) {
        setFollowing(true);
        console.log(
          currentUserData.userName,
          "is following",
          userData.userName
        );
      }
      setProfileImage(image);
      setPosts(postItems.sort((obj1, obj2) => obj2.date - obj1.date));
      setUser(userData);
    };

    setUserData().catch((error) => {
      setAlert({
        type: "Error",
        message: error.message,
      });
    });
  }, [username, setAlert, handleDelete]);

  return (
    <>
      {user ? (
        <div className="flex md:flex-row flex-col min-h-fit">
          <div className="flex flex-col md:w-1/3 w-full items-center justify-start px-4 py-8">
            <div className="flex justify-center items-center relative my-2 rounded-full sm:h-40 sm:w-40 h-52 w-52 border-2 border-primary object-cover overflow-hidden">
              <img
                className="object-cover h-full w-full"
                src={profileImage}
                alt="profile pic"
              />
              {username === currentUser.userName ? (
                <input
                  className="absolute h-full opacity-0 hover:cursor-pointer w-full"
                  type="file"
                  onChange={(e) => changeProfilePic(e)}
                />
              ) : null}
            </div>

            <p className="my-2 text-2xl">{username}</p>
            <div className="flex justify-center my-2 w-2/3">
              <div className="pr-3 flex flex-col items-center">
                <p>Followers</p>
                <p>{user.followers.length}</p>
              </div>
              <div className="pl-3 flex flex-col items-center">
                <p>Following</p>
                <p>{user.following.length}</p>
              </div>
            </div>
            <button
              className="text-black text-md bg-transparent border border-black rounded-sm hover:bg-primary hover:text-white w-min px-2 py-1 
          my-2 text-center transition-all duration-300 ease-in-out"
              onClick={
                username === currentUser.userName ? handleEdit : handleFollow
              }
            >
              {username === currentUser.userName
                ? "Edit"
                : following
                ? "Unfollow"
                : "Follow"}
            </button>
            {edit ? (
              <textarea
                rows="3"
                className="block p-2.5 w-1/2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                placeholder="Enter new bio"
                onChange={(e) => {
                  setBio(e.target.value);
                }}
              ></textarea>
            ) : (
              <div className="my-5 w-4/5 text-center">{user.bio}</div>
            )}
          </div>
          <div className="flex flex-col md:w-2/3 w-full items-center justify-start p-4 md:mr-10">
            <p className="text-2xl pt-3">Posts</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full justify-items-center gap-5 mt-8 mb-5">
              {posts.map((post, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-center items-center border border-primary w-full relative object-cover sm:rounded-xl rounded-2xl overflow-hidden"
                  >
                    <img
                      className="aspect-square object-cover w-full"
                      src={post.image}
                      alt="post"
                    />
                    {username === currentUser.userName ? (
                      <i
                        className="fas fa-trash text-white text-9xl md:text-5xl absolute opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out"
                        onClick={() => {
                          handleDelete(post.id, username);
                        }}
                      />
                    ) : (
                      <i
                        className="fas fa-heart text-white text-9xl md:text-5xl absolute opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out"
                        onClick={() => {
                          handleLike(post.id);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">Loading...</div>
      )}

      <Footer />
    </>
  );
}
