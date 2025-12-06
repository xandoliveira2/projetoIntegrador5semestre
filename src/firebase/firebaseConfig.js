// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKrh4-CUIFoZ55i6-MeB4AkrBPluNlygg",
  authDomain: "projetointegrador5-f0b48.firebaseapp.com",
  projectId: "projetointegrador5-f0b48",
  storageBucket: "projetointegrador5-f0b48.firebasestorage.app",
  messagingSenderId: "144780991733",
  appId: "1:144780991733:web:1b2292ca0d3b91bc4db9bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Firestore & Storage
export const db = getFirestore(app);
export const storage = getStorage(app);
