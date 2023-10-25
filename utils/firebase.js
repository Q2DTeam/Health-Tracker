// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7SO41j-p4__gGPt3EZeLj4512A1-43nE",
  authDomain: "health-tracker-2f82c.firebaseapp.com",
  projectId: "health-tracker-2f82c",
  storageBucket: "health-tracker-2f82c.appspot.com",
  messagingSenderId: "841999811278",
  appId: "1:841999811278:web:b19a57ad049e1be3b0869f",
  measurementId: "G-0R3CY9947K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);