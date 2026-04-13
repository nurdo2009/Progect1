// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAN9BkIOagG8CTjcftvzf0CzBfWUp9ls-o",
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "treker-5d982.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "treker-5d982",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "treker-5d982.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1077070728653",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1077070728653:web:742b6c25875714f49a8884",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9EYETW1DN2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export async function registerWithEmail(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = userCredential;

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email,
    createdAt: new Date().toISOString(),
  });

  return user;
}

export async function loginWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logout() {
  return signOut(auth);
}
