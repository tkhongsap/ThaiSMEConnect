import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import { OAuthUser } from "@shared/schema";

// Firebase configuration
// Note: These values should be set as environment variables in Replit Secrets Manager
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Facebook Provider
const facebookProvider = new FacebookAuthProvider();

/**
 * Sign in with Google
 * @returns User data for backend authentication
 */
export async function signInWithGoogle(): Promise<OAuthUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return transformFirebaseUserToOAuthUser(result, "google");
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
}

/**
 * Sign in with Facebook
 * @returns User data for backend authentication
 */
export async function signInWithFacebook(): Promise<OAuthUser> {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return transformFirebaseUserToOAuthUser(result, "facebook");
  } catch (error) {
    console.error("Error signing in with Facebook", error);
    throw error;
  }
}

/**
 * Transform Firebase user credential to our OAuthUser format
 */
function transformFirebaseUserToOAuthUser(
  credential: UserCredential, 
  provider: "google" | "facebook"
): OAuthUser {
  const { user } = credential;
  
  if (!user.email) {
    throw new Error("Email is required for authentication");
  }
  
  return {
    email: user.email,
    displayName: user.displayName || undefined,
    authProvider: provider,
    providerId: user.uid,
    photoURL: user.photoURL || undefined,
  };
}