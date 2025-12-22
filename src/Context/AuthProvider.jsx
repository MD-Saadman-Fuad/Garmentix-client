import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase.config";
import AuthContext from "./AuthContext";
import axios from "axios";




const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signInUser = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await result.user.getIdToken();

            // Store token in httpOnly cookie
            await axios.post(`${import.meta.env.VITE_backend_url}/auth/login`,
                { idToken },
                { withCredentials: true }
            );

            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }

    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            // Store token in httpOnly cookie
            await axios.post(`${import.meta.env.VITE_backend_url}/auth/login`,
                { idToken },
                { withCredentials: true }
            );

            return result;
        } catch (error) {
            setLoading(false);
            console.error('Google sign-in error:', error);
            throw error;
        }
    }

    const logOut = async () => {
        setLoading(true);
        try {
            // Clear cookie from backend
            await axios.post(`${import.meta.env.VITE_backend_url}/auth/logout`,
                {},
                { withCredentials: true }
            );
            return await signOut(auth);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }

    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // User is signed in, sync token to cookie
                try {
                    const idToken = await currentUser.getIdToken();
                    await axios.post(`${import.meta.env.VITE_backend_url}/auth/login`,
                        { idToken },
                        { withCredentials: true }
                    );
                } catch (error) {
                    console.error('Token sync error:', error);
                }
            }
            setUser(currentUser);
            setLoading(false);
        })
        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        registerUser,
        signInUser,
        signInWithGoogle,
        logOut,
        loading,
        updateUserProfile
    }
    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;