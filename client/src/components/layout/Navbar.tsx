import { Link, useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, Shield, ChevronDown } from "lucide-react";
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
    { 
      label: "Rozgrywki", 
      href: "#",
      children: [
        { label: "Tabela", href: "/standings" },
        { label: "Wyniki", href: "/results" },
      ]
    },
    { label: "Galeria", href: "/gallery" },
    { label: "Kontakt", href: "/contact" },
  ];

  const NavLink = ({ item, mobile = false }: { item: any; mobile?: boolean }) => {
    const isActive = location === item.href || (item.children?.some((child: any) => location === child.href));
    
    if (item.children && !mobile) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className={`
            uppercase font-display tracking-wider transition-colors duration-200 flex items-center gap-1 outline-none
            text-lg hover:text-primary
            ${isActive ? "text-primary font-bold" : "text-foreground"}
          `}>
            {item.label} <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-background border-border">
            {item.children.map((child: any) => (
              <DropdownMenuItem key={child.href} asChild>
                <Link href={child.href}>
                  <a className="uppercase font-display tracking-wider text-sm px-4 py-2 hover:bg-primary hover:text-white transition-colors cursor-pointer block">
                    {child.label}
                  </a>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (item.children && mobile) {
      return (
        <div className="flex flex-col gap-4">
          <span className="uppercase font-display tracking-wider text-2xl py-2 text-muted-foreground">
            {item.label}
          </span>
          <div className="pl-6 flex flex-col gap-4 border-l-2 border-primary/20">
            {item.children.map((child: any) => (
              <Link key={child.href} href={child.href}>
                <a
                  onClick={() => setIsOpen(false)}
                  className={`
                    uppercase font-display tracking-wider transition-colors duration-200 text-xl
                    ${location === child.href ? "text-primary font-bold" : "text-foreground"}
                  `}
                >
                  {child.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <Link href={item.href}>
        <a
          onClick={() => mobile && setIsOpen(false)}
          className={`
            uppercase font-display tracking-wider transition-colors duration-200
            ${mobile ? "text-2xl py-2" : "text-lg hover:text-primary"}
            ${isActive ? "text-primary font-bold" : "text-foreground"}
          `}
        >
          {item.label}
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
            <NavLink key={item.label} item={item} />
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
                  <NavLink key={item.label} item={item} mobile />
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
