import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const { login } = useApp();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [userId, setUserId] = useState("");
  const [twoFAToken, setTwoFAToken] = useState("");

  const handleSubmit = async () => {
    if (!username || !password) return;
    setLoading(true);
    setError("");
  const result = await login(username, password);
    setLoading(false);
    if (result === true) {
      setLocation("/admin");
    } else if (result && typeof result === "object" && result.requires2FA) {
      setRequires2FA(true);
      setUserId(result.id);
    } else {
      setError("Nieprawidłowa nazwa użytkownika lub hasło.");
    }
  };

  const handle2FASubmit = async () => {
    if (!twoFAToken) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/2fa/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, token: twoFAToken }),
      });
      if (res.ok) {
        window.location.href = "/admin";
      } else {
        setError("Nieprawidłowy kod 2FA.");
      }
    } catch {
      setError("Błąd serwera.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-display uppercase tracking-wider text-center">
            {requires2FA ? "Weryfikacja 2FA" : "Panel CMS"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!requires2FA ? (
            <>
              <div className="space-y-2">
                <Label>Nazwa użytkownika</Label>
                <Input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label>Hasło</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  autoComplete="current-password"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-primary text-white font-display uppercase tracking-wider"
              >
                {loading ? "Logowanie..." : "Zaloguj się"}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Wpisz 6-cyfrowy kod z aplikacji uwierzytelniającej.
              </p>
              <div className="space-y-2">
                <Label>Kod 2FA</Label>
                <Input
                  placeholder="000000"
                  maxLength={6}
                  value={twoFAToken}
                  onChange={e => setTwoFAToken(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handle2FASubmit()}
                  autoComplete="one-time-code"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                onClick={handle2FASubmit}
                disabled={loading}
                className="w-full bg-primary text-white font-display uppercase tracking-wider"
              >
                {loading ? "Weryfikacja..." : "Potwierdź"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setRequires2FA(false); setError(""); }}
                className="w-full"
              >
                Wróć
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}