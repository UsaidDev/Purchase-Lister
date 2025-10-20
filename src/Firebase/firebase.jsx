// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFyTZXbyFAGCIeMYv-izE5Ch-W33AIV34",
  authDomain: "purchase-lister.firebaseapp.com",
  projectId: "purchase-lister",
  storageBucket: "purchase-lister.appspot.com",
  messagingSenderId: "286311318095",
  appId: "1:286311318095:web:98cd1d856b0709799d203a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);