
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {getAuth, GoogleAuthProvider} from  "firebase/auth";
import {getFirestore} from "firebase/firestore";

import {getStorage} from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBRUwc8sfLZGND0V9ucwVFDMY_rv_c3uas",
  authDomain: "learn-firebase-5d16a.firebaseapp.com",
  projectId: "learn-firebase-5d16a",
  storageBucket: "learn-firebase-5d16a.appspot.com",
  messagingSenderId: "24843431112",
  appId: "1:24843431112:web:0b4852cafbaf0b57e409fd",
  measurementId: "G-SR0K9DCBDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

export const storage = getStorage(app);