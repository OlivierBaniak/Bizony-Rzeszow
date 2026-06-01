import { useState, useEffect } from "react";

export type CookieConsent = {
  necessary: boolean;    // zawsze true
  analytics: boolean;    // Umami
  timestamp: number;
};

const STORAGE_KEY = "bizony_cookie_consent";

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setConsent(JSON.parse(stored));
        setShowBanner(false);
      } else {
        setShowBanner(true);
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (analytics: boolean) => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConsent));
    } catch {}
    setConsent(newConsent);
    setShowBanner(false);

    // Jeśli analytics odrzucone — usuń cookies Umami
    if (!analytics) {
      document.cookie.split(";").forEach(c => {
        if (c.trim().startsWith("umami")) {
          document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
      });
    }
  };

  const acceptAll = () => saveConsent(true);
  const acceptNecessary = () => saveConsent(false);
  const resetConsent = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setConsent(null);
    setShowBanner(true);
  };

  return { consent, showBanner, acceptAll, acceptNecessary, saveConsent, resetConsent };
}
