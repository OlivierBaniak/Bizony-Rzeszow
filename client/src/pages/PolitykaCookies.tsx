import { Link } from "wouter";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export default function PolitykaCookies() {
  const { resetConsent } = useCookieConsent();

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-4 border-l-8 border-primary pl-6">
          Polityka Cookies
        </h1>
        <p className="text-muted-foreground mb-12 pl-7">
          Polityka prywatności i plików cookie — obowiązuje od 1 czerwca 2026
        </p>

        <div className="space-y-8 text-foreground">

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§1. Administrator danych</h2>
            <p className="text-muted-foreground leading-relaxed">
              Administratorem danych osobowych jest <strong>Klub Baseballowy Bizony Rzeszów</strong>.
              Kontakt w sprawach związanych z ochroną danych: <a href="mailto:bizony.rzeszow@gmail.com" className="text-primary underline">bizony.rzeszow@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§2. Czym są pliki cookie?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pliki cookie (ciasteczka) to małe pliki tekstowe zapisywane na Twoim urządzeniu przez przeglądarkę internetową podczas odwiedzania strony. Służą do zapamiętywania Twoich preferencji, zapewnienia bezpieczeństwa oraz zbierania anonimowych statystyk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§3. Jakich cookies używamy?</h2>

            <div className="space-y-4">

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Niezbędne</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">Zawsze aktywne</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Wymagane do prawidłowego działania strony. Nie wymagają zgody.</p>
                <table className="w-full text-xs">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Nazwa</th>
                      <th className="text-left p-2">Cel</th>
                      <th className="text-left p-2">Czas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-2 font-mono">connect.sid</td>
                      <td className="p-2 text-muted-foreground">Sesja logowania admina/operatora</td>
                      <td className="p-2 text-muted-foreground">7 dni</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">bizony_cookie_consent</td>
                      <td className="p-2 text-muted-foreground">Zapamiętanie Twoich preferencji cookie (localStorage)</td>
                      <td className="p-2 text-muted-foreground">Bezterminowo</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Analityczne</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">Wymaga zgody</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Używamy narzędzia <strong>Umami Analytics</strong> — open-source, self-hosted na własnym serwerze (umami-bizony.onrender.com).
                  Umami <strong>nie używa plików cookie</strong> do śledzenia i nie przekazuje danych podmiotom trzecim.
                  Dane są w pełni anonimowe i przechowywane wyłącznie na naszym serwerze.
                </p>
                <table className="w-full text-xs">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Narzędzie</th>
                      <th className="text-left p-2">Cel</th>
                      <th className="text-left p-2">Dane</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 font-mono">Umami Analytics</td>
                      <td className="p-2 text-muted-foreground">Anonimowe statystyki: liczba odwiedzin, popularne strony, źródła ruchu</td>
                      <td className="p-2 text-muted-foreground">Brak danych osobowych, brak cross-site tracking</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">Zewnętrzne serwisy</h3>
                <p className="text-sm text-muted-foreground mb-3">Strona korzysta z następujących zewnętrznych serwisów:</p>
                <table className="w-full text-xs">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Serwis</th>
                      <th className="text-left p-2">Cel</th>
                      <th className="text-left p-2">Polityka</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-2 font-mono">Cloudinary</td>
                      <td className="p-2 text-muted-foreground">Hosting zdjęć i obrazów</td>
                      <td className="p-2"><a href="https://cloudinary.com/privacy" target="_blank" rel="noopener" className="text-primary underline">cloudinary.com/privacy</a></td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">Google Maps</td>
                      <td className="p-2 text-muted-foreground">Mapa dojazdu do boiska</td>
                      <td className="p-2"><a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-primary underline">policies.google.com</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§4. Twoje prawa</h2>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
              <li>Masz prawo do wglądu, sprostowania i usunięcia swoich danych osobowych.</li>
              <li>Możesz w każdej chwili zmienić swoje preferencje dotyczące cookies korzystając z przycisku poniżej.</li>
              <li>Możesz też zarządzać cookies poprzez ustawienia swojej przeglądarki.</li>
              <li>W sprawach dotyczących ochrony danych możesz skontaktować się z nami: <a href="mailto:bizony.rzeszow@gmail.com" className="text-primary underline">bizony.rzeszow@gmail.com</a></li>
              <li>Przysługuje Ci prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (uodo.gov.pl).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§5. Zmiany polityki</h2>
            <p className="text-muted-foreground leading-relaxed">
              Zastrzegamy prawo do aktualizacji niniejszej polityki. Aktualna wersja zawsze dostępna jest pod adresem bizonyrzeszow.pl/polityka-cookies.
            </p>
          </section>

          {/* Zarządzaj zgodami */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">Zarządzaj zgodami</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Możesz w każdej chwili zmienić swoje preferencje dotyczące plików cookie.
            </p>
            <button
              onClick={resetConsent}
              className="bg-secondary hover:bg-secondary/90 text-white font-display uppercase tracking-wider text-sm px-6 py-3 rounded transition-colors"
            >
              Zmień preferencje cookie
            </button>
          </div>

          <div className="pt-4 border-t text-center">
            <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white font-display uppercase tracking-wider px-6 py-3 rounded hover:bg-primary/90 transition-colors text-sm">
              ← Wróć na stronę główną
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
