import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";
import * as storage from "./storage";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

declare module "express-session" {
  interface SessionData {
    userId: string;
    role: string;
  }
}

function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.session.userId)
    return res.status(401).json({ message: "Unauthorized" });
  next();
}

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session.userId || req.session.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  const MemStore = MemoryStore(session);

  app.set("trust proxy", 1);

  app.use(
    session({
      store: new MemStore({
        checkPeriod: 86400000,
      }),
      secret: process.env.SESSION_SECRET || "bizony-secret-2026",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    }),
  );

  app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    next();
  });

  // ── Auth ──────────────────────────────────────────────
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const ip = req.ip || "unknown";

    try {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        await storage.addLoginLog({
          email: username,
          timestamp: new Date().toLocaleString("pl-PL"),
          ip,
          status: "failure",
        });
        return res
          .status(401)
          .json({ message: "Nieprawidłowe dane logowania" });
      }

      if (user.is2FAEnabled) {
        await storage.addLoginLog({
          email: username,
          timestamp: new Date().toLocaleString("pl-PL"),
          ip,
          status: "2fa_pending",
        });
        // Zwróć info że potrzebny jest kod 2FA
        return res.json({
          id: user.id,
          username: user.username,
          role: user.role,
          is2FAEnabled: true,
          requires2FA: true,
        });
      }
      req.session.userId = user.id;
      req.session.role = user.role;

      await storage.addLoginLog({
        email: username,
        timestamp: new Date().toLocaleString("pl-PL"),
        ip,
        status: "success",
      });

      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
        is2FAEnabled: user.is2FAEnabled,
      });
    } catch (err) {
      res.status(500).json({ message: "Błąd serwera" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => res.json({ ok: true }));
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) return res.status(401).json(null);
    const user = await storage.getUserById(req.session.userId);
    if (!user) return res.status(401).json(null);
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      is2FAEnabled: user.is2FAEnabled,
    });
  });

  // Generuj secret i QR kod
  app.post("/api/auth/2fa/setup", requireAuth, async (req, res) => {
    const user = await storage.getUserById(req.session.userId!);
    if (!user)
      return res.status(404).json({ message: "Nie znaleziono użytkownika" });
    const secret = speakeasy.generateSecret({ length: 20 }).base32;
    const otpauth = speakeasy.otpauthURL({
      secret,
      label: user.username,
      issuer: "Bizony Rzeszów",
      encoding: "base32",
    });
    const qrCode = await QRCode.toDataURL(otpauth);
    // Zapisz tymczasowo secret (niezweryfikowany jeszcze)
    await storage.updateUser2FA(user.id, false, secret);
    res.json({ secret, qrCode });
  });

  // Weryfikuj kod i włącz 2FA
  app.post("/api/auth/2fa/verify", requireAuth, async (req, res) => {
    const { token } = req.body;
    const user = await storage.getUserById(req.session.userId!);
    if (!user || !user.twoFASecret)
      return res.status(400).json({ message: "Brak skonfigurowanego 2FA" });
    const isValid = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token,
      window: 2,
    });
    if (!isValid) return res.status(400).json({ message: "Nieprawidłowy kod" });
    await storage.updateUser2FA(user.id, true, user.twoFASecret);
    res.json({ ok: true });
  });

  // Wyłącz 2FA
  app.post("/api/auth/2fa/disable", requireAuth, async (req, res) => {
    const { token } = req.body;
    const user = await storage.getUserById(req.session.userId!);
    if (!user || !user.twoFASecret)
      return res.status(400).json({ message: "Brak skonfigurowanego 2FA" });
    const isValid = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token,
      window: 2,
    });
    if (!isValid) return res.status(400).json({ message: "Nieprawidłowy kod" });
    await storage.updateUser2FA(user.id, false, null);
    res.json({ ok: true });
  });

  app.post("/api/auth/2fa/login", async (req, res) => {
    const { userId, token } = req.body;
    const user = await storage.getUserById(userId);
    if (!user || !user.twoFASecret)
      return res.status(400).json({ message: "Błąd" });
    const isValid = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token,
      window: 2,
    });
    if (!isValid)
      return res.status(401).json({ message: "Nieprawidłowy kod 2FA" });
    req.session.userId = user.id;
    req.session.role = user.role;
    await storage.addLoginLog({
      email: user.username,
      timestamp: new Date().toLocaleString("pl-PL"),
      ip: req.ip || "unknown",
      status: "success",
    });
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      is2FAEnabled: true,
    });
  });

  // ── News ──────────────────────────────────────────────
  app.get("/api/news", async (_req, res) => {
    res.json(await storage.getAllNews());
  });

  app.post("/api/news", requireAuth, async (req, res) => {
    const { id, createdAt, ...data } = req.body;
    const item = await storage.createNews({
      ...data,
      date: new Date().toISOString().split("T")[0],
    });
    res.json(item);
  });

  app.put("/api/news/:id", requireAuth, async (req, res) => {
    const { id, createdAt, ...data } = req.body;
    const item = await storage.updateNews(req.params.id, data);
    res.json(item);
  });

  app.delete("/api/news/:id", requireAuth, async (req, res) => {
    await storage.deleteNews(req.params.id);
    res.json({ ok: true });
  });

  // ── Players ──────────────────────────────────────────────
  app.get("/api/players", async (_req, res) => {
    const items = await storage.getAllPlayers();
    res.json(items);
  });

  app.post("/api/players", requireAuth, async (req, res) => {
    const { id, ...data } = req.body;
    const item = await storage.createPlayer(data);
    res.json(item);
  });

  app.post("/api/players", requireAuth, async (req, res) => {
    const item = await storage.createPlayer(req.body);
    res.json(item);
  });

  app.put("/api/players/:id", requireAuth, async (req, res) => {
    const item = await storage.updatePlayer(req.params.id, req.body);
    res.json(item);
  });

  app.delete("/api/players/:id", requireAuth, async (req, res) => {
    await storage.deletePlayer(req.params.id);
    res.json({ ok: true });
  });

  // ── Results ──────────────────────────────────────────────
  app.get("/api/results", async (_req, res) => {
    const items = await storage.getAllResults();
    res.json(items);
  });

  app.post("/api/results", requireAuth, async (req, res) => {
    const { id, ...data } = req.body;
    const item = await storage.createResult(data);
    res.json(item);
  });

  app.post("/api/results", requireAuth, async (req, res) => {
    const item = await storage.createResult(req.body);
    res.json(item);
  });

  app.put("/api/results/:id", requireAuth, async (req, res) => {
    const item = await storage.updateResult(req.params.id, req.body);
    res.json(item);
  });

  app.delete("/api/results/:id", requireAuth, async (req, res) => {
    await storage.deleteResult(req.params.id);
    res.json({ ok: true });
  });

  // ── Standings ──────────────────────────────────────────────
  app.get("/api/standings", async (_req, res) => {
    res.json(await storage.getAllStandings());
  });

  app.put("/api/standings", requireAuth, async (req, res) => {
    const items = req.body.map((item: any, index: number) => ({
      ...item,
      played: parseInt(item.played) || 0,
      won: parseInt(item.won) || 0,
      lost: parseInt(item.lost) || 0,
      runsScored: parseInt(item.runsScored) || 0,
      runsAllowed: parseInt(item.runsAllowed) || 0,
      points: parseInt(item.points) || 0,
      sortOrder: index,
    }));
    const result = await storage.replaceStandings(items);
    res.json(result);
  });

  // ── Gallery ──────────────────────────────────────────────
  app.get("/api/gallery", async (_req, res) => {
    const items = await storage.getAllGalleryFolders();
    res.json(items);
  });

  app.post("/api/gallery", requireAuth, async (req, res) => {
    const { id, ...data } = req.body;
    const folder = await storage.createGalleryFolder({ ...data, images: [] });
    res.json(folder);
  });

  app.post("/api/gallery", requireAuth, async (req, res) => {
    const folder = await storage.createGalleryFolder({
      ...req.body,
      images: [],
    });
    res.json(folder);
  });

  app.put("/api/gallery/:id", requireAuth, async (req, res) => {
    const folder = await storage.updateGalleryFolder(req.params.id, req.body);
    res.json(folder);
  });

  app.delete("/api/gallery/:id", requireAuth, async (req, res) => {
    await storage.deleteGalleryFolder(req.params.id);
    res.json({ ok: true });
  });

  // ── Site Settings ──────────────────────────────────────────────
  app.get("/api/settings/:key", async (req, res) => {
    const value = await storage.getSetting(req.params.key);
    res.json(value);
  });

  app.put("/api/settings/:key", requireAuth, async (req, res) => {
    await storage.setSetting(req.params.key, req.body);
    res.json({ ok: true });
  });

  // ── Users (admin only) ──────────────────────────────────────────────
  app.get("/api/users", requireAdmin, async (_req, res) => {
    const all = await storage.getAllUsers();
    res.json(
      all.map((u) => ({
        id: u.id,
        username: u.username,
        role: u.role,
        is2FAEnabled: u.is2FAEnabled,
      })),
    );
  });

  app.post("/api/users", requireAdmin, async (req, res) => {
    const hashed = await bcrypt.hash(req.body.password || "changeme123", 10);
    const user = await storage.createUser({ ...req.body, password: hashed });
    res.json({ id: user.id, username: user.username, role: user.role });
  });

  app.put("/api/users/:id/role", requireAdmin, async (req, res) => {
    const user = await storage.updateUserRole(req.params.id, req.body.role);
    res.json({ id: user.id, username: user.username, role: user.role });
  });

  app.delete("/api/users/:id", requireAdmin, async (req, res) => {
    await storage.deleteUser(req.params.id);
    res.json({ ok: true });
  });

  // ── Login Logs ──────────────────────────────────────────────
  app.get("/api/logs", requireAdmin, async (_req, res) => {
    res.json(await storage.getLoginLogs());
  });

  // ── Cloudinary upload signature ──────────────────────────────────────────────
  app.get("/api/upload-config", requireAuth, (_req, res) => {
    res.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
  });

  app.put("/api/auth/password", requireAuth, async (req, res) => {
    const { password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Hasło za krótkie" });
    }
    const hashed = await bcrypt.hash(password, 10);
    await storage.updateUserPassword(req.session.userId!, hashed);
    res.json({ ok: true });
  });
  // ── Keep-alive ping ──────────────────────────────────────────────
  app.get("/ping", (_req, res) => {
    res.status(200).send("pong");
  });
  // ── Warmup (budzi połączenie z Neon DB) ──────────────────────────
  app.get("/warmup", async (_req, res) => {
    try {
      await storage.getAllPlayers();
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ ok: false });
    }
  });
  // ── Join form — wysyłka zgłoszenia na Messenger ──────────────────
  app.post("/api/join", async (req, res) => {
    const { name, age, phone, experience, availability } = req.body;

    const message =
      `⚾ Nowe zgłoszenie!\n\n` +
      `👤 ${name}, lat ${age}\n` +
      `📞 ${phone}\n` +
      `🏃 Doświadczenie: ${experience}\n` +
      `📅 Dostępność: ${availability}`;

    try {
      const fbRes = await fetch("https://graph.facebook.com/v21.0/me/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: process.env.ADMIN_PSID },
          message: { text: message },
          access_token: process.env.FB_PAGE_TOKEN,
        }),
      });

      if (!fbRes.ok) {
        const err = await fbRes.json();
        console.error("FB Messenger error:", err);
        return res.status(500).json({ message: "Błąd wysyłki na Messenger" });
      }

      res.json({ ok: true });
    } catch (err) {
      console.error("Join endpoint error:", err);
      res.status(500).json({ message: "Błąd serwera" });
    }
  });

  // ── Seed artykułów startowych (wywołaj raz przez GET /api/learn/seed) ──────
    app.get("/api/learn/seed", requireAuth, async (_req, res) => {
      const { db } = await import("./db");
      const { learnArticles } = await import("@shared/schema");

      await db.insert(learnArticles).values([
        {
          slug: "podstawy-baseballu",
          sortOrder: 0,
          title: "Podstawy baseballu — czym jest ta gra?",
          excerpt: "Inning, strike, home run — co to właściwie znaczy? Wyjaśniamy od zera.",
          image: "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=800",
          content: `<h2>Czym jest baseball?</h2><p>Baseball to sport drużynowy rozgrywany między dwiema drużynami po 9 zawodników. Celem jest zdobycie jak największej liczby punktów (runów) przez okrążenie czterech baz na boisku.</p><h2>Jak liczyć inningi?</h2><p>Mecz składa się z 9 <strong>inningów</strong>. W każdym inningu obie drużyny mają szansę zarówno atakować (odbijać), jak i bronić (łapać piłki). Drużyna broniąca musi wyeliminować 3 graczy atakujących, żeby zakończyć swoją połowę inningu.</p><h2>Strike, ball, out</h2><p><strong>Strike</strong> — uderzenie lub nieudane odbicie piłki w strefie. Trzy strike'i = out.<br/><strong>Ball</strong> — rzut poza strefą. Cztery balle = gracz idzie na pierwszą bazę.<br/><strong>Out</strong> — wyeliminowanie gracza. Trzy outy kończą połowę inningu.</p><h2>Home run</h2><p>Najefektowniejszy element gry — piłka wylatuje poza boisko, a wszystkie osoby na bazach (i bijący) mogą spokojnie okrążyć wszystkie bazy i zdobyć punkty.</p>`,
        },
        {
          slug: "pozycje-na-boisku",
          sortOrder: 1,
          title: "Pozycje na boisku — kto robi co?",
          excerpt: "Pitcher, catcher, shortstop... Baseball ma 9 pozycji obronnych. Poznaj każdą z nich.",
          image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800",
          content: `<h2>9 pozycji w baseballu</h2><p>Drużyna broniąca wystawia 9 zawodników na różnych pozycjach. Każda ma inną rolę i wymaga innych umiejętności.</p><h2>Miotacz (Pitcher)</h2><p>Najważniejsza pozycja w obronie. Miotacz rzuca piłkę do łapacza starając się sprawić, żeby pałkarz jej nie trafił lub trafił słabo.</p><h2>Łapacz (Catcher)</h2><p>Łapacz kuca za pałkarzem i przyjmuje każdy rzut miotacza. Kieruje grą obronną, podpowiadając miotaczowi jakich rzutów używać.</p><h2>Gracze wewnętrzni (Infielders)</h2><p><strong>1B</strong> — strzeże pierwszej bazy.<br/><strong>2B</strong> — chroni drugą bazę i środek pola.<br/><strong>3B</strong> — wymaga szybkich reakcji na mocne uderzenia.<br/><strong>SS (shortstop)</strong> — kluczowa pozycja między drugą a trzecią bazą.</p><h2>Gracze zewnętrzni (Outfielders)</h2><p><strong>LF, CF, RF</strong> — lewy, środkowy i prawy zapolowy. Łapią piłki wylatujące daleko od boiska wewnętrznego.</p>`,
        },
        {
          slug: "jak-czytac-statystyki",
          sortOrder: 2,
          title: "Jak czytać statystyki baseballowe?",
          excerpt: "ERA, batting average, RBI — statystyki baseballowe wyglądają skomplikowanie, ale są logiczne.",
          image: "https://images.unsplash.com/photo-1551958219-acbc595b3cd8?w=800",
          content: `<h2>Statystyki pałkarzy</h2><p><strong>AVG (Batting Average)</strong> — średnia uderzeń. AVG .300 to bardzo dobry wynik.</p><p><strong>RBI (Runs Batted In)</strong> — liczba punktów zdobytych dzięki uderzeniu gracza.</p><p><strong>HR (Home Runs)</strong> — liczba home runów.</p><p><strong>OBP (On-Base Percentage)</strong> — jak często gracz dostaje się na bazę.</p><h2>Statystyki miotaczy</h2><p><strong>ERA (Earned Run Average)</strong> — średnia liczba punktów na 9 inningów. ERA poniżej 3.00 to wynik klasy światowej.</p><p><strong>K (Strikeouts)</strong> — liczba wyeliminowań przez trzy strike'i.</p><p><strong>WHIP</strong> — ile graczy średnio wchodzi na bazę w każdym inningu. Im niższy, tym lepiej.</p>`,
        },
      ]).onConflictDoNothing();

      res.json({ ok: true, seeded: 3 });
    });
    return httpServer;
  }
  
  // ── Learn Articles ──────────────────────────────────────────────
  app.get("/api/learn", async (_req, res) => {
    res.json(await storage.getAllLearnArticles());
  });

  app.get("/api/learn/:slug", async (req, res) => {
    const article = await storage.getLearnArticleBySlug(req.params.slug);
    if (!article) return res.status(404).json({ message: "Nie znaleziono artykułu" });
    res.json(article);
  });

  app.post("/api/learn", requireAuth, async (req, res) => {
    const { id, createdAt, ...data } = req.body;
    const article = await storage.createLearnArticle(data);
    res.json(article);
  });

  app.put("/api/learn/:id", requireAuth, async (req, res) => {
    const { id, createdAt, ...data } = req.body;
    const article = await storage.updateLearnArticle(req.params.id, data);
    res.json(article);
  });

  app.delete("/api/learn/:id", requireAuth, async (req, res) => {
    await storage.deleteLearnArticle(req.params.id);
    res.json({ ok: true });
  });
