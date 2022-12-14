// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { doc, getFirestore, setDoc } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfKVx8EV_9XMWq9atI-zEzO0YCo7M7rgE",
  authDomain: "textit-f95dc.firebaseapp.com",
  projectId: "textit-f95dc",
  storageBucket: "textit-f95dc.appspot.com",
  messagingSenderId: "861353967699",
  appId: "1:861353967699:web:e6a8f16c13ab18af8106a6",
  measurementId: "G-EVVF3RMW37"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);
export const db = getFirestore();
const analytics = getAnalytics(app);