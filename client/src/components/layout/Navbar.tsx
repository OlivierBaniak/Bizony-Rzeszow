import { Link, useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield } from "lucide-react";
import { useState } from "react";

import logo from "@assets/BIZONY_(6)_1771387532198.png";

export function Navbar() {
  const [location] = useLocation();
  const { isAdmin, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Start", href: "/" },
    { label: "Aktualności", href: "/news" },
    { label: "O Klubie", href: "/about" },
    { label: "Drużyna", href: "/team" },
    { label: "Tabela", href: "/standings" },
    { label: "Galeria", href: "/gallery" },
    { label: "Kontakt", href: "/contact" },
  ];

  const NavLink = ({ href, label, mobile = false }: { href: string; label: string; mobile?: boolean }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <a
          onClick={() => mobile && setIsOpen(false)}
          className={`
            uppercase font-display tracking-wider transition-colors duration-200
            ${mobile ? "text-2xl py-2" : "text-lg hover:text-primary"}
            ${isActive ? "text-primary font-bold" : "text-foreground"}
          `}
        >
          {label}
        </a>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 group">
            <img src={logo} alt="Bizony Rzeszów Logo" className="h-16 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-display text-2xl leading-none font-bold uppercase tracking-wider text-foreground">
                Bizony
              </span>
              <span className="text-xs font-sans tracking-[0.2em] text-muted-foreground uppercase">
                Rzeszów
              </span>
            </div>
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
          
          {isAdmin && (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
              <Button onClick={logout} variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-10">
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} mobile />
                ))}
                <div className="h-px bg-border my-2" />
                {isAdmin && (
                  <Button variant="outline" onClick={() => { logout(); setIsOpen(false); }} className="w-full">
                    Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
