// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyDSQMJ6JAY1g1rD09pyC1M-EhbsjK06p4U",
  authDomain: "health-trackr-214d0.firebaseapp.com",
  projectId: "health-trackr-214d0",
  storageBucket: "health-trackr-214d0.appspot.com",
  messagingSenderId: "353638544673",
  appId: "1:353638544673:web:bb12a6e1fa768219e6ba60",
  measurementId: "G-J3GK85J74W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const auth = getAuth();
let auth;
try{
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}
catch(e) {
  auth = getAuth();
}
const db = getFirestore(app);

export { 
  app, db, getFirestore, collection, addDoc, getDoc, setDoc, doc, getDocs,
  auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile,
};