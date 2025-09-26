import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Firestore is no longer used, so the import is removed.

const firebaseConfig = {
  "projectId": "studio-839078640-3ea2f",
  "appId": "1:611703974793:web:969205538582d0e7458f58",
  "apiKey": "AIzaSyCoQU_1kJC1bKkvhEVkCZ6TsYMKlM9Muy4",
  "authDomain": "studio-839078640-3ea2f.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "611703974793"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
// The db export is removed as Firestore is no longer in use.

export { app, auth };
