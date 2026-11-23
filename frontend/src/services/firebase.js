// Firebase Client Configuration
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoDummyKeyForCampusConnect001",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "campusconnect-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "campusconnect-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "campusconnect-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

let app = null;
let auth = null;
let firestore = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
} catch (e) {
  console.warn("Firebase client initialization in fallback mode:", e.message);
}

export { app, auth, firestore };

