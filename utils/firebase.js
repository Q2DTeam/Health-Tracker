// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";

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
const db = getFirestore(app);
const auth = getAuth();

export { 
  app, db, getFirestore, collection, addDoc, getDoc, setDoc, doc, getDocs,
  auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile,
};