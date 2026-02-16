import logo from "@assets/bizony--rSs6oZ4_1770847193876.webp";
import { Facebook, Instagram } from "lucide-react";

import bizony__rSs6oZ4 from "@assets/bizony--rSs6oZ4.jpg";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={bizony__rSs6oZ4} alt="Logo" className="h-12 w-auto brightness-0 invert" />
              <h3 className="text-2xl font-bold font-display uppercase tracking-wider">Bizony Rzeszów</h3>
            </div>
            <p className="text-secondary-foreground/80 max-w-xs">
              Pierwsza drużyna baseballowa na Podkarpaciu. Pasja, zaangażowanie i społeczność od 2023 roku.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold font-display uppercase tracking-wider text-primary">Szybkie Linki</h4>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li><a href="/news" className="hover:text-primary transition-colors">Aktualności</a></li>
              <li><a href="/team" className="hover:text-primary transition-colors">Skład Drużyny</a></li>
              <li><a href="/standings" className="hover:text-primary transition-colors">Tabela Ligowa</a></li>
              <li><a href="/gallery" className="hover:text-primary transition-colors">Galeria Zdjęć</a></li>
            </ul>
          </div>

          {/* Social / Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold font-display uppercase tracking-wider text-primary">Obserwuj Nas</h4>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/BizonyRzeszow" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/bizony__rzeszow/" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-secondary-foreground/60 mt-4">
              © 2026 Bizony Rzeszów. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
