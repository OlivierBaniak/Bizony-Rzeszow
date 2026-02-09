import { useApp } from "@/lib/store";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function Login() {
  const { login } = useApp();
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In this prototype, any login works. 
    // In a real app, this would be validated against a backend.
    login();
    setLocation("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="font-display uppercase text-2xl tracking-wider">Admin Access</CardTitle>
          <CardDescription>
            Enter your credentials to manage the team website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input type="email" placeholder="admin@bizonyrzeszow.pl" required />
            </div>
            <div className="space-y-2">
              <Input type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider">
              Login
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              (Prototype Mode: Click Login with any credentials)
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
