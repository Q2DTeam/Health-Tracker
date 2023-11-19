// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { setPersistence, initializeAuth, getReactNativePersistence, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactNativeAsyncStorage } from "firebase/auth";


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
// const app = initializeApp(firebaseConfig);
// const auth = getAuth();
let app, auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (error) {
    console.log('Error initializing app: ' + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

export { 
  app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile
};