import { type User, type InsertUser, type Swipe, type InsertSwipe, type Match, type Message, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;
  getDiscoveryUsers(userId: string, limit?: number): Promise<User[]>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private swipes: Map<string, Swipe>;
  private matches: Map<string, Match>;
  private messages: Map<string, Message>;

  constructor() {
    this.users = new Map();
    this.swipes = new Map();
    this.matches = new Map();
    this.messages = new Map();
    
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
        location: "2 miles away"
      },
      {
        name: "Mike",
        age: 28,
        bio: "Software engineer who loves rock climbing and outdoor adventures",
        jobTitle: "Software Engineer",
        company: "Google",
        photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"],
        interests: ["Rock Climbing", "Technology", "Fitness", "Music"],
        location: "5 miles away"
      },
      {
        name: "Emma",
        age: 24,
        bio: "Artist and yoga instructor spreading good vibes ✨",
        jobTitle: "Yoga Instructor",
        company: "Mindful Studio",
        photos: ["https://images.unsplash.com/photo-1494790108755-2616c27945f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"],
        interests: ["Yoga", "Art", "Meditation", "Nature"],
        location: "3 miles away"
      },
      {
        name: "Alex",
        age: 29,
        bio: "Chef passionate about creating amazing culinary experiences",
        jobTitle: "Head Chef",
        company: "Fine Dining Restaurant",
        photos: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"],
        interests: ["Cooking", "Wine", "Travel", "Food Photography"],
        location: "4 miles away"
      }
    ];

    sampleUsers.forEach(user => {
      const id = randomUUID();
      const fullUser: User = {
        ...user,
        id,
        createdAt: new Date(),
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
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...existingUser, ...updates };
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
}

export const storage = new MemStorage();
