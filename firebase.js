import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration - Replace with your own
const firebaseConfig = {
  apiKey: "AIzaSyDLkwIlkmoACtk0R1x5uvwsAiiwhg-ZhyA",
  authDomain: "quran-vocap.firebaseapp.com",
  projectId: "quran-vocap",
  storageBucket: "quran-vocap.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "com.mapps.quranvocab"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);