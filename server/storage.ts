import { users, type User, type InsertUser, contentItems, type ContentItem, type InsertContentItem } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserBySubdomain(subdomain: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;  // New method to get all users
  createUser(user: InsertUser): Promise<User>;
  
  // Content operations
  getContentItem(id: number): Promise<ContentItem | undefined>;
  getContentItemsByUserId(userId: number): Promise<ContentItem[]>;
  createContentItem(item: InsertContentItem): Promise<ContentItem>;
  updateContentItem(id: number, item: Partial<ContentItem>): Promise<ContentItem | undefined>;
  deleteContentItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contentItems: Map<number, ContentItem>;
  private userIdCounter: number;
  private contentIdCounter: number;

  constructor() {
    this.users = new Map();
    this.contentItems = new Map();
    this.userIdCounter = 1;
    this.contentIdCounter = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async getUserBySubdomain(subdomain: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.subdomain.toLowerCase() === subdomain.toLowerCase(),
    );
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    
    // Create user with all required fields and null values for optional fields
    const user: User = {
      id,
      createdAt,
      isVerified: false,
      username: insertUser.username,
      email: insertUser.email,
      businessName: insertUser.businessName,
      subdomain: insertUser.subdomain,
      password: insertUser.password || null,
      preferredLanguage: insertUser.preferredLanguage || null,
      authProvider: insertUser.authProvider || null,
      providerId: insertUser.providerId || null,
      displayName: insertUser.displayName || null,
      photoURL: insertUser.photoURL || null,
    };
    
    this.users.set(id, user);
    return user;
  }

  // Content operations
  async getContentItem(id: number): Promise<ContentItem | undefined> {
    return this.contentItems.get(id);
  }

  async getContentItemsByUserId(userId: number): Promise<ContentItem[]> {
    return Array.from(this.contentItems.values())
      .filter((item) => item.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createContentItem(item: InsertContentItem): Promise<ContentItem> {
    const id = this.contentIdCounter++;
    const createdAt = new Date();

    // Create content item with all required fields and null values for optional fields
    const contentItem: ContentItem = {
      id,
      createdAt,
      userId: item.userId,
      title: item.title,
      contentType: item.contentType,
      content: item.content,
      prompt: item.prompt,
      language: item.language || null,
    };

    this.contentItems.set(id, contentItem);
    return contentItem;
  }

  async updateContentItem(id: number, updates: Partial<ContentItem>): Promise<ContentItem | undefined> {
    const contentItem = this.contentItems.get(id);
    if (!contentItem) return undefined;

    const updatedItem = { ...contentItem, ...updates };
    this.contentItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteContentItem(id: number): Promise<boolean> {
    return this.contentItems.delete(id);
  }
}

export const storage = new MemStorage();
