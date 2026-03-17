import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { firebaseConfig } from "./firebase-config";

// Initialize Firebase only if we have the config (prevents build-time crashes)
let app;
if (typeof window !== "undefined" || firebaseConfig.apiKey) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
}

const auth = app ? getAuth(app) : null as any;
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
