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
/**
 * Detects if the current browser is likely an in-app browser
 * This helps identify environments that might have issues with Google auth
 */
function isInAppBrowser(): boolean {
  const userAgent = navigator.userAgent || '';
  
  // Common in-app browser indicators
  const inAppBrowserKeywords = [
    'FB_IAB', 'FBAN', 'FBAV',  // Facebook
    'Instagram',
    'Line',                    // LINE app
    'KAKAOTALK',               // KakaoTalk
    'WhatsApp',
    'WeChat',
    'MicroMessenger'           // WeChat's browser identifier
  ];
  
  return inAppBrowserKeywords.some(keyword => 
    userAgent.includes(keyword)
  );
}

export async function signInWithGoogle(): Promise<OAuthUser> {
  try {
    // Check if the Firebase API key is configured
    if (!import.meta.env.VITE_FIREBASE_API_KEY || 
        !import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) {
      throw new Error("Firebase configuration missing. Please configure Firebase in the environment variables.");
    }
    
    // Warn about in-app browsers that might have issues
    if (isInAppBrowser()) {
      console.warn("Detected in-app browser which may not support Google authentication");
      throw new Error(
        "Google Sign-In may not work in in-app browsers like LINE, Facebook, or Instagram browsers. " +
        "Please open this site in a standard web browser like Chrome or Safari."
      );
    }
    
    const result = await signInWithPopup(auth, googleProvider);
    return transformFirebaseUserToOAuthUser(result, "google");
  } catch (error) {
    console.error("Error signing in with Google", error);
    
    // Enhance error messages for common Firebase auth issues
    if (error instanceof Error) {
      if (error.message.includes('auth/configuration-not-found')) {
        console.error("Google Sign-In is not properly configured in Firebase console");
        throw new Error("Google Sign-In is not properly configured in Firebase console. Please enable Google as an authentication provider in Firebase.");
      }
      
      if (error.message.includes('auth/unauthorized-domain')) {
        console.error("Domain not authorized for Google Sign-In");
        throw new Error("This domain is not authorized for Google Sign-In. Please add it to authorized domains in Firebase console.");
      }
    }
    
    throw error;
  }
}

/**
 * Sign in with Facebook
 * @returns User data for backend authentication
 */
export async function signInWithFacebook(): Promise<OAuthUser> {
  try {
    // Check if the Firebase API key is configured
    if (!import.meta.env.VITE_FIREBASE_API_KEY || 
        !import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) {
      throw new Error("Firebase configuration missing. Please configure Firebase in the environment variables.");
    }
    
    // Warn about in-app browsers that might have issues
    if (isInAppBrowser()) {
      console.warn("Detected in-app browser which may not support Facebook authentication");
      throw new Error(
        "Facebook Sign-In may not work in in-app browsers like LINE, Facebook, or Instagram browsers. " +
        "Please open this site in a standard web browser like Chrome or Safari."
      );
    }
    
    const result = await signInWithPopup(auth, facebookProvider);
    return transformFirebaseUserToOAuthUser(result, "facebook");
  } catch (error) {
    console.error("Error signing in with Facebook", error);
    
    // Enhance error messages for common Firebase auth issues
    if (error instanceof Error) {
      if (error.message.includes('auth/configuration-not-found')) {
        console.error("Facebook Sign-In is not properly configured in Firebase console");
        throw new Error("Facebook Sign-In is not properly configured in Firebase console. Please enable Facebook as an authentication provider in Firebase.");
      }
      
      if (error.message.includes('auth/unauthorized-domain')) {
        console.error("Domain not authorized for Facebook Sign-In");
        throw new Error("This domain is not authorized for Facebook Sign-In. Please add it to authorized domains in Firebase console.");
      }
    }
    
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