import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const {
    VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_DATABASE_URL,
    VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_MEASUREMENT_ID,
    VITE_FIREBASE_MESSAGE_SENDER_ID,
    VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET
} = import.meta.env;

const firebaseConfig = {
    apiKey: VITE_FIREBASE_API_KEY,
    authDomain: VITE_FIREBASE_AUTH_DOMAIN,
    projectId: VITE_FIREBASE_PROJECT_ID,
    databaseURL: VITE_FIREBASE_DATABASE_URL,
    storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: VITE_FIREBASE_MESSAGE_SENDER_ID,
    appId: VITE_FIREBASE_APP_ID,
    measurementId: VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const firestoreDb = getFirestore(app);