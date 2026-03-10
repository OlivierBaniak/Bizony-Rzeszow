import React, { createContext, useContext, useState, useEffect } from "react";
import heroImg from "@/assets/hero.png";
import newsImg from "@/assets/news-1.png";
import teamImg from "@/assets/team-hero.png";

// Types
export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
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
  email: string;
  role: "admin" | "editor";
  password: string;
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

type AppContextType = {
  news: NewsItem[];
  players: Player[];
  results: GameResult[];
  standings: Standing[];
  leagueMetadata: LeagueMetadata;
  galleryFolders: GalleryFolder[];
  clubHistory: ClubHistory;
  nextMatch: Match;
  contactDetails: ContactDetails;
  isAdmin: boolean;
  userRole: "admin" | "editor" | null;
  currentUser: User | null;
  users: User[];
  loginLogs: LoginLog[];
  login: (email: string, success?: boolean) => void;
  logout: () => void;
  addUser: (user: Omit<User, "id">) => void;
  deleteUser: (id: string) => void;
  updateUserRole: (id: string, role: "admin" | "editor") => void;
  changePassword: (newPassword: string) => void;
  toggle2FA: () => void;
  addNews: (item: Omit<NewsItem, "id" | "date">) => void;
  deleteNews: (id: string) => void;
  updateNews: (item: NewsItem) => void;
  addPlayer: (item: Omit<Player, "id">) => void;
  deletePlayer: (id: string) => void;
  updatePlayer: (item: Player) => void;
  addResult: (item: Omit<GameResult, "id">) => void;
  deleteResult: (id: string) => void;
  updateResult: (item: GameResult) => void;
  updateStandings: (items: Standing[]) => void;
  updateLeagueMetadata: (metadata: LeagueMetadata) => void;
  addGalleryFolder: (folder: Omit<GalleryFolder, "id" | "images">) => void;
  deleteGalleryFolder: (id: string) => void;
  addImageToFolder: (folderId: string, image: Omit<GalleryImage, "id">) => void;
  deleteImageFromFolder: (folderId: string, imageId: string) => void;
  updateClubHistory: (history: ClubHistory) => void;
  updateNextMatch: (match: Match) => void;
  updateContactDetails: (details: ContactDetails) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Data
const INITIAL_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "Bizony Rzeszów mocno zaczynają sezon 2026!",
    excerpt: "Zespół pokazał niesamowitego ducha w meczu otwarcia przeciwko Warszawie.",
    content: "To było słoneczne popołudnie w Rzeszowie, gdy Bizony wyszły na boisko...",
    date: "2026-04-12",
    image: newsImg,
  },
  {
    id: "2",
    title: "Otwarcie Nowego Obiektu Treningowego",
    excerpt: "Z dumą ogłaszamy, że nasze nowe kryte klatki do odbijania są gotowe.",
    content: "Dzięki wsparciu naszych sponsorów dysponujemy teraz najnowocześniejszymi obiektami...",
    date: "2026-03-20",
    image: heroImg,
  },
];

const INITIAL_PLAYERS: Player[] = [
  { id: "1", name: "Jan Kowalski", number: 23, position: "Miotacz", image: "https://images.unsplash.com/photo-1556637482-fa587f893e48?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "2", name: "Mike Smith", number: 12, position: "Łapacz", image: "https://images.unsplash.com/photo-1619472624508-41cb76503c5d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "3", name: "Adam Nowak", number: 5, position: "Gracz z pola", image: "https://images.unsplash.com/photo-1522778119026-d647f0565c6d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: "4", name: "Piotr Zieliński", number: 7, position: "Zapolowy", image: "https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
];

const INITIAL_STANDINGS: Standing[] = [
  { id: "1", team: "Bizony Rzeszów", played: 10, won: 8, lost: 2, points: 16 },
  { id: "2", team: "Warsaw Centaurs", played: 10, won: 7, lost: 3, points: 14 },
  { id: "3", team: "Silesia Rybnik", played: 10, won: 5, lost: 5, points: 10 },
  { id: "4", team: "Kutno Stal", played: 10, won: 2, lost: 8, points: 4 },
];

const INITIAL_METADATA: LeagueMetadata = {
  title: "Tabela Ligowa",
  subtitle: "Sezon Zasadniczy 2026"
};

const INITIAL_GALLERY: GalleryFolder[] = [
  {
    id: "1",
    title: "Inauguracja Sezonu",
    description: "Zdjęcia z pierwszego meczu w sezonie 2026 przeciwko Warszawie.",
    mainImage: teamImg,
    images: [
      { id: "i1", url: teamImg, description: "Drużyna w komplecie" },
      { id: "i2", url: newsImg, description: "Akcja pod bazą" }
    ]
  },
  {
    id: "2",
    title: "Treningi Nocne",
    description: "Klimatyczne ujęcia z wieczornych treningów pod jupiterami.",
    mainImage: heroImg,
    images: [
      { id: "i3", url: heroImg, description: "Stadion nocą" }
    ]
  }
];

const INITIAL_HISTORY: ClubHistory = {
  content: "Klub Bizony Rzeszów powstał z pasji do baseballu... Nasza historia to lata ciężkiej pracy i budowania społeczności w regionie Podkarpacia.",
  images: [teamImg, heroImg]
};

const INITIAL_MATCH: Match = {
  homeTeam: "Bizony",
  homeLogo: "", // Will use default if empty
  awayTeam: "Centaurs",
  awayLogo: "",
  date: "15 MAJA",
  time: "14:00",
  location: "Boisko Rzeszów",
  ticketLink: "#"
};

const INITIAL_CONTACT: ContactDetails = {
  address: "ul. Sportowa 1, 35-001 Rzeszów",
  email: "kontakt@bizonyrzeszow.pl",
  phone: "+48 123 456 789",
  facebook: "https://www.facebook.com/BizonyRzeszow",
  instagram: "https://www.instagram.com/bizony__rzeszow/"
};

const INITIAL_RESULTS: GameResult[] = [
  { id: "1", date: "2025.04.13", location: "Rybnik", opponent: "Wizards Opole", competition: "BLB", result: "L", pointsScored: 13, pointsConceded: 20 },
  { id: "2", date: "2025.04.13", location: "Rybnik", opponent: "Wizards Opole", competition: "BLB", result: "W", pointsScored: 14, pointsConceded: 13 },
  { id: "3", date: "2025.03.22", location: "Żory", opponent: "Wizards Opole", competition: "Towarzyski", result: "L", pointsScored: 11, pointsConceded: 15 },
  { id: "4", date: "2025.03.22", location: "Żory", opponent: "Wizards Opole", competition: "Towarzyski", result: "W", pointsScored: 5, pointsConceded: 3 },
];

const INITIAL_USERS: User[] = [
  { id: "1", email: "admin@bizonyrzeszow.pl", role: "admin", password: "Duzy1Bizon@9" },
  { id: "2", email: "editor@bizonyrzeszow.pl", role: "editor", password: "Maly3Bizon&5" },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [results, setResults] = useState<GameResult[]>(INITIAL_RESULTS);
  const [standings, setStandings] = useState<Standing[]>(INITIAL_STANDINGS);
  const [leagueMetadata, setLeagueMetadata] = useState<LeagueMetadata>(INITIAL_METADATA);
  const [galleryFolders, setGalleryFolders] = useState<GalleryFolder[]>(INITIAL_GALLERY);
  const [clubHistory, setClubHistory] = useState<ClubHistory>(INITIAL_HISTORY);
  const [nextMatch, setNextMatch] = useState<Match>(INITIAL_MATCH);
  const [contactDetails, setContactDetails] = useState<ContactDetails>(INITIAL_CONTACT);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "editor" | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);

  const login = (email: string, success: boolean = true) => {
    const newLog: LoginLog = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      timestamp: new Date().toLocaleString("pl-PL"),
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`, // Mock IP for prototype
      status: success ? "success" : "failure"
    };
    setLoginLogs(prev => [newLog, ...prev]);

    if (!success) return;

    const user = users.find(u => u.email === email);
    if (user) {
      setUserRole(user.role);
      setCurrentUser(user);
      setIsAdmin(true);
    } else {
      const role = email.includes("admin") ? "admin" : "editor";
      const newUser: User = { id: Math.random().toString(36).substr(2, 9), email, role };
      setUserRole(role);
      setCurrentUser(newUser);
      setIsAdmin(true);
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setUserRole(null);
    setCurrentUser(null);
  };

  const toggle2FA = () => {
    if (!currentUser) return;
    const updatedUser = { 
      ...currentUser, 
      is2FAEnabled: !currentUser.is2FAEnabled,
      twoFASecret: !currentUser.is2FAEnabled ? Math.random().toString(36).substr(2, 10).toUpperCase() : undefined
    };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const addUser = (user: Omit<User, "id">) => {
    const newUser = { ...user, id: Math.random().toString(36).substr(2, 9) };
    setUsers([...users, newUser]);
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const updateUserRole = (id: string, role: "admin" | "editor") => {
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  const changePassword = (newPassword: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, password: newPassword };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const addNews = (item: Omit<NewsItem, "id" | "date">) => {
    const newItem: NewsItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split("T")[0],
    };
    setNews([newItem, ...news]);
  };

  const deleteNews = (id: string) => {
    setNews(news.filter((n) => n.id !== id));
  };

  const updateNews = (updatedItem: NewsItem) => {
    setNews(news.map(n => n.id === updatedItem.id ? updatedItem : n));
  };

  const addPlayer = (item: Omit<Player, "id">) => {
    const newItem: Player = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setPlayers([...players, newItem]);
  };

  const deletePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const updatePlayer = (updatedItem: Player) => {
    setPlayers(players.map(p => p.id === updatedItem.id ? updatedItem : p));
  };

  const addResult = (item: Omit<GameResult, "id">) => {
    const newItem: GameResult = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setResults([newItem, ...results]);
  };

  const deleteResult = (id: string) => {
    setResults(results.filter((r) => r.id !== id));
  };

  const updateResult = (updatedItem: GameResult) => {
    setResults(results.map(r => r.id === updatedItem.id ? updatedItem : r));
  };

  const updateStandings = (items: Standing[]) => {
    setStandings(items);
  };

  const updateLeagueMetadata = (metadata: LeagueMetadata) => {
    setLeagueMetadata(metadata);
  };

  const addGalleryFolder = (folder: Omit<GalleryFolder, "id" | "images">) => {
    const newFolder: GalleryFolder = {
      ...folder,
      id: Math.random().toString(36).substr(2, 9),
      images: []
    };
    setGalleryFolders([...galleryFolders, newFolder]);
  };

  const deleteGalleryFolder = (id: string) => {
    setGalleryFolders(galleryFolders.filter(f => f.id !== id));
  };

  const addImageToFolder = (folderId: string, image: Omit<GalleryImage, "id">) => {
    setGalleryFolders(galleryFolders.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          images: [...f.images, { ...image, id: Math.random().toString(36).substr(2, 9) }]
        };
      }
      return f;
    }));
  };

  const deleteImageFromFolder = (folderId: string, imageId: string) => {
    setGalleryFolders(galleryFolders.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          images: f.images.filter(img => img.id !== imageId)
        };
      }
      return f;
    }));
  };

  const updateClubHistory = (history: ClubHistory) => {
    setClubHistory(history);
  };

  const updateNextMatch = (match: Match) => {
    setNextMatch(match);
  };

  const updateContactDetails = (details: ContactDetails) => {
    setContactDetails(details);
  };

  return (
    <AppContext.Provider
      value={{
        news,
        players,
        standings,
        leagueMetadata,
        galleryFolders,
        clubHistory,
        nextMatch,
        contactDetails,
        isAdmin,
        userRole,
        currentUser,
        users,
        loginLogs,
        login,
        logout,
        addUser,
        deleteUser,
        updateUserRole,
        changePassword,
        toggle2FA,
        addNews,
        deleteNews,
        updateNews,
        addPlayer,
        deletePlayer,
        updatePlayer,
        results,
        addResult,
        deleteResult,
        updateResult,
        updateStandings,
        updateLeagueMetadata,
        addGalleryFolder,
        deleteGalleryFolder,
        addImageToFolder,
        deleteImageFromFolder,
        updateClubHistory,
        updateNextMatch,
        updateContactDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
