// Firebase configuration - these are NEXT_PUBLIC (client-side) values.
// They are safe to commit as they are already visible in the browser bundle.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBYb2AU8zoLeSQiQxqQW2lmsS0zgM8ad1I",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "trgt-f1-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trgt-f1-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "trgt-f1-app.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "377770855288",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:377770855288:web:28eafb1b14e2eeb93b168d",
};
