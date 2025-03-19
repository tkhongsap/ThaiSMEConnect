import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider,
  signInWithPopup, 
  UserCredential 
} from "firebase/auth";
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

// NOTE: LINE login is not directly supported in Firebase Authentication
// We will use a direct LINE OAuth approach instead of using Firebase's OAuthProvider
// This won't be fully implemented in this file - see the handleLINESignIn function in Login.tsx

/**
 * Sign in with Google
 * @returns User data for backend authentication
 */
/**
 * Detects if the current browser is likely an in-app browser
 * This helps identify environments that might have issues with Google auth
 * @returns Object with detection result and browser name if detected
 */
function detectInAppBrowser(): { isInApp: boolean; browserName?: string } {
  const userAgent = navigator.userAgent || '';
  
  // Common in-app browser indicators with friendly names
  const inAppBrowsers = [
    { keyword: 'FB_IAB', name: 'Facebook' },
    { keyword: 'FBAN', name: 'Facebook' },
    { keyword: 'FBAV', name: 'Facebook' },
    { keyword: 'Instagram', name: 'Instagram' },
    { keyword: 'Line', name: 'LINE' },
    { keyword: 'KAKAOTALK', name: 'KakaoTalk' },
    { keyword: 'WhatsApp', name: 'WhatsApp' },
    { keyword: 'WeChat', name: 'WeChat' },
    { keyword: 'MicroMessenger', name: 'WeChat' }
  ];
  
  for (const browser of inAppBrowsers) {
    if (userAgent.includes(browser.keyword)) {
      return { isInApp: true, browserName: browser.name };
    }
  }
  
  return { isInApp: false };
}

/**
 * Create a shareable URL for the current page that can be opened in an external browser
 */
export function getExternalBrowserUrl(): string {
  return window.location.href;
}

export async function signInWithGoogle(): Promise<OAuthUser> {
  try {
    // Check if the Firebase API key is configured
    if (!import.meta.env.VITE_FIREBASE_API_KEY || 
        !import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) {
      throw new Error("Firebase configuration missing. Please configure Firebase in the environment variables.");
    }
    
    // Check for in-app browsers
    const browserInfo = detectInAppBrowser();
    if (browserInfo.isInApp) {
      console.warn(`Detected ${browserInfo.browserName} in-app browser which does not support Google authentication`);
      
      const appName = browserInfo.browserName || "social media app";
      const url = getExternalBrowserUrl();
      
      throw new Error(
        `Google Sign-In is blocked by Google in the ${appName} browser due to security policies. ` +
        `Please copy this URL and open it in Chrome or Safari: ${url}`
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
    
    // Check for in-app browsers
    const browserInfo = detectInAppBrowser();
    if (browserInfo.isInApp) {
      console.warn(`Detected ${browserInfo.browserName} in-app browser which does not support Facebook authentication`);
      
      const appName = browserInfo.browserName || "social media app";
      const url = getExternalBrowserUrl();
      
      throw new Error(
        `Facebook Sign-In is blocked by Facebook in the ${appName} browser due to security policies. ` +
        `Please copy this URL and open it in Chrome or Safari: ${url}`
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
 * Sign in with LINE using a direct LINE OAuth approach
 * 
 * NOTE: Since Firebase doesn't directly support LINE login as a provider,
 * we need to use LINE's direct OAuth flow with our server as the callback endpoint
 * 
 * @returns User data for backend authentication
 */
export async function signInWithLINE(): Promise<OAuthUser> {
  try {
    // Check if LINE channel ID is configured
    if (!import.meta.env.VITE_LINE_LOGIN_CHANNEL_ID) {
      throw new Error("LINE login configuration missing. Please set the VITE_LINE_LOGIN_CHANNEL_ID environment variable.");
    }
    
    // Check for in-app browsers 
    const browserInfo = detectInAppBrowser();
    if (browserInfo.isInApp) {
      console.warn(`Detected ${browserInfo.browserName} in-app browser which may not support LINE authentication`);
      
      const appName = browserInfo.browserName || "social media app";
      const url = getExternalBrowserUrl();
      
      throw new Error(
        `LINE Sign-In may not work properly in the ${appName} browser due to security policies. ` +
        `Please copy this URL and open it in Chrome or Safari: ${url}`
      );
    }
    
    // For now, show a clear error explaining the situation
    throw new Error(
      "LINE login is not directly supported in Firebase Authentication. " +
      "To implement LINE login, you would need to create a custom LINE OAuth flow with your own server endpoints. " +
      "This requires additional backend setup with LINE Developer Console."
    );
    
    // A proper implementation would:
    // 1. Redirect to LINE OAuth authorization URL 
    // 2. Handle the callback on your server
    // 3. Exchange the authorization code for an access token
    // 4. Get user profile information from LINE
    // 5. Create or update the user in your database
    // 6. Return the user data in OAuthUser format
  } catch (error) {
    console.error("Error signing in with LINE", error);
    
    if (error instanceof Error) {
      // Pass through our custom errors
      throw error;
    }
    
    throw new Error("LINE login failed. Please try another sign-in method.");
  }
}

/**
 * Transform Firebase user credential to our OAuthUser format
 */
function transformFirebaseUserToOAuthUser(
  credential: UserCredential, 
  provider: "google" | "facebook" | "line"
): OAuthUser {
  const { user } = credential;
  
  // LINE may not always provide an email, so we need to handle that case
  if (!user.email && provider !== "line") {
    throw new Error("Email is required for authentication");
  }
  
  return {
    email: user.email || `${user.uid}@line.user.com`, // Fallback email for LINE users
    displayName: user.displayName || undefined,
    authProvider: provider,
    providerId: user.uid,
    photoURL: user.photoURL || undefined,
  };
}