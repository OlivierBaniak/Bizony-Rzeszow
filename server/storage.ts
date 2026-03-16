import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, news, players, gameResults, standings,
  galleryFolders, siteSettings, loginLogs,
  type User, type NewsItem, type Player, type GameResult,
  type Standing, type GalleryFolder, type LoginLog,
} from "@shared/schema";

// ── Users ──────────────────────────────────────────────
export async function getUserByUsername(username: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result[0];
}

export async function getUserById(id: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function getAllUsers(): Promise<User[]> {
  return db.select().from(users);
}

export async function createUser(data: { username: string; password: string; role?: string }): Promise<User> {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}

export async function updateUserRole(id: string, role: string): Promise<User> {
  const result = await db.update(users).set({ role }).where(eq(users.id, id)).returning();
  return result[0];
}

export async function toggle2FA(id: string, enabled: boolean, secret?: string): Promise<User> {
  const result = await db.update(users)
    .set({ is2FAEnabled: enabled, twoFASecret: secret ?? null })
    .where(eq(users.id, id))
    .returning();
  return result[0];
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id));
}

// ── News ──────────────────────────────────────────────
export async function getAllNews(): Promise<NewsItem[]> {
  return db.select().from(news).orderBy(desc(news.createdAt));
}

export async function createNews(data: Omit<NewsItem, "id" | "createdAt">): Promise<NewsItem> {
  const result = await db.insert(news).values(data).returning();
  return result[0];
}

export async function updateNews(id: string, data: Partial<NewsItem>): Promise<NewsItem> {
  const result = await db.update(news).set(data).where(eq(news.id, id)).returning();
  return result[0];
}

export async function deleteNews(id: string): Promise<void> {
  await db.delete(news).where(eq(news.id, id));
}

// ── Players ──────────────────────────────────────────────
export async function getAllPlayers(): Promise<Player[]> {
  return db.select().from(players);
}

export async function createPlayer(data: Omit<Player, "id">): Promise<Player> {
  const result = await db.insert(players).values(data).returning();
  return result[0];
}

export async function updatePlayer(id: string, data: Partial<Player>): Promise<Player> {
  const result = await db.update(players).set(data).where(eq(players.id, id)).returning();
  return result[0];
}

export async function deletePlayer(id: string): Promise<void> {
  await db.delete(players).where(eq(players.id, id));
}

// ── Game Results ──────────────────────────────────────────────
export async function getAllResults(): Promise<GameResult[]> {
  return db.select().from(gameResults).orderBy(desc(gameResults.date));
}

export async function createResult(data: Omit<GameResult, "id">): Promise<GameResult> {
  const result = await db.insert(gameResults).values(data).returning();
  return result[0];
}

export async function updateResult(id: string, data: Partial<GameResult>): Promise<GameResult> {
  const result = await db.update(gameResults).set(data).where(eq(gameResults.id, id)).returning();
  return result[0];
}

export async function deleteResult(id: string): Promise<void> {
  await db.delete(gameResults).where(eq(gameResults.id, id));
}

// ── Standings ──────────────────────────────────────────────
export async function getAllStandings(): Promise<Standing[]> {
  return db.select().from(standings).orderBy(standings.sortOrder);
}

export async function replaceStandings(items: Omit<Standing, "id">[]): Promise<Standing[]> {
  await db.delete(standings);
  if (items.length === 0) return [];
  return db.insert(standings).values(items).returning();
}

// ── Gallery ──────────────────────────────────────────────
export async function getAllGalleryFolders(): Promise<GalleryFolder[]> {
  return db.select().from(galleryFolders);
}

export async function createGalleryFolder(data: Omit<GalleryFolder, "id">): Promise<GalleryFolder> {
  const result = await db.insert(galleryFolders).values(data).returning();
  return result[0];
}

export async function updateGalleryFolder(id: string, data: Partial<GalleryFolder>): Promise<GalleryFolder> {
  const result = await db.update(galleryFolders).set(data).where(eq(galleryFolders.id, id)).returning();
  return result[0];
}

export async function deleteGalleryFolder(id: string): Promise<void> {
  await db.delete(galleryFolders).where(eq(galleryFolders.id, id));
}

// ── Site Settings (JSON key-value store) ──────────────────────────────────────────────
export async function getSetting(key: string): Promise<any> {
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result[0]?.value ?? null;
}

export async function setSetting(key: string, value: any): Promise<void> {
  await db.insert(siteSettings)
    .values({ key, value })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
}

// ── Login Logs ──────────────────────────────────────────────
export async function addLoginLog(data: Omit<LoginLog, "id">): Promise<void> {
  await db.insert(loginLogs).values(data);
}

export async function getLoginLogs(): Promise<LoginLog[]> {
  return db.select().from(loginLogs).orderBy(desc(loginLogs.timestamp)).limit(100);
}

export async function updateUserPassword(id: string, password: string): Promise<void> {
  await db.update(users).set({ password }).where(eq(users.id, id));
}

export async function updateUser2FA(id: string, enabled: boolean, secret: string | null): Promise<void> {
  await db.update(users).set({ is2FAEnabled: enabled, twoFASecret: secret }).where(eq(users.id, id));
}