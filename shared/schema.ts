import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("editor"),
  is2FAEnabled: boolean("is_2fa_enabled").default(false),
  twoFASecret: text("two_fa_secret"),
});

export const news = pgTable("news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  date: text("date").notNull(),
  image: text("image").notNull().default(""),
  images: jsonb("images").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  number: integer("number").notNull().default(0),
  position: text("position").notNull().default(""),
  fieldPosition: text("field_position").default(""),
  image: text("image").notNull().default(""),
});

export const gameResults = pgTable("game_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  location: text("location").notNull().default(""),
  opponent: text("opponent").notNull(),
  competition: text("competition").notNull().default(""),
  result: text("result").notNull().default("W"),
  pointsScored: integer("points_scored").notNull().default(0),
  pointsConceded: integer("points_conceded").notNull().default(0),
});

export const standings = pgTable("standings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  team: text("team").notNull(),
  played: integer("played").notNull().default(0),
  won: integer("won").notNull().default(0),
  lost: integer("lost").notNull().default(0),
  points: integer("points").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const galleryFolders = pgTable("gallery_folders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  mainImage: text("main_image").notNull().default(""),
  images: jsonb("images").notNull().default([]),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
});

export const loginLogs = pgTable("login_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  timestamp: text("timestamp").notNull(),
  ip: text("ip").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true, role: true });
export const insertNewsSchema = createInsertSchema(news).omit({ id: true, createdAt: true });
export const insertPlayerSchema = createInsertSchema(players).omit({ id: true });
export const insertGameResultSchema = createInsertSchema(gameResults).omit({ id: true });
export const insertStandingSchema = createInsertSchema(standings).omit({ id: true });
export const insertGalleryFolderSchema = createInsertSchema(galleryFolders).omit({ id: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type NewsItem = typeof news.$inferSelect;
export type Player = typeof players.$inferSelect;
export type GameResult = typeof gameResults.$inferSelect;
export type Standing = typeof standings.$inferSelect;
export type GalleryFolder = typeof galleryFolders.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type LoginLog = typeof loginLogs.$inferSelect;
