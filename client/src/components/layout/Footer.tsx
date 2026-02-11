import logo from "@assets/bizony--rSs6oZ4_1770847193876.webp";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-12 w-auto brightness-0 invert" />
              <h3 className="text-2xl font-bold font-display uppercase tracking-wider">Bizony Rzeszów</h3>
            </div>
            <p className="text-secondary-foreground/80 max-w-xs">
              The premier baseball team of Podkarpacie. Passion, dedication, and community since 20XX.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold font-display uppercase tracking-wider text-primary">Quick Links</h4>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li><a href="/news" className="hover:text-primary transition-colors">Latest News</a></li>
              <li><a href="/team" className="hover:text-primary transition-colors">Team Roster</a></li>
              <li><a href="/standings" className="hover:text-primary transition-colors">League Standings</a></li>
              <li><a href="/gallery" className="hover:text-primary transition-colors">Photo Gallery</a></li>
            </ul>
          </div>

          {/* Social / Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold font-display uppercase tracking-wider text-primary">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-secondary-foreground/10 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-secondary-foreground/60 mt-4">
              © 2026 Bizony Rzeszów. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
