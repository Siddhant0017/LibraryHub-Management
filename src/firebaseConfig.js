import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCWoiu9cDqAB-ZaXaski8ik3iWadc-nVX0",
    authDomain: "library-management-61846.firebaseapp.com",
    projectId: "library-management-61846",
    storageBucket: "library-management-61846.firebasestorage.app",
    messagingSenderId: "108004029672",
    appId: "1:108004029672:web:8b48c762939337c027c55d",
    measurementId: "G-KWQMCEXXPE"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
export const auth = getAuth(app);