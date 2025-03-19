import { pgTable, text, serial, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),  // Make password optional for OAuth users
  email: text("email").notNull().unique(),
  businessName: text("business_name").notNull(),
  subdomain: text("subdomain").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  isVerified: boolean("is_verified").default(false),
  preferredLanguage: text("preferred_language").default("th"),
  // OAuth related fields
  authProvider: text("auth_provider"), // 'google', 'facebook', or null for regular auth
  providerId: text("provider_id"),     // Provider-specific ID
  displayName: text("display_name"),   // Display name from OAuth provider
  photoURL: text("photo_url"),         // Profile photo URL from OAuth provider
});

export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  title: text("title").notNull(),
  contentType: text("content_type").notNull(),
  content: text("content").notNull(),
  prompt: text("prompt").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  language: text("language").default("th"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  businessName: true,
  subdomain: true,
  preferredLanguage: true,
  authProvider: true,
  providerId: true,
  displayName: true,
  photoURL: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for OAuth login data
export const oauthUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  displayName: z.string().optional(),
  authProvider: z.enum(["google", "facebook"]), // LINE provider removed to simplify MVP
  providerId: z.string(),
  photoURL: z.string().optional(),
});

export const insertContentSchema = createInsertSchema(contentItems).pick({
  userId: true,
  title: true,
  contentType: true,
  content: true,
  prompt: true,
  language: true,
});

export const contentGenerationSchema = z.object({
  contentType: z.string(),
  businessType: z.string(),
  tone: z.string(),
  length: z.string(),
  details: z.string(),
  language: z.string().default("th"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type OAuthUser = z.infer<typeof oauthUserSchema>;
export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = z.infer<typeof insertContentSchema>;
export type ContentGeneration = z.infer<typeof contentGenerationSchema>;
