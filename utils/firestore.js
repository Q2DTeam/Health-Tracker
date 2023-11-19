import { getFirestore, collection, addDoc, setDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { app } from './firebase';

const db = getFirestore(app);

export { 
    db, getFirestore, collection, addDoc, setDoc, doc, getDoc, getDocs
};
