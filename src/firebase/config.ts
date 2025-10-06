// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7-qF36jrhI70ATCqKawve879C8pYlna8",
  authDomain: "dummy-63716.firebaseapp.com",
  projectId: "dummy-63716",
  storageBucket: "dummy-63716.firebasestorage.app",
  messagingSenderId: "218747736059",
  appId: "1:218747736059:web:7d583c08a31fd79c0e455e"
};

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db };