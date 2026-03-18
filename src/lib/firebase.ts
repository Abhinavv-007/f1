import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { firebaseConfig } from "./firebase-config";

// Initialize Firebase only if we have the config (prevents build-time crashes)
let app: FirebaseApp | null = null;
if (typeof window !== "undefined" || firebaseConfig.apiKey) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
}

const auth: Auth | null = app ? getAuth(app) : null;
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
