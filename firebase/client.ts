// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDZ10zFOSpAssuPW5r2zxKf_4IlXs_HRo8",
    authDomain: "prepwise-636a6.firebaseapp.com",
    projectId: "prepwise-636a6",
    storageBucket: "prepwise-636a6.firebasestorage.app",
    messagingSenderId: "226393444274",
    appId: "1:226393444274:web:a2ee0f0bd98cccd1d15eab",
    measurementId: "G-5FFD5X6CN5"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);