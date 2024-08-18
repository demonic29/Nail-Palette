// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth'; 
// import 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrmaIj8MR8tqP7ux3YommTs8lAYK33RHk",
  authDomain: "nailpalette-46f78.firebaseapp.com",
  projectId: "nailpalette-46f78",
  storageBucket: "nailpalette-46f78.appspot.com",
  messagingSenderId: "257855557694",
  appId: "1:257855557694:web:78387ae2343a714384016f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // Initialize and export Firebase Authentication