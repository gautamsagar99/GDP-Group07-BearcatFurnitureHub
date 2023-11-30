// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, query, where, getDocs, orderBy, addDoc, onSnapshot, getDoc, collection, limit, setDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDImz_Cal2rCnBRK9CCXYWSxdPUMQ9JKlw",
  authDomain: "chat-bc324.firebaseapp.com",
  projectId: "chat-bc324",
  storageBucket: "chat-bc324.appspot.com",
  messagingSenderId: "608879652878",
  appId: "1:608879652878:web:a90eb2ee8d1dc4cb838c5f"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDWUmjF-Y5JDvEuCRFooxbFg1gvfDEKKho",
//   authDomain: "chat1-80698.firebaseapp.com",
//   projectId: "chat1-80698",
//   storageBucket: "chat1-80698.appspot.com",
//   messagingSenderId: "664885514244",
//   appId: "1:664885514244:web:322abb52953c7a16ece551",
//   // measurementId: "G-0PPL2W0TMN"
// };

const app = initializeApp(firebaseConfig);
console.log(app);
const db = getFirestore();

export { db, collection, query, where, getDocs, orderBy, addDoc, onSnapshot, getDoc, doc, limit, setDoc };

