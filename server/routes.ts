import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSwipeSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, updates);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Discovery routes
  app.get("/api/discovery/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const users = await storage.getDiscoveryUsers(userId, limit);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to get discovery users" });
    }
  });

  // Swipe routes
  app.post("/api/swipe", async (req, res) => {
    try {
      const swipeData = insertSwipeSchema.parse(req.body);
      
      // Check if user has already swiped
      const hasSwipped = await storage.hasUserSwiped(swipeData.swiperId, swipeData.swipedId);
      if (hasSwipped) {
        return res.status(400).json({ error: "Already swiped on this user" });
      }

      const swipe = await storage.createSwipe(swipeData);
      
      // Check for match if it's a like
      let match = null;
      if (swipeData.isLike) {
        const isMatch = await storage.checkForMatch(swipeData.swiperId, swipeData.swipedId);
        if (isMatch) {
          match = await storage.createMatch(swipeData.swiperId, swipeData.swipedId);
        }
      }

      res.json({
        swipe,
        match: !!match,
        matchData: match,
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid swipe data" });
    }
  });

  // Match routes
  app.get("/api/matches/:userId", async (req, res) => {
    try {
      const matches = await storage.getUserMatches(req.params.userId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to get matches" });
    }
  });

  // Message routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  app.get("/api/messages/:matchId", async (req, res) => {
    try {
      const messages = await storage.getMatchMessages(req.params.matchId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.get("/api/conversations/:userId", async (req, res) => {
    try {
      const conversations = await storage.getConversations(req.params.userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
