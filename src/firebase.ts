import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;

// Initialize Firebase only on the client-side and when API key is available
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    if (getApps().length === 0) {
        try {
            firebaseApp = initializeApp(firebaseConfig);
        } catch (error) {
            console.error("Firebase initialization error:", error);
            // Handle the error appropriately, maybe set a fallback or disable Firebase features
            firebaseApp = null; // Ensure firebaseApp is assigned a value even on failure
        }
    } else {
        firebaseApp = getApps()[0];
    }

    if (firebaseApp) {
        try {
            auth = getAuth(firebaseApp);
        } catch (error) {
            console.error("Firebase Auth initialization error:", error);
            auth = null; // Ensure auth is assigned a value even on failure
        }
    }
}

export { firebaseApp, auth };
