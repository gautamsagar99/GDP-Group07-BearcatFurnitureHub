// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, orderBy, addDoc, onSnapshot, getDoc, doc, limit, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDImz_Cal2rCnBRK9CCXYWSxdPUMQ9JKlw",
  authDomain: "chat-bc324.firebaseapp.com",
  projectId: "chat-bc324",
  storageBucket: "chat-bc324.appspot.com",
  messagingSenderId: "608879652878",
  appId: "1:608879652878:web:a90eb2ee8d1dc4cb838c5f"
};

const app = initializeApp(firebaseConfig);
console.log(app);
const db = getFirestore();

export { db, collection, query, where, getDocs, orderBy, addDoc, onSnapshot, getDoc, doc, limit, setDoc };

