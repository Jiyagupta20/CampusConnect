import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isFirebaseConnected = false;
let db = null;
let auth = null;

try {
  // Check if service account file exists or env vars are set
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : path.resolve(__dirname, 'serviceAccountKey.json');

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    auth = admin.auth();
    isFirebaseConnected = true;
    console.log('✅ Firebase Admin SDK initialized successfully with Service Account Key');
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    db = admin.firestore();
    auth = admin.auth();
    isFirebaseConnected = true;
    console.log('✅ Firebase Admin SDK initialized successfully with environment variables');
  } else {
    console.log('ℹ️ Firebase credentials not provided. Using high-fidelity persistent local JSON database (Hackathon Ready Mode).');
  }
} catch (error) {
  console.warn('⚠️ Firebase initialization skipped or failed:', error.message);
  console.log('ℹ️ Running in resilient fallback mode with local persistent storage.');
}

export { admin, db, auth, isFirebaseConnected };

