import { Link } from "wouter";

export default function Regulamin() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-4 border-l-8 border-primary pl-6">
          Regulamin Sklepu
        </h1>
        <p className="text-muted-foreground mb-12 pl-7">Sklep internetowy Bizony Rzeszów — obowiązuje od 1 czerwca 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground">

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§1. Postanowienia ogólne</h2>
            <p className="text-muted-foreground leading-relaxed">
              Niniejszy regulamin określa zasady korzystania ze sklepu internetowego dostępnego pod adresem bizonyrzeszow.pl/sklep, prowadzonego przez Klub Baseballowy Bizony Rzeszów. Dokonując zakupu, Kupujący akceptuje niniejszy regulamin.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§2. Zamówienia</h2>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
              <li>Zamówienia przyjmowane są przez formularz na stronie sklepu.</li>
              <li>Po złożeniu zamówienia Kupujący otrzymuje potwierdzenie na podany adres e-mail.</li>
              <li>Zamówienie uważa się za przyjęte do realizacji po zaksięgowaniu płatności.</li>
              <li>Sklep zastrzega prawo do anulowania zamówienia w przypadku braku płatności w ciągu 3 dni roboczych.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§3. Ceny i płatności</h2>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
              <li>Wszystkie ceny podane są w złotych polskich (PLN) i zawierają podatek VAT.</li>
              <li>Dostępne metody płatności: przelew tradycyjny oraz BLIK na numer telefonu.</li>
              <li>Płatność należy uiścić w ciągu 3 dni roboczych od złożenia zamówienia.</li>
              <li>Dane do płatności przesyłane są w potwierdzeniu zamówienia na email.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§4. Dostawa</h2>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
              <li>Dostawa realizowana jest kurierem na terenie Polski. Koszt dostawy zgodny z aktualnym cennikiem podanym w sklepie.</li>
              <li>Możliwy jest odbiór osobisty pod adresem: Sports SALOS, ul. Witolda Świadka 5a, Rzeszów — bezpłatnie. Termin odbioru ustalany jest indywidualnie.</li>
              <li>Czas realizacji zamówienia: do 14 dni roboczych od zaksięgowania płatności.</li>
              <li>Produkty na zamówienie (print-on-demand) mogą wymagać dłuższego czasu realizacji.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§5. Zwroty i reklamacje</h2>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
              <li>Kupujący ma prawo do odstąpienia od umowy w ciągu 14 dni od otrzymania towaru bez podania przyczyny.</li>
              <li>Produkty personalizowane lub wykonane na zamówienie mogą być wyłączone z prawa zwrotu.</li>
              <li>Reklamacje należy składać drogą mailową na adres: bizony.rzeszow@gmail.com.</li>
              <li>Reklamacje rozpatrywane są w ciągu 14 dni roboczych.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§6. Dane osobowe</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dane osobowe Kupującego przetwarzane są wyłącznie w celu realizacji zamówienia i nie są udostępniane podmiotom trzecim bez zgody Kupującego, z wyjątkiem podmiotów uczestniczących w realizacji zamówienia (np. firma kurierska). Podstawą przetwarzania jest umowa sprzedaży (art. 6 ust. 1 lit. b RODO).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold uppercase text-secondary mb-3">§7. Postanowienia końcowe</h2>
            <p className="text-muted-foreground leading-relaxed">
              W sprawach nieuregulowanych niniejszym regulaminem mają zastosowanie przepisy Kodeksu Cywilnego oraz ustawy o prawach konsumenta. Regulamin może ulec zmianie — aktualna wersja dostępna jest zawsze na stronie bizonyrzeszow.pl/regulamin.
            </p>
          </section>

          <div className="pt-8 border-t text-center">
            <Link href="/sklep" className="inline-flex items-center gap-2 bg-primary text-white font-display uppercase tracking-wider px-6 py-3 rounded hover:bg-primary/90 transition-colors text-sm">
              ← Wróć do sklepu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
