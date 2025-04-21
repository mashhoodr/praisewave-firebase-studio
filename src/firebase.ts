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

let firebaseApp: FirebaseApp;
let auth: Auth;

// Initialize Firebase only on the client-side and when API key is available
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    if (getApps().length === 0) {
        try {
            firebaseApp = initializeApp(firebaseConfig);
        } catch (error) {
            console.error("Firebase initialization error:", error);
            // Handle the error appropriately, maybe set a fallback or disable Firebase features
            firebaseApp = null as any; // Ensure firebaseApp is assigned a value even on failure
        }
    } else {
        firebaseApp = getApps()[0];
    }

    if (firebaseApp) {
        try {
            auth = getAuth(firebaseApp);
        } catch (error) {
            console.error("Firebase Auth initialization error:", error);
            auth = null as any; // Ensure auth is assigned a value even on failure
        }
    } else {
        auth = null as any; // If firebaseApp is null, auth should also be null
    }
} else {
    firebaseApp = null as any;
    auth = null as any;
}

export { firebaseApp, auth };
