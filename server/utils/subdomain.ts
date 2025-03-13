import { IStorage } from "../storage";

/**
 * Create a normalized subdomain from a business name
 * @param businessName The business name to create subdomain from
 * @returns Normalized subdomain
 */
export function createSubdomain(businessName: string): string {
  if (!businessName) return "";
  
  // Remove special characters, replace spaces with nothing, and convert to lowercase
  return businessName
    .toLowerCase()
    .replace(/[^\wก-๙]/g, "") // Keep Thai characters (ก-๙) and alphanumeric
    .replace(/\s+/g, "")
    .trim();
}

/**
 * Validate if a subdomain is available and follows rules
 * @param subdomain The subdomain to validate
 * @param storage Storage interface for checking existing subdomains
 * @returns Validation result object
 */
export async function validateSubdomain(
  subdomain: string,
  storage: IStorage
): Promise<{ valid: boolean; message?: string }> {
  // Check for minimum length
  if (subdomain.length < 3) {
    return { valid: false, message: "Subdomain must be at least 3 characters long" };
  }
  
  // Check for maximum length
  if (subdomain.length > 30) {
    return { valid: false, message: "Subdomain must be at most 30 characters long" };
  }
  
  // Check for valid characters (alphanumeric and Thai characters)
  if (!/^[a-z0-9ก-๙]+$/.test(subdomain)) {
    return { 
      valid: false, 
      message: "Subdomain can only contain lowercase letters, numbers, and Thai characters without spaces or special characters" 
    };
  }
  
  // Check if subdomain already exists
  const existingUser = await storage.getUserBySubdomain(subdomain);
  if (existingUser) {
    return { valid: false, message: "This subdomain is already taken" };
  }
  
  // Check for reserved words
  const reservedWords = [
    "admin", "api", "app", "billing", "dashboard", "help", "login", 
    "register", "settings", "support", "www", "mail", "blog", "docs"
  ];
  
  if (reservedWords.includes(subdomain)) {
    return { valid: false, message: "This subdomain is reserved and cannot be used" };
  }
  
  return { valid: true };
}

/**
 * Generate a unique subdomain if the desired one is taken
 * @param subdomain Base subdomain to check
 * @param storage Storage interface for checking existing subdomains
 * @returns A unique subdomain
 */
export async function generateUniqueSubdomain(subdomain: string, storage: IStorage): Promise<string> {
  let candidate = subdomain;
  let counter = 1;
  
  // Check if the base subdomain is available
  let validation = await validateSubdomain(candidate, storage);
  
  // If not available, add numbers until we find an available one
  while (!validation.valid) {
    // If the issue is not about availability, just return the base subdomain
    // The validation will occur again during registration and show proper errors
    if (validation.message && !validation.message.includes("already taken")) {
      return subdomain;
    }
    
    candidate = `${subdomain}${counter}`;
    validation = await validateSubdomain(candidate, storage);
    counter++;
    
    // Safety check to prevent infinite loops
    if (counter > 100) {
      return `${subdomain}${Date.now().toString().slice(-6)}`;
    }
  }
  
  return candidate;
}
