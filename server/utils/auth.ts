import * as crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { IStorage } from '../storage';
import { InsertUser, LoginUser } from '@shared/schema';

// Extend Express Request to include our session properties
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    username?: string;
  }
}

/**
 * Hash a password using SHA-256
 * @param password Plain text password
 * @returns Hashed password
 */
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Validate and register a new user
 * @param userData User registration data
 * @param storage Storage interface
 * @returns Registered user (without password)
 */
export async function registerUser(userData: InsertUser, storage: IStorage) {
  // Check if username already exists
  const existingUser = await storage.getUserByUsername(userData.username);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Check if email already exists
  const existingEmail = await storage.getUserByEmail(userData.email);
  if (existingEmail) {
    throw new Error('Email already exists');
  }

  // Check if subdomain already exists
  const existingSubdomain = await storage.getUserBySubdomain(userData.subdomain);
  if (existingSubdomain) {
    throw new Error('Subdomain already exists');
  }

  // Hash the password
  const hashedPassword = hashPassword(userData.password);

  // Create the user with hashed password
  const user = await storage.createUser({
    ...userData,
    password: hashedPassword,
  });

  // Return user data without the password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Authenticate a user and create a session
 * @param loginData Login credentials
 * @param storage Storage interface
 * @returns User session data
 */
export async function loginUser(loginData: LoginUser, storage: IStorage) {
  const { username, password } = loginData;

  // Find user by username
  const user = await storage.getUserByUsername(username);
  if (!user) {
    throw new Error('Invalid username or password');
  }

  // Check if password matches
  const hashedPassword = hashPassword(password);
  if (user.password !== hashedPassword) {
    throw new Error('Invalid username or password');
  }

  // Return session data
  return {
    userId: user.id,
    username: user.username,
  };
}

/**
 * Log out a user by destroying their session
 * @param req Express request object
 */
export function logoutUser(req: Request) {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });
  }
}

/**
 * Authenticate a user with their session
 * @param req Express request object
 * @returns Boolean indicating if user is authenticated
 */
export function authenticateUser(req: Request): boolean {
  return !!req.session && !!req.session.userId;
}

/**
 * Middleware to require authentication for protected routes
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!authenticateUser(req)) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}
