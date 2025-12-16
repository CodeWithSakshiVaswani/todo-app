import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpHyl3ROWbkTeE0vhyWAEG94SbQ5rcexI",
  authDomain: "todo-59c43.firebaseapp.com",
  projectId: "todo-59c43",
  storageBucket: "todo-59c43.firebasestorage.app",
  messagingSenderId: "721079924804",
  appId: "1:721079924804:web:480cb54fc3848283466411",
  measurementId: "G-3TLCGZ0Y7L",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const googleAAuthProvider = new GoogleAuthProvider();

export default app;
