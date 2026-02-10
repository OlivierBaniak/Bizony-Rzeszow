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

export type GalleryItem = {
  id: string;
  title: string;
  url: string;
};

type AppContextType = {
  news: NewsItem[];
  players: Player[];
  standings: Standing[];
  gallery: GalleryItem[];
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  addNews: (item: Omit<NewsItem, "id" | "date">) => void;
  deleteNews: (id: string) => void;
  addPlayer: (item: Omit<Player, "id">) => void;
  deletePlayer: (id: string) => void;
  updateStandings: (items: Standing[]) => void;
  addGalleryItem: (item: Omit<GalleryItem, "id">) => void;
  deleteGalleryItem: (id: string) => void;
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
  { id: "3", name: "Adam Nowak", number: 5, position: "Łącznik", image: "https://images.unsplash.com/photo-1522778119026-d647f0565c6d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
];

const INITIAL_STANDINGS: Standing[] = [
  { id: "1", team: "Bizony Rzeszów", played: 10, won: 8, lost: 2, points: 16 },
  { id: "2", team: "Warsaw Centaurs", played: 10, won: 7, lost: 3, points: 14 },
  { id: "3", team: "Silesia Rybnik", played: 10, won: 5, lost: 5, points: 10 },
  { id: "4", team: "Kutno Stal", played: 10, won: 2, lost: 8, points: 4 },
];

const INITIAL_GALLERY: GalleryItem[] = [
  { id: "1", title: "Season Opener", url: teamImg },
  { id: "2", title: "Action Shot", url: newsImg },
  { id: "3", title: "Stadium at Night", url: heroImg },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [standings, setStandings] = useState<Standing[]>(INITIAL_STANDINGS);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = () => setIsAdmin(true);
  const logout = () => setIsAdmin(false);

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

  const addPlayer = (item: Omit<Player, "id">) => {
    const newItem: Player = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setPlayers([...players, newItem]);
  };

  const deletePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const updateStandings = (items: Standing[]) => {
    setStandings(items);
  };

  const addGalleryItem = (item: Omit<GalleryItem, "id">) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setGallery([...gallery, newItem]);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(gallery.filter((g) => g.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        news,
        players,
        standings,
        gallery,
        isAdmin,
        login,
        logout,
        addNews,
        deleteNews,
        addPlayer,
        deletePlayer,
        updateStandings,
        addGalleryItem,
        deleteGalleryItem,
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
