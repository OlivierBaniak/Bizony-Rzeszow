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
  video_url: text("video_url").default(""),  // ← DODAJ TO
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
  runsScored: integer("runs_scored").notNull().default(0),
  runsAllowed: integer("runs_allowed").notNull().default(0),
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

// ── Dodaj na końcu schema.ts, przed exportami typów ──────────────────

export const learnArticles = pgTable("learn_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  image: text("image").notNull().default(""),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLearnArticleSchema = createInsertSchema(learnArticles).omit({ id: true, createdAt: true });
export type LearnArticle = typeof learnArticles.$inferSelect;
export type InsertLearnArticle = z.infer<typeof insertLearnArticleSchema>;

// ── Seed — 3 artykuły startowe (wklej do osobnego pliku seed.ts lub wywołaj raz) ──
//
// import { db } from "./db";
// import { learnArticles } from "@shared/schema";
//
// await db.insert(learnArticles).values([
//   {
//     slug: "podstawy-baseballu",
//     sortOrder: 0,
//     title: "Podstawy baseballu — czym jest ta gra?",
//     excerpt: "Inning, strike, home run — co to właściwie znaczy? Wyjaśniamy od zera.",
//     image: "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=800",
//     content: `<h2>Czym jest baseball?</h2><p>Baseball to sport drużynowy rozgrywany między dwiema drużynami po 9 zawodników. Celem jest zdobycie jak największej liczby punktów (runów) przez okrążenie czterech baz na boisku.</p><h2>Jak liczyć inningi?</h2><p>Mecz składa się z 9 <strong>inningów</strong>. W każdym inningu obie drużyny mają szansę zarówno atakować (odbijać), jak i bronić (łapać piłki). Drużyna broniąca musi wyeliminować 3 graczy atakujących, żeby zakończyć swoją połowę inningu.</p><h2>Strike, ball, out</h2><p><strong>Strike</strong> — uderzenie lub nieudane odbicie piłki w strefie. Trzy strike'i = out.<br/><strong>Ball</strong> — rzut poza strefą. Cztery balle = gracz idzie na pierwszą bazę.<br/><strong>Out</strong> — wyeliminowanie gracza. Trzy outy kończą połowę inningu.</p><h2>Home run</h2><p>Najefektowniejszy element gry — piłka wylatuje poza boisko, a wszystkie osoby na bazach (i bijący) mogą spokojnie okrążyć wszystkie bazy i zdobyć punkty.</p>`,
//   },
//   {
//     slug: "pozycje-na-boisku",
//     sortOrder: 1,
//     title: "Pozycje na boisku — kto robi co?",
//     excerpt: "Pitcher, catcher, shortstop... Baseball ma 9 pozycji obronnych. Poznaj każdą z nich.",
//     image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800",
//     content: `<h2>9 pozycji w baseballu</h2><p>Drużyna broniąca wystawia 9 zawodników na różnych pozycjach. Każda ma inną rolę i wymaga innych umiejętności.</p><h2>Miotacz (Pitcher)</h2><p>Najważniejsza pozycja w obronie. Miotacz rzuca piłkę do łapacza starając się sprawić, żeby pałkarz jej nie trafił lub trafił słabo.</p><h2>Łapacz (Catcher)</h2><p>Łapacz kuca za pałkarzem i przyjmuje każdy rzut miotacza. Kieruje grą obronną, podpowiadając miotaczowi jakich rzutów używać.</p><h2>Gracze wewnętrzni (Infielders)</h2><p><strong>1B (pierwsza baza)</strong> — strzeże pierwszej bazy, najczęściej kończy zagrania obronne.<br/><strong>2B (druga baza)</strong> — chroni drugą bazę i środek pola.<br/><strong>3B (trzecia baza)</strong> — wymaga szybkich reakcji na mocne uderzenia.<br/><strong>SS (shortstop)</strong> — kluczowa pozycja między drugą a trzecią bazą, często najlepszy gracz obrony.</p><h2>Gracze zewnętrzni (Outfielders)</h2><p><strong>LF, CF, RF</strong> — lewy, środkowy i prawy zapolowy. Łapią piłki wylatujące daleko od boiska wewnętrznego.</p>`,
//   },
//   {
//     slug: "jak-czytac-statystyki",
//     sortOrder: 2,
//     title: "Jak czytać statystyki baseballowe?",
//     excerpt: "ERA, batting average, RBI — statystyki baseballowe wyglądają skomplikowanie, ale są logiczne.",
//     image: "https://images.unsplash.com/photo-1551958219-acbc595b3cd8?w=800",
//     content: `<h2>Statystyki pałkarzy</h2><p>Baseball słynie z bogactwa statystyk. Oto najważniejsze dla pałkarzy:</p><p><strong>AVG (Batting Average)</strong> — średnia uderzeń. Liczba trafień podzielona przez liczbę podejść. AVG .300 to bardzo dobry wynik.</p><p><strong>RBI (Runs Batted In)</strong> — liczba punktów zdobytych dzięki uderzeniu danego gracza. Wysoki RBI oznacza skutecznego pałkarza w kluczowych momentach.</p><p><strong>HR (Home Runs)</strong> — liczba home runów. Prosta, spektakularna statystyka.</p><p><strong>OBP (On-Base Percentage)</strong> — jak często gracz dostaje się na bazę (trafienia + balle + trafienie piłką).</p><h2>Statystyki miotaczy</h2><p><strong>ERA (Earned Run Average)</strong> — średnia liczba punktów zdobytych na miotacza na 9 inningów. ERA poniżej 3.00 to wynik klasy światowej.</p><p><strong>K (Strikeouts)</strong> — liczba wyeliminowań przez trzy strike'i. Wysoki K świadczy o dominującym miotaczu.</p><p><strong>WHIP (Walks + Hits per Inning Pitched)</strong> — ile graczy średnio wchodzi na bazę w każdym inningu miotacza. Im niższy, tym lepiej.</p>`,
//   },
// ]).onConflictDoNothing();
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  price: integer("price").notNull().default(0), // cena w groszach (np. 4900 = 49 zł)
  image: text("image").notNull().default(""),
  sizes: jsonb("sizes").$type<string[]>().default([]),
  category: text("category").notNull().default(""),
  inStock: boolean("in_stock").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull().default(""),
  customerAddress: text("customer_address").notNull(),
  items: jsonb("items").notNull().default([]),
  totalAmount: integer("total_amount").notNull().default(0),
  paymentMethod: text("payment_method").notNull().default("transfer"),
  status: text("status").notNull().default("new"),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });

export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type NewsItem = typeof news.$inferSelect;
export type Player = typeof players.$inferSelect;
export type GameResult = typeof gameResults.$inferSelect;
export type Standing = typeof standings.$inferSelect;
export type GalleryFolder = typeof galleryFolders.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type LoginLog = typeof loginLogs.$inferSelect;

