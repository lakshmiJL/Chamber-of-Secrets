import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "chamber-of-secrets-502502",
  appId: "1:795318771666:web:87b277b067d2eac4d2720b",
  apiKey: "AIzaSyDKjGsFHqNrsmIc_NwLnNmzrq5eBGRKQNI",
  authDomain: "chamber-of-secrets-502502.firebaseapp.com",
  storageBucket: "chamber-of-secrets-502502.firebasestorage.app",
  messagingSenderId: "795318771666",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-chamberofsecrets-f351b1a6-c0ab-4270-8d62-d1b2b0b3fa6a");
