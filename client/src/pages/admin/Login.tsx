import { useApp } from "@/lib/store";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export default function Login() {
  const { login } = useApp();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setUserInput("");
    setError(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userInput.toUpperCase() !== captcha) {
      login(email, false);
      setError(true);
      generateCaptcha();
      return;
    }
    
    if (!email || !email.includes("@")) {
      login(email, false);
      setError(true);
      return;
    }
    
    login(email, true);
    setLocation("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <Card className="w-full max-w-md border-t-4 border-primary shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="font-display uppercase text-2xl tracking-wider">Panel Administratora</CardTitle>
          <CardDescription>
            Zaloguj się, aby zarządzać stroną klubu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md text-center font-medium animate-in fade-in zoom-in-95">
                Logowanie jest niemożliwe
              </div>
            )}
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="admin@bizonyrzeszow.pl" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="bg-white" 
              />
            </div>
            <div className="space-y-2">
              <Input type="password" placeholder="••••••••" required className="bg-white" />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between bg-muted p-4 rounded-md border border-dashed border-primary/30">
                <div className="text-2xl font-mono font-bold tracking-[0.3em] select-none text-primary italic">
                  {captcha}
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={generateCaptcha}
                  className="hover:rotate-180 transition-transform duration-500"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <Input 
                  placeholder="Wpisz kod powyżej" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className={`bg-white font-display uppercase tracking-widest ${error ? 'border-destructive ring-1 ring-destructive' : ''}`}
                  required
                />
                {error && <p className="text-xs text-destructive font-medium">Niepoprawny kod CAPTCHA. Spróbuj ponownie.</p>}
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider h-12">
              Zaloguj się
            </Button>
            <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-tighter opacity-50">
              Tryb prototypu: Dowolne dane logowania są akceptowane przy poprawnym kodzie CAPTCHA.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
