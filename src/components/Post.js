import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkUserLoggedIn,
  commentOnPost,
  downloadImage,
  getUserData,
  likePost,
  reportPost,
} from "../api/userApi";

function Post({ post, setAlert }) {
  const [likes, setLikes] = useState(post.likes);
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleLike = async () => {
    await likePost(post.id)
      .then((likes) => {
        setLikes(likes);
      })
      .catch((error) => {
        console.log(error);
      });
    setLikes(likes + 1);
  };

  const handleComment = async (e) => {
    const comment = e.target.value;
    const currentUser = await checkUserLoggedIn();
    if (!currentUser) {
      setAlert({
        type: "Warning",
        message: "You need to log in",
      });
      return;
    }
    await commentOnPost(post.id, user.userName, comment);
    setComments([...comments, `${user.userName}: ${comment}`]);
    e.target.value = "";
  };

  const handleReport = async () => {
    console.log("post id: ", post.id);
    await reportPost(post.id);
    setAlert({
      type: "Warning",
      message: "Post reported",
    });
  };

  useEffect(() => {
    const getPostData = async () => {
      const user = await getUserData(post.user);
      setUser(user);
      const url = await downloadImage(user.profilePic);
      setProfilePic(url);
      const postUrl = await downloadImage(post.image);
      setPostImage(postUrl);
      setLoading(false);
    };

    getPostData().catch((error) => {
      console.log(error);
    });

    setComments(post.comments);
  }, [post]);

  if (loading) {
    return <></>;
  } else {
    return (
      <div className="flex flex-col justify-center items-center mb-2 border rounded-md w-full sm:w-2/6 overflow-hidden shadow-lg">
        <div className="flex flex-row justify-between items-center w-full p-3 text-white bg-primary">
          <div
            className="flex flex-row items-center cursor-pointer"
            onClick={() => {
              navigate("/profile/" + user.userName);
            }}
          >
            <img
              className="rounded-full h-10 w-10 object-cover"
              src={profilePic}
              alt="profile pic"
            />
            <p className="ml-2">{user.userName}</p>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center w-full">
          <img
            src={postImage}
            alt="post pic"
            className="w-full object-cover max-h-130"
          />
        </div>
        <div className="flex flex-col justify-center items-center w-full p-4 text-black">
          <div className="flex flex-row justify-between items-center w-full text-2xl">
            <div className="flex flex-row items-center">
              <i
                className="fa-solid fa-heart text-primary hover:text-black"
                onClick={handleLike}
              />
              <i
                className="fa-solid fa-comment text-primary hover:text-black pl-4"
                onClick={() => {
                  setShowComments(!showComments);
                }}
              />
              <p className="pl-4 text-sm">{likes} likes</p>
            </div>

            <i
              className="fa fa-exclamation-circle text-primary hover:text-black"
              onClick={handleReport}
            />
          </div>
          <div className="flex justify-start w-full p-2 overflow-hidden mr-1 mt-1">
            {post.caption}
          </div>
          <div
            className={`${
              showComments ? "flex" : "hidden"
            } flex-col justify-start overflow-hidden w-full p-2 text-sm`}
          >
            {comments.map((comment) => {
              return <div>{comment}</div>;
            })}
          </div>
          <input
            className="mt-3 border rounded-md w-full text-sm p-1"
            placeholder="leave a comment..."
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleComment(e);
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default Post;
