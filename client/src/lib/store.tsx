import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// ── Types ──────────────────────────────────────────────
export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  video_url?: string;
  images?: string[];
};

export type Player = {
  id: string;
  name: string;
  number: number;
  position: string;
  image: string;
};

export type Standing = {
  id: string;
  team: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  sortOrder?: number;
};

export type LeagueMetadata = {
  title: string;
  subtitle: string;
};

export type GalleryImage = {
  id: string;
  url: string;
  description: string;
};

export type GalleryFolder = {
  id: string;
  title: string;
  description: string;
  mainImage: string;
  images: GalleryImage[];
};

export type ClubHistory = {
  content: string;
  images: string[];
};

export type Match = {
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  date: string;
  time: string;
  location: string;
  ticketLink: string;
};

export type ContactDetails = {
  address: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
};

export type GameResult = {
  id: string;
  date: string;
  location: string;
  opponent: string;
  competition: string;
  result: "W" | "L";
  pointsScored: number;
  pointsConceded: number;
};

export type User = {
  id: string;
  username: string;
  role: "admin" | "editor";
  is2FAEnabled?: boolean;
  twoFASecret?: string;
};

export type LoginLog = {
  id: string;
  email: string;
  timestamp: string;
  ip: string;
  status: "success" | "failure";
};

// ── Default values ──────────────────────────────────────────────
const DEFAULT_METADATA: LeagueMetadata = { title: "Tabela Ligowa", subtitle: "Sezon Zasadniczy 2026" };
const DEFAULT_HISTORY: ClubHistory = { content: "", images: [] };
const DEFAULT_MATCH: Match = { homeTeam: "Bizony", homeLogo: "", awayTeam: "Gość", awayLogo: "", date: "", time: "", location: "", ticketLink: "#" };
const DEFAULT_CONTACT: ContactDetails = { address: "", email: "", phone: "", facebook: "", instagram: "" };

// ── API helpers ──────────────────────────────────────────────
async function api(method: string, url: string, data?: any) {
  const res = await fetch(url, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      "Cache-Control": "no-cache",
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

// ── Cloudinary upload ──────────────────────────────────────────────
export async function uploadImage(file: File): Promise<string> {
  const config = await api("GET", "/api/upload-config");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", config.uploadPreset);
  formData.append("quality", "80");
  formData.append("fetch_format", "auto");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.secure_url;
}

export function optimizeImage(url: string, width = 800): string {
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
}

// ── Context ──────────────────────────────────────────────
type AppContextType = {
  news: NewsItem[];
  players: Player[];
  results: GameResult[];
  standings: Standing[];
  leagueMetadata: LeagueMetadata;
  galleryFolders: GalleryFolder[];
  clubHistory: ClubHistory;
  changePassword: (password: string) => Promise<void>;
  nextMatch: Match;
  contactDetails: ContactDetails;
  isAdmin: boolean;
  userRole: "admin" | "editor" | null;
  currentUser: User | null;
  users: User[];
  loginLogs: LoginLog[];
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addUser: (user: { username: string; password: string; role: "admin" | "editor" }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateUserRole: (id: string, role: "admin" | "editor") => Promise<void>;
  toggle2FA: () => Promise<void>;
  setup2FA: () => Promise<{ secret: string; qrCode: string }>;
  verify2FA: (token: string) => Promise<boolean>;
  disable2FA: (token: string) => Promise<boolean>;
  addNews: (item: Omit<NewsItem, "id" | "date">) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  updateNews: (item: NewsItem) => Promise<void>;
  addPlayer: (item: Omit<Player, "id">) => Promise<void>;
  deletePlayer: (id: string) => Promise<void>;
  updatePlayer: (item: Player) => Promise<void>;
  addResult: (item: Omit<GameResult, "id">) => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  updateResult: (item: GameResult) => Promise<void>;
  updateStandings: (items: Standing[]) => Promise<void>;
  updateLeagueMetadata: (metadata: LeagueMetadata) => Promise<void>;
  addGalleryFolder: (folder: Omit<GalleryFolder, "id" | "images">) => Promise<void>;
  deleteGalleryFolder: (id: string) => Promise<void>;
  addImageToFolder: (folderId: string, image: Omit<GalleryImage, "id">) => Promise<void>;
  deleteImageFromFolder: (folderId: string, imageId: string) => Promise<void>;
  updateClubHistory: (history: ClubHistory) => Promise<void>;
  updateNextMatch: (match: Match) => Promise<void>;
  updateContactDetails: (details: ContactDetails) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [results, setResults] = useState<GameResult[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [leagueMetadata, setLeagueMetadata] = useState<LeagueMetadata>(DEFAULT_METADATA);
  const [galleryFolders, setGalleryFolders] = useState<GalleryFolder[]>([]);
  const [clubHistory, setClubHistory] = useState<ClubHistory>(DEFAULT_HISTORY);
  const [nextMatch, setNextMatch] = useState<Match>(DEFAULT_MATCH);
  const [contactDetails, setContactDetails] = useState<ContactDetails>(DEFAULT_CONTACT);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "editor" | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all public data on mount
  useEffect(() => {
    async function loadAll() {
      try {
        const [n, p, r, s, g, meta, history, match, contact] = await Promise.all([
          api("GET", "/api/news").catch(() => []),
          api("GET", "/api/players").catch(() => []),
          api("GET", "/api/results").catch(() => []),
          api("GET", "/api/standings").catch(() => []),
          api("GET", "/api/gallery").catch(() => []),
          api("GET", "/api/settings/leagueMetadata").catch(() => DEFAULT_METADATA),
          api("GET", "/api/settings/clubHistory").catch(() => DEFAULT_HISTORY),
          api("GET", "/api/settings/nextMatch").catch(() => DEFAULT_MATCH),
          api("GET", "/api/settings/contactDetails").catch(() => DEFAULT_CONTACT),
        ]);
        setNews(n || []);
        setPlayers(p || []);
        setResults(r || []);
        setStandings(s || []);
        setGalleryFolders(g || []);
        if (meta) setLeagueMetadata(meta);
        if (history) setClubHistory(history);
        if (match) setNextMatch(match);
        if (contact) setContactDetails(contact);
      } catch (e) {
        console.error("Failed to load data", e);
      }

      // Check if already logged in
      try {
        const user = await api("GET", "/api/auth/me");
        if (user) {
          setCurrentUser(user);
          setUserRole(user.role);
          setIsAdmin(user.role === "admin");  // ← tylko dla admina
        }
      } catch {}

      setLoading(false);
    }
    loadAll();
  }, []);

  // Load admin data when logged in
  useEffect(() => {
    if (!isAdmin || userRole !== "admin") return;
    Promise.all([
      api("GET", "/api/users"),
      api("GET", "/api/logs"),
    ]).then(([u, l]) => {
      setUsers(u || []);
      setLoginLogs(l || []);
    }).catch(console.error);
  }, [isAdmin]);

  // ── Auth ──────────────────────────────────────────────
  const login = async (username: string, password: string): Promise<any> => {
    try {
      const data = await api("POST", "/api/auth/login", { username, password });
      if (data.requires2FA) {
        return { requires2FA: true, id: data.id };
      }
      setCurrentUser(data);
      setUserRole(data.role);
      setIsAdmin(data.role === "admin");
      return true;
    } catch {
      return false;
    }
  };

  const changePassword = async (newPassword: string) => {
    await api("PUT", "/api/auth/password", { password: newPassword });
  };

  const logout = async () => {
    await api("POST", "/api/auth/logout");
    setIsAdmin(false);
    setUserRole(null);
    setCurrentUser(null);
  };

  const setup2FA = async (): Promise<{ secret: string; qrCode: string }> => {
    return await api("POST", "/api/auth/2fa/setup");
  };

  const verify2FA = async (token: string): Promise<boolean> => {
    try {
      await api("POST", "/api/auth/2fa/verify", { token });
      if (currentUser) setCurrentUser({ ...currentUser, is2FAEnabled: true });
      return true;
    } catch {
      return false;
    }
  };

  const disable2FA = async (token: string): Promise<boolean> => {
    try {
      await api("POST", "/api/auth/2fa/disable", { token });
      if (currentUser) setCurrentUser({ ...currentUser, is2FAEnabled: false });
      return true;
    } catch {
      return false;
    }
  };

  const toggle2FA = async () => {};
  
  // ── Users ──────────────────────────────────────────────
  const addUser = async (data: { username: string; password: string; role: "admin" | "editor" }) => {
    const user = await api("POST", "/api/users", data);
    setUsers(prev => [...prev, user]);
  };

  const deleteUser = async (id: string) => {
    await api("DELETE", `/api/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateUserRole = async (id: string, role: "admin" | "editor") => {
    const user = await api("PUT", `/api/users/${id}/role`, { role });
    setUsers(prev => prev.map(u => u.id === id ? user : u));
  };

  // ── News ──────────────────────────────────────────────
  const addNews = async (item: Omit<NewsItem, "id" | "date">) => {
    const created = await api("POST", "/api/news", item);
    setNews(prev => [created, ...prev]);
  };

  const deleteNews = async (id: string) => {
    await api("DELETE", `/api/news/${id}`);
    setNews(prev => prev.filter(n => n.id !== id));
  };

  const updateNews = async (item: NewsItem) => {
    const updated = await api("PUT", `/api/news/${item.id}`, item);
    setNews(prev => prev.map(n => n.id === item.id ? updated : n));
  };

  // ── Players ──────────────────────────────────────────────
  const addPlayer = async (item: Omit<Player, "id">) => {
    const created = await api("POST", "/api/players", item);
    setPlayers(prev => [...prev, created]);
  };

  const deletePlayer = async (id: string) => {
    await api("DELETE", `/api/players/${id}`);
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const updatePlayer = async (item: Player) => {
    const updated = await api("PUT", `/api/players/${item.id}`, item);
    setPlayers(prev => prev.map(p => p.id === item.id ? updated : p));
  };

  // ── Results ──────────────────────────────────────────────
  const addResult = async (item: Omit<GameResult, "id">) => {
    const created = await api("POST", "/api/results", item);
    setResults(prev => [created, ...prev]);
  };

  const deleteResult = async (id: string) => {
    await api("DELETE", `/api/results/${id}`);
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const updateResult = async (item: GameResult) => {
    const updated = await api("PUT", `/api/results/${item.id}`, item);
    setResults(prev => prev.map(r => r.id === item.id ? updated : r));
  };

  // ── Standings ──────────────────────────────────────────────
  const updateStandings = async (items: Standing[]) => {
    const updated = await api("PUT", "/api/standings", items);
    setStandings(updated);
  };

  const updateLeagueMetadata = async (metadata: LeagueMetadata) => {
    await api("PUT", "/api/settings/leagueMetadata", metadata);
    setLeagueMetadata(metadata);
  };

  // ── Gallery ──────────────────────────────────────────────
  const addGalleryFolder = async (folder: Omit<GalleryFolder, "id" | "images">) => {
    const created = await api("POST", "/api/gallery", folder);
    setGalleryFolders(prev => [...prev, created]);
  };

  const deleteGalleryFolder = async (id: string) => {
    await api("DELETE", `/api/gallery/${id}`);
    setGalleryFolders(prev => prev.filter(f => f.id !== id));
  };

  const addImageToFolder = async (folderId: string, image: Omit<GalleryImage, "id">) => {
    const folder = galleryFolders.find(f => f.id === folderId);
    if (!folder) return;
    const newImage: GalleryImage = { ...image, id: Math.random().toString(36).substr(2, 9) };
    const updatedImages = [...folder.images, newImage];
    const updated = await api("PUT", `/api/gallery/${folderId}`, { ...folder, images: updatedImages });
    setGalleryFolders(prev => prev.map(f => f.id === folderId ? updated : f));
  };

  const deleteImageFromFolder = async (folderId: string, imageId: string) => {
    const folder = galleryFolders.find(f => f.id === folderId);
    if (!folder) return;
    const updatedImages = folder.images.filter(img => img.id !== imageId);
    const updated = await api("PUT", `/api/gallery/${folderId}`, { ...folder, images: updatedImages });
    setGalleryFolders(prev => prev.map(f => f.id === folderId ? updated : f));
  };

  // ── Settings ──────────────────────────────────────────────
  const updateClubHistory = async (history: ClubHistory) => {
    await api("PUT", "/api/settings/clubHistory", history);
    setClubHistory(history);
  };

  const updateNextMatch = async (match: Match) => {
    await api("PUT", "/api/settings/nextMatch", match);
    setNextMatch(match);
  };

  const updateContactDetails = async (details: ContactDetails) => {
    await api("PUT", "/api/settings/contactDetails", details);
    setContactDetails(details);
  };

  return (
    <AppContext.Provider value={{
      news, players, results, standings, leagueMetadata,
      galleryFolders, clubHistory, nextMatch, contactDetails,
      isAdmin, userRole, currentUser, users, loginLogs, loading,
      login, logout, toggle2FA, changePassword,
      setup2FA, verify2FA, disable2FA,
      addUser, deleteUser, updateUserRole,
      addNews, deleteNews, updateNews,
      addPlayer, deletePlayer, updatePlayer,
      addResult, deleteResult, updateResult,
      updateStandings, updateLeagueMetadata,
      addGalleryFolder, deleteGalleryFolder, addImageToFolder, deleteImageFromFolder,
      updateClubHistory, updateNextMatch, updateContactDetails,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
