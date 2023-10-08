// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3OkXxf0_yofKk-Hz_ikWa8iZpTEOOcrQ",
  authDomain: "coloring-website-340b7.firebaseapp.com",
  projectId: "coloring-website-340b7",
  storageBucket: "coloring-website-340b7.appspot.com",
  messagingSenderId: "157229327028",
  appId: "1:157229327028:web:7acb369fa17c33b39d6de1",
  measurementId: "G-D0N0HH689D",
};

// Initialize Firebase
let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// firebase storage
export const storage = getStorage(firebase_app);

export default firebase_app;
