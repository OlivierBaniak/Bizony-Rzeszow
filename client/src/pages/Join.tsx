import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ChevronDown, ChevronUp, Send, CheckCircle } from "lucide-react";

const FAQ = [
  {
    q: "Czy muszę mieć własny sprzęt?",
    a: "Nie — na pierwsze treningi klub zapewnia podstawowy sprzęt. Rękawice, kij i piłki mamy dla nowych zawodników.",
  },
  {
    q: "Od jakiego wieku można grać?",
    a: "Przyjmujemy zawodników od 15 roku życia. Dorośli w każdym wieku są mile widziani — baseball to sport dla każdego!",
  },
  {
    q: "Czy baseball to drogi sport?",
    a: "Na start praktycznie nic nie kosztuje. Własny sprzęt dokupujesz stopniowo — klub pomaga w wyborze i poleca sprawdzone sklepy.",
  },
  {
    q: "Nie znam zasad — czy to problem?",
    a: "Absolutnie nie! Trenerzy wprowadzą cię w podstawy od zera. Większość naszych zawodników zaczynała bez żadnej wiedzy o baseballu.",
  },
  {
    q: "Czy jest liga / rywalizacja?",
    a: "Tak — Bizony grają w Polskiej Lidze Baseballu. Po przygotowaniu możesz dołączyć do składu meczowego i reprezentować Podkarpacie!",
  },
];

export default function Join() {
  const [open, setOpen] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    experience: "",
    availability: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.age || !form.phone || !form.experience || !form.availability) {
      alert("Uzupełnij wszystkie pola przed wysłaniem.");
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
    } catch {
      alert("Wystąpił błąd. Spróbuj ponownie lub napisz do nas na Facebooku.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Nagłówek */}
        <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-2 border-l-8 border-primary pl-6">
          Dołącz do nas
        </h1>
        <p className="text-muted-foreground mb-12 pl-7 text-base">
          Jedyna drużyna baseballowa na Podkarpaciu — zapraszamy wszystkich chętnych!
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">

          {/* Harmonogram */}
          <Card className="border-none shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-secondary text-white">
              <CardTitle className="font-display uppercase tracking-wider text-2xl flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                Otwarte treningi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2">
                <div className="bg-secondary/95 text-white p-8 text-center border-r border-white/10">
                  <div className="font-display text-xl uppercase tracking-widest text-primary mb-1">Sobota</div>
                  <div className="font-display text-5xl font-bold">14:00</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mt-2">Trening otwarty</div>
                </div>
                <div className="bg-secondary/95 text-white p-8 text-center">
                  <div className="font-display text-xl uppercase tracking-widest text-primary mb-1">Niedziela</div>
                  <div className="font-display text-5xl font-bold">14:00</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mt-2">Trening otwarty</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-5 border-t">
                <div className="p-2 bg-primary/10 rounded-full text-primary mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Boisko</p>
                  <p className="font-medium text-sm">Sports SALOS</p>
                  <p className="text-sm text-muted-foreground">ul. Witolda Świądka 5a, Rzeszów</p>
                  <a
                    href="https://maps.google.com/?cid=8769096682282305758"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs font-bold uppercase tracking-wider hover:underline mt-1 inline-block"
                  >
                    Jak dojechać →
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formularz */}
          <Card className="border-none shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-secondary text-white">
              <CardTitle className="font-display uppercase tracking-wider text-2xl flex items-center gap-3">
                <Send className="w-6 h-6 text-primary" />
                Formularz zgłoszeniowy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                  <CheckCircle className="w-16 h-16 text-primary" />
                  <h3 className="font-display text-2xl uppercase font-bold text-secondary">Zgłoszenie wysłane!</h3>
                  <p className="text-muted-foreground text-sm">
                    Odezwiemy się przez Facebook Messenger — do zobaczenia na boisku!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Imię i nazwisko</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jan Kowalski"
                        className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Wiek</label>
                      <input
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        placeholder="25"
                        type="number"
                        className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Telefon</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+48 600 000 000"
                      type="tel"
                      className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Doświadczenie</label>
                    <select
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Wybierz...</option>
                      <option>Żadnego — zupełny początkujący</option>
                      <option>Trochę — grałem hobbystycznie</option>
                      <option>Gram regularnie od lat</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kiedy możesz trenować?</label>
                    <select
                      name="availability"
                      value={form.availability}
                      onChange={handleChange}
                      className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Wybierz...</option>
                      <option>Sobota</option>
                      <option>Niedziela</option>
                      <option>Obydwa dni</option>
                      <option>Elastycznie</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-display uppercase tracking-wider text-sm h-12 mt-2"
                  >
                    {loading ? "Wysyłanie..." : (
                      <><Send className="w-4 h-4 mr-2" /> Wyślij zgłoszenie na Messenger</>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Odezwiemy się przez Facebook Messenger w ciągu 24h
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* FAQ */}
        <Card className="border-none shadow-xl overflow-hidden bg-white">
          <CardHeader className="bg-secondary text-white">
            <CardTitle className="font-display uppercase tracking-wider text-2xl">
              Pytania początkujących
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y">
            {FAQ.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-none bg-primary text-white text-xs font-bold flex items-center justify-center font-display">
                      {i + 1}
                    </span>
                    <span className="font-medium text-sm">{item.q}</span>
                  </span>
                  {open === i
                    ? <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  }
                </button>
                {open === i && (
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed pl-9">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
