import { useState } from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { X, ChevronDown, ChevronUp, Cookie } from "lucide-react";
import { Link } from "wouter";

export function CookieBanner() {
  const { showBanner, acceptAll, acceptNecessary, saveConsent } = useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4">
      <div className="max-w-4xl mx-auto bg-white border border-border rounded-lg shadow-2xl overflow-hidden">

        {/* Nagłówek */}
        <div className="bg-secondary text-white px-6 py-4 flex items-center gap-3">
          <Cookie className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="font-display uppercase tracking-wider text-sm font-bold flex-1">
            Ta strona używa plików cookie
          </span>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Używamy plików cookie, aby zapewnić prawidłowe działanie strony oraz — za Twoją zgodą — analizować ruch w celach statystycznych.
            Więcej informacji w naszej{" "}
            <Link href="/polityka-cookies" className="text-primary underline hover:no-underline">
              Polityce cookies
            </Link>.
          </p>

          {/* Ustawienia szczegółowe */}
          <button
            onClick={() => setShowSettings(s => !s)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            {showSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showSettings ? "Ukryj ustawienia" : "Ustawienia szczegółowe"}
          </button>

          {showSettings && (
            <div className="space-y-3 mb-4 border rounded-lg p-4 bg-muted/30">

              {/* Niezbędne — zawsze włączone */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold">Niezbędne</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Sesja logowania admina, bezpieczeństwo strony. Zawsze aktywne.
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-10 h-5 bg-green-600 rounded-full flex items-center justify-end px-0.5">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              {/* Analityczne — Umami */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold">Analityczne (Umami)</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Anonimowe statystyki odwiedzin — liczba wizyt, popularne strony. Dane przechowywane na własnym serwerze.
                  </div>
                </div>
                <button
                  onClick={() => setAnalyticsEnabled(v => !v)}
                  className={`flex-shrink-0 w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${analyticsEnabled ? "bg-primary justify-end" : "bg-muted justify-start"}`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>

            </div>
          )}

          {/* Przyciski */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={acceptAll}
              className="flex-1 min-w-[140px] bg-primary hover:bg-primary/90 text-white font-display uppercase tracking-wider text-sm px-5 py-2.5 rounded transition-colors"
            >
              Akceptuj wszystkie
            </button>
            <button
              onClick={acceptNecessary}
              className="flex-1 min-w-[140px] bg-secondary hover:bg-secondary/90 text-white font-display uppercase tracking-wider text-sm px-5 py-2.5 rounded transition-colors"
            >
              Tylko niezbędne
            </button>
            {showSettings && (
              <button
                onClick={() => saveConsent(analyticsEnabled)}
                className="flex-1 min-w-[140px] border border-primary text-primary hover:bg-primary/5 font-display uppercase tracking-wider text-sm px-5 py-2.5 rounded transition-colors"
              >
                Zapisz ustawienia
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
