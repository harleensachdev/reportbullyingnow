
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-243ff.firebaseapp.com",
  projectId: "reactchat-243ff",
  storageBucket: "reactchat-243ff.appspot.com",
  messagingSenderId: "152019586738",
  appId: "1:152019586738:web:5b28c2c4d64b6a826d43ab"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()