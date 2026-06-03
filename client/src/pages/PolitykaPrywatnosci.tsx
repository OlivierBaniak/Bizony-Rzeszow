import { Link } from "wouter";

export default function PolitykaPrywatnosci() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-4 border-l-8 border-primary pl-6">
          Polityka Prywatności
        </h1>
        <p className="text-muted-foreground mb-12 pl-7">
          Obowiązuje od 1 czerwca 2026 r. · Administrator: Klub Baseballowy Bizony Rzeszów
        </p>

        <div className="space-y-8 text-foreground">

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§1. Informacje ogólne</h2>
            <div className="space-y-2 text-muted-foreground leading-relaxed">
              <p>Niniejsza polityka dotyczy serwisu internetowego działającego pod adresem <strong>www.bizonyrzeszow.pl</strong>.</p>
              <p><strong>Administrator danych osobowych:</strong> Klub Baseballowy Bizony Rzeszów</p>
              <p><strong>Kontakt:</strong> <a href="mailto:bizony.rzeszow@gmail.com" className="text-primary underline">bizony.rzeszow@gmail.com</a></p>
              <p>Serwis przetwarza dane osobowe w następujących celach:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Realizacja zamówień ze sklepu internetowego (pakowanie, wysyłka towarów)</li>
                <li>Kontakt z osobami zainteresowanymi dołączeniem do klubu</li>
                <li>Prezentacja oferty i informacji o działalności klubu</li>
                <li>Anonimowa analiza ruchu na stronie (statystyki)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§2. Zbierane dane i podstawy przetwarzania</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted font-bold">
                    <tr>
                      <th className="text-left p-3">Cel</th>
                      <th className="text-left p-3">Dane</th>
                      <th className="text-left p-3">Podstawa (RODO)</th>
                      <th className="text-left p-3">Okres</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3">Realizacja zamówienia</td>
                      <td className="p-3">Imię, nazwisko, email, telefon, adres</td>
                      <td className="p-3">Art. 6 ust. 1 lit. b (umowa)</td>
                      <td className="p-3">5 lat (wymogi podatkowe)</td>
                    </tr>
                    <tr>
                      <td className="p-3">Formularz „Dołącz do nas"</td>
                      <td className="p-3">Imię, telefon, wiek, dostępność</td>
                      <td className="p-3">Art. 6 ust. 1 lit. a (zgoda)</td>
                      <td className="p-3">Do cofnięcia zgody</td>
                    </tr>
                    <tr>
                      <td className="p-3">Sesja logowania admina</td>
                      <td className="p-3">Login, hasło (hashowane)</td>
                      <td className="p-3">Art. 6 ust. 1 lit. f (interes prawny)</td>
                      <td className="p-3">7 dni (sesja)</td>
                    </tr>
                    <tr>
                      <td className="p-3">Statystyki (Umami)</td>
                      <td className="p-3">Anonimowe dane o ruchu</td>
                      <td className="p-3">Art. 6 ust. 1 lit. a (zgoda)</td>
                      <td className="p-3">Do cofnięcia zgody</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§3. Odbiorcy danych</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Dane osobowe mogą być przekazywane następującym kategoriom odbiorców, wyłącznie gdy jest to niezbędne do realizacji celu:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong>Render.com</strong> — dostawca hostingu serwisu (serwery w USA; transfer na podstawie standardowych klauzul umownych SCC zatwierdz. przez KE)</li>
              <li><strong>Cloudinary</strong> — hosting zdjęć i materiałów graficznych (serwery w USA; transfer na podstawie SCC)</li>
              <li><strong>Firma kurierska</strong> — w zakresie niezbędnym do doręczenia zamówienia (imię, nazwisko, adres, telefon)</li>
              <li><strong>Bank / operator płatności</strong> — w zakresie realizacji przelewu (dane podane przez klienta)</li>
              <li><strong>Organy publiczne</strong> — jeżeli obowiązek przekazania wynika z przepisów prawa</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
              Dane <strong>nie są sprzedawane</strong> ani udostępniane podmiotom trzecim w celach marketingowych.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§4. Bezpieczeństwo danych</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
              <li>Połączenie z serwisem chronione certyfikatem SSL (szyfrowanie HTTPS)</li>
              <li>Hasła administratorów przechowywane w formie jednokierunkowego hashu (bcrypt)</li>
              <li>Dostęp do panelu administracyjnego chroniony opcjonalnym uwierzytelnianiem dwuskładnikowym (2FA)</li>
              <li>Stosowane są hasła złożone (min. 8 znaków, małe/wielkie litery, cyfry, znaki specjalne)</li>
              <li>Dane zamówień dostępne wyłącznie dla upoważnionych pracowników klubu</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§5. Hosting i logi serwera</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Serwis hostowany jest przez <strong>Render.com</strong> (Render Services, Inc., San Francisco, USA).
              W ramach technicznego utrzymania serwisu automatycznie zapisywane mogą być:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>Adresy URL żądanych zasobów</li>
              <li>Czas nadejścia i wysłania odpowiedzi</li>
              <li>Adres IP użytkownika</li>
              <li>Informacje o przeglądarce (User-Agent)</li>
              <li>Kody odpowiedzi HTTP</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
              Logi wykorzystywane są wyłącznie w celach technicznych i bezpieczeństwa. Polityka prywatności Render: <a href="https://render.com/privacy" target="_blank" rel="noopener" className="text-primary underline">render.com/privacy</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§6. Pliki cookie i analityka</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Szczegółowe informacje o plikach cookie i stosowanych narzędziach analitycznych znajdują się w naszej{" "}
              <Link href="/polityka-cookies" className="text-primary underline">Polityce Cookies</Link>.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Do analizy ruchu używamy <strong>Umami Analytics</strong> — narzędzia open-source hostowanego na własnym serwerze, 
              które nie używa plików cookie do śledzenia i nie przekazuje danych podmiotom trzecim. 
              Zbierane dane są w pełni anonimowe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§7. Twoje prawa</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">W związku z przetwarzaniem Twoich danych osobowych przysługują Ci następujące prawa:</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
              <li><strong>Prawo dostępu</strong> — możesz zażądać informacji o tym, jakie dane przetwarzamy</li>
              <li><strong>Prawo sprostowania</strong> — możesz zażądać poprawienia nieprawidłowych danych</li>
              <li><strong>Prawo usunięcia</strong> — możesz zażądać usunięcia danych („prawo do bycia zapomnianym")</li>
              <li><strong>Prawo ograniczenia przetwarzania</strong> — możesz zażądać ograniczenia przetwarzania danych</li>
              <li><strong>Prawo przenoszenia danych</strong> — możesz otrzymać swoje dane w formacie nadającym się do odczytu maszynowego</li>
              <li><strong>Prawo sprzeciwu</strong> — możesz sprzeciwić się przetwarzaniu opartemu na prawnie uzasadnionym interesie</li>
              <li><strong>Prawo cofnięcia zgody</strong> — w każdej chwili możesz cofnąć udzieloną zgodę (bez wpływu na zgodność z prawem przetwarzania przed cofnięciem)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Aby skorzystać z powyższych praw, skontaktuj się z nami: <a href="mailto:bizony.rzeszow@gmail.com" className="text-primary underline">bizony.rzeszow@gmail.com</a>
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Przysługuje Ci również prawo wniesienia skargi do organu nadzorczego — <strong>Prezesa Urzędu Ochrony Danych Osobowych</strong>, ul. Stawki 2, 00-193 Warszawa, <a href="https://uodo.gov.pl" target="_blank" rel="noopener" className="text-primary underline">uodo.gov.pl</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§8. Sklep internetowy</h2>
            <div className="space-y-2 text-muted-foreground leading-relaxed">
              <p>Składając zamówienie w sklepie podajesz dobrowolnie dane niezbędne do jego realizacji. Bez podania tych danych realizacja zamówienia nie jest możliwa.</p>
              <p>Dane zamówień przechowywane są przez <strong>5 lat</strong> od daty złożenia zamówienia, zgodnie z wymogami przepisów podatkowych i rachunkowych.</p>
              <p>Dane dotyczące zamówień dostępne są wyłącznie dla upoważnionych osób realizujących zamówienia w imieniu klubu.</p>
              <p>Nie profilujemy klientów ani nie podejmujemy zautomatyzowanych decyzji w oparciu o dane zamówień.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§9. Zmiany polityki</h2>
            <p className="text-muted-foreground leading-relaxed">
              Administrator zastrzega prawo do aktualizacji niniejszej polityki prywatności w przypadku zmian w sposobie przetwarzania danych lub zmian przepisów prawa. 
              Aktualna wersja dokumentu zawsze dostępna jest pod adresem <strong>bizonyrzeszow.pl/polityka-prywatnosci</strong>.
              O istotnych zmianach poinformujemy poprzez komunikat na stronie głównej.
            </p>
          </section>

          <div className="pt-8 border-t flex flex-wrap gap-4 justify-center">
            <Link href="/polityka-cookies" className="inline-flex items-center gap-2 border border-primary text-primary font-display uppercase tracking-wider px-6 py-3 rounded hover:bg-primary/5 transition-colors text-sm">
              Polityka Cookies
            </Link>
            <Link href="/regulamin" className="inline-flex items-center gap-2 border border-primary text-primary font-display uppercase tracking-wider px-6 py-3 rounded hover:bg-primary/5 transition-colors text-sm">
              Regulamin Sklepu
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white font-display uppercase tracking-wider px-6 py-3 rounded hover:bg-primary/90 transition-colors text-sm">
              ← Strona główna
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
