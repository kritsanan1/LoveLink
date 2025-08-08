import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, json, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  bio: text("bio"),
  jobTitle: text("job_title"),
  company: text("company"),
  photos: json("photos").$type<string[]>().default([]),
  interests: json("interests").$type<string[]>().default([]),
  location: text("location"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  maxDistance: integer("max_distance").default(25), // km
  ageRangeMin: integer("age_range_min").default(18),
  ageRangeMax: integer("age_range_max").default(35),
  lookingFor: text("looking_for").default("serious"), // casual, serious, friendship
  education: text("education"),
  height: integer("height"), // cm
  verified: boolean("verified").default(false),
  premium: boolean("premium").default(false),
  lastActive: timestamp("last_active").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const swipes = pgTable("swipes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  swiperId: varchar("swiper_id").notNull().references(() => users.id),
  swipedId: varchar("swiped_id").notNull().references(() => users.id),
  isLike: boolean("is_like").notNull(),
  isSuperLike: boolean("is_super_like").default(false),
  boost: boolean("boost").default(false), // premium boost feature
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user1Id: varchar("user1_id").notNull().references(() => users.id),
  user2Id: varchar("user2_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => matches.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  messageType: text("message_type").default("text"), // text, gif, photo
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  dealBreakers: json("deal_breakers").$type<string[]>().default([]),
  ethnicityPreference: json("ethnicity_preference").$type<string[]>().default([]),
  religionPreference: json("religion_preference").$type<string[]>().default([]),
  lifestylePrefs: json("lifestyle_prefs").$type<{
    smoking: string;
    drinking: string;
    exercise: string;
    pets: string;
  }>().default({}),
  notifications: json("notifications").$type<{
    matches: boolean;
    messages: boolean;
    likes: boolean;
    superLikes: boolean;
  }>().default({ matches: true, messages: true, likes: true, superLikes: true }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const boosts = pgTable("boosts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // profile_boost, super_boost
  duration: integer("duration").notNull(), // minutes
  startedAt: timestamp("started_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSwipeSchema = createInsertSchema(swipes).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
});

export const insertBoostSchema = createInsertSchema(boosts).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Swipe = typeof swipes.$inferSelect;
export type InsertSwipe = z.infer<typeof insertSwipeSchema>;
export type Match = typeof matches.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type Boost = typeof boosts.$inferSelect;
export type InsertBoost = z.infer<typeof insertBoostSchema>;
