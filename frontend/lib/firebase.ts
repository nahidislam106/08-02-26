import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmW06wJdvxm4D9_KI0dBwPPmlmwW3Sveo",
  authDomain: "spectral-fe683.firebaseapp.com",
  databaseURL: "https://spectral-fe683-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "spectral-fe683",
  storageBucket: "spectral-fe683.firebasestorage.app",
  messagingSenderId: "925639342889",
  appId: "1:925639342889:web:ff6b2abb169be497a11538",
  measurementId: "G-6ZKF1355D2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getDatabase(app);
