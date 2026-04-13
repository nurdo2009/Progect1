import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 🔑 Замените на Ваши Firebase конфиги
// Получить можно в Firebase Console: https://console.firebase.google.com
const firebaseConfig = {
  apiKey: "AIzaSyBjEkJMjlNaYvVOmpPP_I-bcDfqqSZqd1g",
  authDomain: "expense-tracker-edc3a.firebaseapp.com",
  projectId: "expense-tracker-edc3a",
  storageBucket: "expense-tracker-edc3a.firebasestorage.app",
  messagingSenderId: "229382565583",
  appId: "1:229382565583:web:79b08c86f66ec8e3c151ba"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация Firestore
export const db = getFirestore(app);

// Инициализация Auth (опционально, для будущего функционала)
export const auth = getAuth(app);

export default app;
