import { IStorage } from '../storage';
import { OAuthUser, InsertUser, User } from '@shared/schema';
import { createSubdomain, generateUniqueSubdomain } from './subdomain';

/**
 * Process OAuth sign-in/sign-up
 * This handles both login and registration for OAuth users
 * @param oauthData OAuth user data
 * @param storage Storage interface
 * @returns User session data
 */
export async function processOAuthLogin(oauthData: OAuthUser, storage: IStorage) {
  // Check if user already exists with this provider ID
  const userByProvider = await getUserByProvider(
    oauthData.authProvider, 
    oauthData.providerId, 
    storage
  );
  
  if (userByProvider) {
    // User exists - return session data
    return {
      userId: userByProvider.id,
      username: userByProvider.username,
    };
  }
  
  // Check if email exists but with different auth provider
  const userByEmail = await storage.getUserByEmail(oauthData.email);
  if (userByEmail) {
    throw new Error('Email already associated with another account');
  }
  
  // New user - create account
  const username = generateUsername(oauthData.email, oauthData.displayName);
  const subdomain = await generateUniqueSubdomain(
    createSubdomain(oauthData.displayName || username),
    storage
  );
  
  // Create user object
  const newUser: InsertUser = {
    username,
    email: oauthData.email,
    businessName: oauthData.displayName || username,
    subdomain,
    authProvider: oauthData.authProvider,
    providerId: oauthData.providerId,
    displayName: oauthData.displayName,
    photoURL: oauthData.photoURL,
    preferredLanguage: 'th',
  };
  
  // Create user in storage
  const user = await storage.createUser(newUser);
  
  // Return session data
  return {
    userId: user.id,
    username: user.username,
  };
}

/**
 * Find user by OAuth provider and ID
 * @param provider OAuth provider name
 * @param providerId Provider-specific user ID
 * @param storage Storage interface
 * @returns User if found, undefined otherwise
 */
async function getUserByProvider(
  provider: string,
  providerId: string,
  storage: IStorage
): Promise<User | undefined> {
  // This is a custom query that needs to be implemented in the storage
  const users = await storage.getAllUsers();
  return users.find(u => 
    u.authProvider === provider && u.providerId === providerId
  );
}

/**
 * Generate a unique username from email or display name
 * @param email User's email
 * @param displayName Optional display name
 * @returns Generated username
 */
function generateUsername(email: string, displayName?: string): string {
  if (displayName) {
    // Convert display name to username (remove spaces, special chars)
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 15);
  }
  
  // Use email prefix
  return email.split('@')[0].substring(0, 15);
}