import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";
import * as storage from "./storage";

declare module "express-session" {
  interface SessionData {
    userId: string;
    role: string;
  }
}

function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
  next();
}

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session.userId || req.session.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  const MemStore = MemoryStore(session);

  app.set("trust proxy", 1);

  app.use(session({
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
  }));

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
        return res.status(401).json({ message: "Nieprawidłowe dane logowania" });
      }

      req.session.userId = user.id;
      req.session.role = user.role;

      await storage.addLoginLog({
        email: username,
        timestamp: new Date().toLocaleString("pl-PL"),
        ip,
        status: "success",
      });

      res.json({ id: user.id, username: user.username, role: user.role, is2FAEnabled: user.is2FAEnabled });
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
    res.json({ id: user.id, username: user.username, role: user.role, is2FAEnabled: user.is2FAEnabled });
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
    const items = req.body.map((item: any, index: number) => ({ ...item, sortOrder: index }));
    const result = await storage.replaceStandings(items);
    res.json(result);
  });

  // ── Gallery ──────────────────────────────────────────────
  app.post("/api/gallery", requireAuth, async (req, res) => {
    const { id, ...data } = req.body;
    const folder = await storage.createGalleryFolder({ ...data, images: [] });
    res.json(folder);
  });

  app.post("/api/gallery", requireAuth, async (req, res) => {
    const folder = await storage.createGalleryFolder({ ...req.body, images: [] });
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
    res.json(all.map(u => ({ id: u.id, username: u.username, role: u.role, is2FAEnabled: u.is2FAEnabled })));
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

  return httpServer;
}
