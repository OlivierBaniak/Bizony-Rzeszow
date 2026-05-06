import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Facebook, Instagram, Navigation } from "lucide-react";

export default function Contact() {
  const { contactDetails } = useApp();

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-12 border-l-8 border-primary pl-6">
          Kontakt
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-none shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-secondary text-white">
              <CardTitle className="font-display uppercase tracking-wider text-2xl">Dane Kontaktowe</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Adres</p>
                  <p className="text-lg font-medium">{contactDetails.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Email</p>
                  <a href={`mailto:${contactDetails.email}`} className="text-lg font-medium hover:text-primary transition-colors">
                    {contactDetails.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Telefon</p>
                  <a href={`tel:${contactDetails.phone}`} className="text-lg font-medium hover:text-primary transition-colors">
                    {contactDetails.phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-secondary text-white">
              <CardTitle className="font-display uppercase tracking-wider text-2xl">Social Media</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Obserwuj nas w mediach społecznościowych, aby być na bieżąco z najnowszymi informacjami z życia klubu!
              </p>
              
              <div className="flex flex-col gap-4">
                <a 
                  href={contactDetails.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all group"
                >
                  <Facebook className="w-6 h-6" />
                  <span className="font-display text-xl uppercase tracking-wider">Facebook</span>
                </a>

                <a 
                  href={contactDetails.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all group"
                >
                  <Instagram className="w-6 h-6" />
                  <span className="font-display text-xl uppercase tracking-wider">Instagram</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boisko SALOS — mapa */}
        <Card className="border-none shadow-xl overflow-hidden bg-white mt-8">
          <CardHeader className="bg-secondary text-white">
            <CardTitle className="font-display uppercase tracking-wider text-2xl flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              Nasze Boisko — SALOS Rzeszów
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <iframe
              title="Boisko Sports SALOS – Bizony Rzeszów"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2551.0!2d22.007!3d50.0254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473cfa572f43425f%3A0x79b216f8cc7e48de!2sSports%20SALOS!5e0!3m2!1spl!2spl!4v1683000000000"
              width="100%"
              height="380"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-muted/40">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Adres boiska</p>
                  <p className="font-medium">ul. Witolda Świadka 5a, 35-310 Rzeszów</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ⚾ Otwarte treningi: <strong>sobota &amp; niedziela, godz. 14:00</strong>
                  </p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?cid=8769096682282305758"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary text-white font-display uppercase tracking-wider text-sm px-5 py-3 rounded hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                <Navigation className="w-4 h-4" />
                Jak dojechać
              </a>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
