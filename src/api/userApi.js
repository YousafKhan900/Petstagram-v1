import { db, auth, storage } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import Joi from "joi";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

async function createUser(user) {
  const { error } = validateUser(user);
  if (error) {
    throw new Error(error.details[0].message);
  }

  const userExists = await checkUserExists(user);
  if (userExists) {
    throw new Error("User already exists");
  }

  await createUserWithEmailAndPassword(auth, user.email, user.password).catch(
    (error) => {
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Email already in use");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email");
      } else if (error.code === "auth/weak-password") {
        throw new Error("Password is too weak");
      } else {
        throw new Error(error.message);
      }
    }
  );

  const newUser = {
    petName: user.petName,
    userName: user.userName,
    petType: user.petType,
    email: user.email,
    profilePic: "gs://petstagram-16090.appspot.com/placeholder.png",
    bio: "",
    followers: [],
    following: [],
    posts: [],
  };

  await createUserDoc(newUser).catch((error) => {
    throw new Error(error.message);
  });
}

async function getAllUsers() {
  const users = [];
  const usersRef = collection(db, "users");
  const usersSnapshot = await getDocs(usersRef);
  usersSnapshot.forEach((doc) => {
    users.push(doc.data());
  });
  return users;
}

async function editUserBio(username, bio) {
  const userRef = doc(db, "users", username);
  await updateDoc(userRef, {
    bio: bio,
  });
}

async function uploadPost(user, file, caption) {
  const storageRef = ref(storage, "posts/" + user.userName + "/" + file.name);

  await uploadBytesResumable(storageRef, file).catch((error) => {
    throw new Error(error.message);
  });

  console.log("storageRef", storageRef.fullPath);
  console.log("caption", caption);
  console.log("user", user.userName);
  console.log("email", user.email);
  console.log("date", new Date());

  const post = {};

  const userRef = doc(db, "users", user.userName);

  await addDoc(collection(db, "posts"), post)
    .then(async (docRef) => {
      await setDoc(doc(db, "posts", docRef.id), {
        image: storageRef.fullPath,
        caption: caption,
        likes: 0,
        comments: [],
        date: new Date(),
        email: user.email,
        reports: 0,
        user: user.userName,
        id: docRef.id,
      });

      await updateDoc(userRef, {
        posts: arrayUnion("posts/" + docRef.id),
      });
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

async function uploadProfilePic(file, username) {
  const storageRef = ref(storage, "profilePics/" + username);

  await uploadBytes(storageRef, file).catch((error) => {
    throw new Error(error.message);
  });

  const userRef = doc(db, "users", username);
  await updateDoc(userRef, {
    profilePic: storageRef.fullPath,
  });
}

async function deletePost(postId, username) {
  const postRef = doc(db, "posts", postId);
  const userRef = doc(db, "users", username);

  await deleteDoc(postRef);
  await updateDoc(userRef, {
    posts: arrayRemove("posts/" + postId),
  });
}

async function reportPost(postId) {
  const postRef = doc(db, "posts", postId);
  console.log(postRef);

  const post = await getDoc(postRef);

  if (!post.exists()) {
    throw new Error("Post does not exist");
  }

  const postData = post.data();

  if (postData.reports >= 5) {
    await deleteDoc(postRef);
    const userRef = doc(db, "users", postData.user);
    await updateDoc(userRef, {
      posts: arrayRemove("posts/" + postId),
    });
  } else {
    await updateDoc(postRef, {
      reports: increment(1),
    });
  }
}

async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email).catch((error) => {
    throw new Error(error.message);
  });
}

async function loginUser(email, password) {
  await signInWithEmailAndPassword(auth, email, password).catch((error) => {
    throw new Error(error.message);
  });
}

async function followUser(follower, following) {
  const followerRef = doc(db, "users", follower);
  const followingRef = doc(db, "users", following);

  await updateDoc(followerRef, {
    following: arrayUnion(following),
  });

  await updateDoc(followingRef, {
    followers: arrayUnion(follower),
  });
}

async function unfollowUser(follower, following) {
  const followerRef = doc(db, "users", follower);
  const followingRef = doc(db, "users", following);

  await updateDoc(followerRef, {
    following: arrayRemove(following),
  });

  await updateDoc(followingRef, {
    followers: arrayRemove(follower),
  });
}

// function that checks if user exists in firestore database with the same userName value
async function checkUserExists(user) {
  const q = query(
    collection(db, "users"),
    where("userName", "==", user.userName)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.size > 0;
}

// create a document in the user collection with the user object
async function createUserDoc(user) {
  const userRef = doc(db, "users", user.userName);
  await setDoc(userRef, user);
}

function checkUserLoggedIn() {
  return auth.currentUser;
}

async function logoutUser() {
  await auth.signOut();
}

async function getAllPosts() {
  const q = query(collection(db, "posts"));
  const querySnapshot = await getDocs(q);
  const posts = [];
  querySnapshot.forEach((doc) => {
    posts.push(doc.data());
  });
  return posts;
}

async function getUserDataEmail(email) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  const userData = [];
  querySnapshot.forEach((doc) => {
    userData.push(doc.data());
  });
  return userData[0];
}

async function getUserData(userName) {
  const q = query(collection(db, "users"), where("userName", "==", userName));
  const querySnapshot = await getDocs(q);
  const userData = [];
  querySnapshot.forEach((doc) => {
    userData.push(doc.data());
  });
  return userData[0];
}

async function downloadImage(image) {
  const storage = getStorage();
  const imgRef = ref(storage, image);
  const url = await getDownloadURL(imgRef);
  return url;
}

async function commentOnPost(postid, user, comment) {
  const buildComment = `${user}: ${comment}`;
  const postRef = doc(db, "posts", postid);
  await updateDoc(postRef, { comments: arrayUnion(buildComment) });
}

async function likePost(postid) {
  const postRef = doc(db, "posts", postid);
  await updateDoc(postRef, { likes: increment(1) });
}

async function getPostsofUser(userEmail) {
  const q = query(collection(db, "posts"), where("email", "==", userEmail));
  const querySnapshot = await getDocs(q);
  const posts = [];
  querySnapshot.forEach((doc) => {
    posts.push(doc.data());
  });
  return posts;
}

async function getPostsofUserName(userName) {
  const q = query(collection(db, "posts"), where("user", "==", userName));
  const querySnapshot = await getDocs(q);
  const posts = [];
  querySnapshot.forEach((doc) => {
    posts.push(doc.data());
  });
  return posts;
}

async function getPost(ref) {
  const postRef = doc(db, ref);
  const post = await getDoc(postRef);
  console.log(post.data());
  return post.data();
}

async function getPostsOfFollowing(user) {
  const following = user.following;
  const posts = [];
  for (let i = 0; i < following.length; i++) {
    const q = query(collection(db, "posts"), where("user", "==", following[i]));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      posts.push(doc.data());
    });
  }
  return posts;
}

function validateUser(user) {
  const schema = Joi.object({
    petName: Joi.string().min(3).required(),
    userName: Joi.string().min(3).required(),
    petType: Joi.required(),
    email: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
  });
  return schema.validate(user);
}

export {
  createUser,
  loginUser,
  resetPassword,
  checkUserLoggedIn,
  logoutUser,
  getAllPosts,
  getUserData,
  downloadImage,
  commentOnPost,
  likePost,
  getPostsofUser,
  getPostsofUserName,
  getUserDataEmail,
  getPost,
  getPostsOfFollowing,
  followUser,
  unfollowUser,
  uploadProfilePic,
  editUserBio,
  uploadPost,
  getAllUsers,
  deletePost,
  reportPost,
};
