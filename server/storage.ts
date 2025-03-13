import { users, type User, type InsertUser, contentItems, type ContentItem, type InsertContentItem } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserBySubdomain(subdomain: string): Promise<User | undefined>;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt, isVerified: false };
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
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createContentItem(item: InsertContentItem): Promise<ContentItem> {
    const id = this.contentIdCounter++;
    const createdAt = new Date();
    const contentItem: ContentItem = { ...item, id, createdAt };
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
