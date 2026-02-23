import logo from "@assets/BIZONY_(6)_1771387532198.png";
import { Facebook, Instagram, Shield } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-12 w-auto" />
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
              <li><Link href="/news"><a className="hover:text-primary transition-colors">Aktualności</a></Link></li>
              <li><Link href="/results"><a className="hover:text-primary transition-colors">Wyniki</a></Link></li>
              <li><Link href="/standings"><a className="hover:text-primary transition-colors">Tabela</a></Link></li>
              <li><Link href="/team"><a className="hover:text-primary transition-colors">Drużyna</a></Link></li>
              <li><Link href="/gallery"><a className="hover:text-primary transition-colors">Galeria</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-primary transition-colors">Kontakt</a></Link></li>
              <li className="pt-4 border-t border-secondary-foreground/10">
                <Link href="/admin">
                  <a className="inline-flex items-center gap-2 text-xs opacity-30 hover:opacity-100 transition-opacity">
                    <Shield className="w-3 h-3" />
                  </a>
                </Link>
              </li>
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
