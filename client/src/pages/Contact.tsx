import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

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
      </div>
    </div>
  );
}
