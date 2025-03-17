import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateContentPrompt } from "./utils/openai";
import { createSubdomain, validateSubdomain } from "./utils/subdomain";
import { 
  loginUser, 
  registerUser, 
  authenticateUser, 
  logoutUser,
  requireAuth 
} from "./utils/auth";
import { processOAuthLogin } from "./utils/oauth";
import { ContentGeneration, contentGenerationSchema, oauthUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = await registerUser(req.body, storage);
      res.status(201).json(result);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const session = await loginUser(req.body, storage);
      
      // Set user session
      req.session.userId = session.userId;
      req.session.username = session.username;
      
      res.json({ success: true, message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    logoutUser(req);
    res.json({ success: true, message: "Logged out successfully" });
  });
  
  // OAuth login route
  app.post("/api/auth/oauth", async (req, res) => {
    try {
      // Validate OAuth data
      const oauthData = oauthUserSchema.parse(req.body);
      
      // Process OAuth login/signup
      const session = await processOAuthLogin(oauthData, storage);
      
      // Set user session
      req.session.userId = session.userId;
      req.session.username = session.username;
      
      res.json({ success: true, message: "OAuth login successful" });
    } catch (error) {
      console.error("OAuth login error:", error);
      
      // More detailed error information for better debugging
      if (error instanceof Error) {
        res.status(401).json({ 
          message: "OAuth login failed", 
          error: error.message,
          details: "This may be due to incorrect Firebase configuration or authentication setup."
        });
      } else {
        res.status(401).json({ message: "OAuth login failed" });
      }
    }
  });
  
  // Test account login route (for development only)
  app.post("/api/auth/test-login", async (req, res) => {
    try {
      // Check if this is a test account login
      if (req.body.username === "test" && req.body.password === "test") {
        // Look up the test user or create it if it doesn't exist
        let testUser = await storage.getUserByUsername("test");
        
        if (!testUser) {
          // Create the test user
          testUser = await storage.createUser({
            username: "test",
            password: "test",  // This should be hashed in production
            email: "test@example.com",
            businessName: "Test Business",
            subdomain: "test",
            preferredLanguage: "th",
          });
        }
        
        // Set user session
        req.session.userId = testUser.id;
        req.session.username = testUser.username;
        
        return res.json({ success: true, message: "Test login successful" });
      }
      
      res.status(401).json({ message: "Invalid test credentials" });
    } catch (error) {
      console.error("Test login error:", error);
      res.status(500).json({ message: error.message || "Test login failed" });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send sensitive information to the client
      const { password, ...userInfo } = user;
      res.json(userInfo);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user information" });
    }
  });

  // Subdomain validation (used during registration)
  app.post("/api/subdomain/validate", async (req, res) => {
    try {
      const { subdomain } = req.body;
      if (!subdomain) {
        return res.status(400).json({ valid: false, message: "Subdomain is required" });
      }
      
      const validationResult = await validateSubdomain(subdomain, storage);
      res.json(validationResult);
    } catch (error) {
      console.error("Subdomain validation error:", error);
      res.status(500).json({ valid: false, message: "Failed to validate subdomain" });
    }
  });

  // Content generation routes
  app.post("/api/content/generate", requireAuth, async (req, res) => {
    try {
      // Validate content generation parameters
      const contentParams = contentGenerationSchema.parse(req.body);
      
      // Generate content using OpenAI
      const generatedContent = await generateContentPrompt(contentParams);
      
      res.json(generatedContent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content parameters", errors: error.errors });
      }
      console.error("Content generation error:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  app.post("/api/content/save", requireAuth, async (req, res) => {
    try {
      const { title, contentType, content, prompt, language } = req.body;
      
      if (!title || !contentType || !content) {
        return res.status(400).json({ message: "Title, content type, and content are required" });
      }
      
      const contentItem = await storage.createContentItem({
        userId: req.session.userId,
        title,
        contentType,
        content,
        prompt,
        language: language || "th",
      });
      
      res.status(201).json(contentItem);
    } catch (error) {
      console.error("Save content error:", error);
      res.status(500).json({ message: "Failed to save content" });
    }
  });

  app.get("/api/content/items", requireAuth, async (req, res) => {
    try {
      const contentItems = await storage.getContentItemsByUserId(req.session.userId);
      res.json(contentItems);
    } catch (error) {
      console.error("Get content items error:", error);
      res.status(500).json({ message: "Failed to get content items" });
    }
  });

  app.get("/api/content/item/:id", requireAuth, async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      if (isNaN(contentId)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }
      
      const contentItem = await storage.getContentItem(contentId);
      
      if (!contentItem) {
        return res.status(404).json({ message: "Content item not found" });
      }
      
      // Check if the content belongs to the requesting user
      if (contentItem.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized access to content" });
      }
      
      res.json(contentItem);
    } catch (error) {
      console.error("Get content item error:", error);
      res.status(500).json({ message: "Failed to get content item" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
