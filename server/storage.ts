import { type User, type InsertUser, type Swipe, type InsertSwipe, type Match, type Message, type InsertMessage, type UserPreferences, type InsertUserPreferences, type Boost, type InsertBoost } from "@shared/schema";
import { randomUUID } from "crypto";

// Distance calculation utility using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;
  getDiscoveryUsers(userId: string, limit?: number): Promise<User[]>;
  getDiscoveryUsersWithLocation(userId: string, userLat: number, userLon: number, maxDistance: number, limit?: number): Promise<(User & { distance: number })[]>;
  updateUserLocation(userId: string, latitude: number, longitude: number, location?: string): Promise<User>;
  
  // Swipe operations
  createSwipe(swipe: InsertSwipe): Promise<Swipe>;
  getUserSwipes(userId: string): Promise<Swipe[]>;
  hasUserSwiped(swiperId: string, swipedId: string): Promise<boolean>;
  
  // Match operations
  createMatch(user1Id: string, user2Id: string): Promise<Match>;
  getUserMatches(userId: string): Promise<(Match & { otherUser: User })[]>;
  checkForMatch(swiperId: string, swipedId: string): Promise<boolean>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMatchMessages(matchId: string): Promise<(Message & { sender: User })[]>;
  getConversations(userId: string): Promise<Array<{
    match: Match;
    otherUser: User;
    lastMessage?: Message & { sender: User };
    unreadCount: number;
  }>>;
  markMessageAsRead(messageId: string): Promise<void>;
  
  // User Preferences operations
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: string, updates: Partial<InsertUserPreferences>): Promise<UserPreferences>;
  
  // Boost operations
  createBoost(boost: InsertBoost): Promise<Boost>;
  getUserActiveBoosts(userId: string): Promise<Boost[]>;
  
  // Advanced matching
  getDiscoveryUsersWithFilters(userId: string, filters?: {
    ageRange?: [number, number];
    maxDistance?: number;
    interests?: string[];
    education?: string;
  }): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private swipes: Map<string, Swipe>;
  private matches: Map<string, Match>;
  private messages: Map<string, Message>;
  private userPreferences: Map<string, UserPreferences>;
  private boosts: Map<string, Boost>;

  constructor() {
    this.users = new Map();
    this.swipes = new Map();
    this.matches = new Map();
    this.messages = new Map();
    this.userPreferences = new Map();
    this.boosts = new Map();
    
    // Initialize with some sample users for discovery
    this.initializeSampleUsers();
  }

  private initializeSampleUsers() {
    const sampleUsers: InsertUser[] = [
      {
        name: "Sarah",
        age: 26,
        bio: "Adventure seeker, coffee enthusiast ☕ Love hiking and discovering new places!",
        jobTitle: "Marketing Manager",
        company: "Tech Startup",
        photos: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"],
        interests: ["Hiking", "Coffee", "Photography", "Travel"],
        location: "2 miles away",
        latitude: 40.7128,
        longitude: -74.0060,
        education: "Bachelor's Degree",
        height: 165,
        lookingFor: "serious",
        verified: true
      },
      {
        name: "Mike",
        age: 28,
        bio: "Software engineer who loves rock climbing and outdoor adventures",
        jobTitle: "Software Engineer",
        company: "Google",
        photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"],
        interests: ["Rock Climbing", "Technology", "Fitness", "Music"],
        location: "5 miles away",
        latitude: 40.7589,
        longitude: -73.9851,
        education: "Master's Degree",
        height: 180,
        lookingFor: "serious",
        verified: false
      },
      {
        name: "Emma",
        age: 24,
        bio: "Artist and yoga instructor spreading good vibes ✨",
        jobTitle: "Yoga Instructor",
        company: "Mindful Studio",
        photos: ["https://images.unsplash.com/photo-1494790108755-2616c27945f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"],
        interests: ["Yoga", "Art", "Meditation", "Nature"],
        location: "3 miles away",
        latitude: 40.7505,
        longitude: -73.9934,
        education: "Some College",
        height: 160,
        lookingFor: "casual",
        verified: true
      },
      {
        name: "Alex",
        age: 29,
        bio: "Chef passionate about creating amazing culinary experiences",
        jobTitle: "Head Chef",
        company: "Fine Dining Restaurant",
        photos: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"],
        interests: ["Cooking", "Wine", "Travel", "Food Photography"],
        location: "4 miles away",
        latitude: 40.7282,
        longitude: -74.0776,
        education: "Culinary School",
        height: 175,
        lookingFor: "serious",
        verified: false
      }
    ];

    sampleUsers.forEach(user => {
      const id = randomUUID();
      const fullUser: User = {
        ...user,
        id,
        createdAt: new Date(),
        location: user.location || null,
        bio: user.bio || null,
        jobTitle: user.jobTitle || null,
        company: user.company || null,
        photos: (user.photos as string[]) || null,
        interests: (user.interests as string[]) || null,
        latitude: user.latitude?.toString() || null,
        longitude: user.longitude?.toString() || null,
        maxDistance: user.maxDistance || 25,
        ageRangeMin: user.ageRangeMin || 18,
        ageRangeMax: user.ageRangeMax || 35,
        lookingFor: user.lookingFor || "serious",
        education: user.education || null,
        height: user.height || null,
        verified: user.verified || false,
        premium: user.premium || false,
        lastActive: new Date(),
      };
      this.users.set(id, fullUser);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.name.toLowerCase() === username.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      location: insertUser.location || null,
      bio: insertUser.bio || null,
      jobTitle: insertUser.jobTitle || null,
      company: insertUser.company || null,
      photos: (insertUser.photos as string[]) || null,
      interests: (insertUser.interests as string[]) || null,
      latitude: insertUser.latitude?.toString() || null,
      longitude: insertUser.longitude?.toString() || null,
      maxDistance: insertUser.maxDistance || 25,
      ageRangeMin: insertUser.ageRangeMin || 18,
      ageRangeMax: insertUser.ageRangeMax || 35,
      lookingFor: insertUser.lookingFor || "serious",
      education: insertUser.education || null,
      height: insertUser.height || null,
      verified: insertUser.verified || false,
      premium: insertUser.premium || false,
      lastActive: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    
    const updatedUser: User = { 
      ...existingUser, 
      ...updates,
      location: updates.location !== undefined ? updates.location : existingUser.location,
      bio: updates.bio !== undefined ? updates.bio : existingUser.bio,
      jobTitle: updates.jobTitle !== undefined ? updates.jobTitle : existingUser.jobTitle,
      company: updates.company !== undefined ? updates.company : existingUser.company,
      photos: updates.photos !== undefined ? (updates.photos as string[]) : existingUser.photos,
      interests: updates.interests !== undefined ? (updates.interests as string[]) : existingUser.interests,
      latitude: updates.latitude !== undefined ? updates.latitude?.toString() : existingUser.latitude,
      longitude: updates.longitude !== undefined ? updates.longitude?.toString() : existingUser.longitude,
      maxDistance: updates.maxDistance !== undefined ? updates.maxDistance : existingUser.maxDistance,
      ageRangeMin: updates.ageRangeMin !== undefined ? updates.ageRangeMin : existingUser.ageRangeMin,
      ageRangeMax: updates.ageRangeMax !== undefined ? updates.ageRangeMax : existingUser.ageRangeMax,
      lookingFor: updates.lookingFor !== undefined ? updates.lookingFor : existingUser.lookingFor,
      education: updates.education !== undefined ? updates.education : existingUser.education,
      height: updates.height !== undefined ? updates.height : existingUser.height,
      verified: updates.verified !== undefined ? updates.verified : existingUser.verified,
      premium: updates.premium !== undefined ? updates.premium : existingUser.premium,
      lastActive: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getDiscoveryUsers(userId: string, limit = 10): Promise<User[]> {
    const userSwipes = await this.getUserSwipes(userId);
    const swipedUserIds = new Set(userSwipes.map(swipe => swipe.swipedId));
    
    return Array.from(this.users.values())
      .filter(user => user.id !== userId && !swipedUserIds.has(user.id))
      .slice(0, limit);
  }

  async createSwipe(swipe: InsertSwipe): Promise<Swipe> {
    const id = randomUUID();
    const fullSwipe: Swipe = {
      ...swipe,
      id,
      createdAt: new Date(),
      isSuperLike: swipe.isSuperLike || null,
      boost: swipe.boost || null,
    };
    this.swipes.set(id, fullSwipe);
    return fullSwipe;
  }

  async getUserSwipes(userId: string): Promise<Swipe[]> {
    return Array.from(this.swipes.values()).filter(
      swipe => swipe.swiperId === userId
    );
  }

  async hasUserSwiped(swiperId: string, swipedId: string): Promise<boolean> {
    return Array.from(this.swipes.values()).some(
      swipe => swipe.swiperId === swiperId && swipe.swipedId === swipedId
    );
  }

  async checkForMatch(swiperId: string, swipedId: string): Promise<boolean> {
    // Check if the swiped user has already liked the swiper
    return Array.from(this.swipes.values()).some(
      swipe => swipe.swiperId === swipedId && swipe.swipedId === swiperId && swipe.isLike
    );
  }

  async createMatch(user1Id: string, user2Id: string): Promise<Match> {
    const id = randomUUID();
    const match: Match = {
      id,
      user1Id,
      user2Id,
      createdAt: new Date(),
    };
    this.matches.set(id, match);
    return match;
  }

  async getUserMatches(userId: string): Promise<(Match & { otherUser: User })[]> {
    const userMatches = Array.from(this.matches.values()).filter(
      match => match.user1Id === userId || match.user2Id === userId
    );

    return userMatches.map(match => {
      const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
      const otherUser = this.users.get(otherUserId);
      if (!otherUser) throw new Error("Other user not found");
      
      return { ...match, otherUser };
    });
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const fullMessage: Message = {
      ...message,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, fullMessage);
    return fullMessage;
  }

  async getMatchMessages(matchId: string): Promise<(Message & { sender: User })[]> {
    const matchMessages = Array.from(this.messages.values())
      .filter(message => message.matchId === matchId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());

    return matchMessages.map(message => {
      const sender = this.users.get(message.senderId);
      if (!sender) throw new Error("Sender not found");
      
      return { ...message, sender };
    });
  }

  async getConversations(userId: string): Promise<Array<{
    match: Match;
    otherUser: User;
    lastMessage?: Message & { sender: User };
    unreadCount: number;
  }>> {
    const userMatches = await this.getUserMatches(userId);
    
    return userMatches.map(({ otherUser, ...match }) => {
      const matchMessages = Array.from(this.messages.values())
        .filter(message => message.matchId === match.id)
        .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());

      const lastMessage = matchMessages[0];
      const lastMessageWithSender = lastMessage ? {
        ...lastMessage,
        sender: this.users.get(lastMessage.senderId)!
      } : undefined;

      // Simple unread count logic (messages from other user)
      const unreadCount = matchMessages.filter(
        msg => msg.senderId === otherUser.id
      ).length;

      return {
        match,
        otherUser,
        lastMessage: lastMessageWithSender,
        unreadCount: Math.min(unreadCount, 5) // Cap for demo
      };
    }).sort((a, b) => {
      const aTime = a.lastMessage?.createdAt?.getTime() || 0;
      const bTime = b.lastMessage?.createdAt?.getTime() || 0;
      return bTime - aTime;
    });
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    const message = this.messages.get(messageId);
    if (message) {
      const updatedMessage = { ...message, readAt: new Date() };
      this.messages.set(messageId, updatedMessage);
    }
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(
      pref => pref.userId === userId
    );
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const id = randomUUID();
    const fullPreferences: UserPreferences = {
      ...preferences,
      id,
      createdAt: new Date(),
    };
    this.userPreferences.set(id, fullPreferences);
    return fullPreferences;
  }

  async updateUserPreferences(userId: string, updates: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(userId);
    if (!existing) {
      throw new Error("User preferences not found");
    }
    
    const updatedPreferences: UserPreferences = { ...existing, ...updates };
    this.userPreferences.set(existing.id, updatedPreferences);
    return updatedPreferences;
  }

  async createBoost(boost: InsertBoost): Promise<Boost> {
    const id = randomUUID();
    const fullBoost: Boost = {
      ...boost,
      id,
      createdAt: new Date(),
    };
    this.boosts.set(id, fullBoost);
    return fullBoost;
  }

  async getUserActiveBoosts(userId: string): Promise<Boost[]> {
    const now = new Date();
    return Array.from(this.boosts.values()).filter(
      boost => boost.userId === userId && boost.expiresAt > now
    );
  }

  async getDiscoveryUsersWithFilters(userId: string, filters?: {
    ageRange?: [number, number];
    maxDistance?: number;
    interests?: string[];
    education?: string;
  }): Promise<User[]> {
    const userSwipes = await this.getUserSwipes(userId);
    const swipedUserIds = new Set(userSwipes.map(swipe => swipe.swipedId));
    
    let availableUsers = Array.from(this.users.values())
      .filter(user => user.id !== userId && !swipedUserIds.has(user.id));

    if (filters) {
      if (filters.ageRange) {
        availableUsers = availableUsers.filter(
          user => user.age >= filters.ageRange![0] && user.age <= filters.ageRange![1]
        );
      }
      
      if (filters.interests && filters.interests.length > 0) {
        availableUsers = availableUsers.filter(user => 
          user.interests?.some(interest => filters.interests!.includes(interest))
        );
      }
      
      if (filters.education) {
        availableUsers = availableUsers.filter(user => user.education === filters.education);
      }
      
      // For distance filtering, we'd need to implement actual distance calculation
      // For now, just return all users that match other criteria
    }

    return availableUsers.slice(0, 10);
  }

  async getDiscoveryUsersWithLocation(
    userId: string, 
    userLat: number, 
    userLon: number, 
    maxDistance: number, 
    limit: number = 10
  ): Promise<(User & { distance: number })[]> {
    const userSwipes = await this.getUserSwipes(userId);
    const swipedUserIds = new Set(userSwipes.map(swipe => swipe.swipedId));
    
    const availableUsers = Array.from(this.users.values())
      .filter(user => user.id !== userId && !swipedUserIds.has(user.id))
      .filter(user => user.latitude && user.longitude) // Only users with location
      .map(user => {
        const distance = calculateDistance(
          userLat,
          userLon,
          parseFloat(user.latitude as string),
          parseFloat(user.longitude as string)
        );
        return { ...user, distance };
      })
      .filter(user => user.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return availableUsers;
  }

  async updateUserLocation(userId: string, latitude: number, longitude: number, location?: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...user,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      location: location || user.location,
      lastActive: new Date(),
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();
