'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {auth} from '@/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
} from 'firebase/auth';

interface AuthContextProps {
    user: any;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!auth) {
            console.warn("Firebase Auth not initialized. Authentication features will be unavailable.");
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const signUp = async (email: string, password: string) => {
        if (!auth) {
            console.error("Firebase Auth is not initialized.");
            throw new Error("Firebase Auth is not initialized.");
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            console.error("Error signing up:", error.message);
            throw new Error(error.message);
        }
    };

    const signIn = async (email: string, password: string) => {
        if (!auth) {
            console.error("Firebase Auth is not initialized.");
            throw new Error("Firebase Auth is not initialized.");
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            console.error("Error signing in:", error.message);
            throw new Error(error.message);
        }
    };

    const signOut = async () => {
        if (!auth) {
            console.error("Firebase Auth is not initialized.");
            throw new Error("Firebase Auth is not initialized.");
        }
        try {
            await firebaseSignOut(auth);
        } catch (error: any) {
            console.error("Error signing out:", error.message);
            throw new Error(error.message);
        }
    };

    const resetPassword = async (email: string) => {
        if (!auth) {
            console.error("Firebase Auth is not initialized.");
            throw new Error("Firebase Auth is not initialized.");
        }
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error: any) {
            console.error("Error sending password reset email:", error.message);
            throw new Error(error.message);
        }
    };

    const value: AuthContextProps = {
        user,
        signUp,
        signIn,
        signOut,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

