// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjsxcUIEGRcbMHE8RQRLcxC7HfklU9MoI",
  authDomain: "petstagram-16090.firebaseapp.com",
  projectId: "petstagram-16090",
  storageBucket: "petstagram-16090.appspot.com",
  messagingSenderId: "431684970595",
  appId: "1:431684970595:web:21dda2e00d593df8677056",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
