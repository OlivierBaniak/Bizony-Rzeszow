import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Plus, Minus, ChevronRight, CheckCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
  category: string;
  inStock: boolean;
}

interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

const STATUS_LABELS: Record<string, string> = {
  new: "Nowe",
  paid: "Opłacone",
  shipped: "Wysłane",
  completed: "Zrealizowane",
  cancelled: "Anulowane",
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState<"shop" | "checkout" | "success">("shop");
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "blik">("transfer");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => setProducts(data.filter((p: Product) => p.inStock)))
      .catch(() => {});
  }, []);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const addToCart = (product: Product) => {
    const size = selectedSizes[product.id] || (product.sizes[0] ?? "");
    if (product.sizes.length > 0 && !selectedSizes[product.id]) {
      alert("Wybierz rozmiar przed dodaniem do koszyka.");
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size);
      if (existing) return prev.map(i => i.product.id === product.id && i.size === size ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, size, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (productId: string, size: string, delta: number) => {
    setCart(prev => prev
      .map(i => i.product.id === productId && i.size === size ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    );
  };

  const handleOrder = async () => {
    if (!form.customerName || !form.customerEmail || !form.customerAddress) {
      alert("Uzupełnij wymagane pola.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          customerAddress: form.customerAddress,
          notes: form.notes,
          paymentMethod,
          totalAmount,
          items: cart.map(i => ({
            productId: i.product.id,
            productName: i.product.name,
            size: i.size,
            quantity: i.quantity,
            price: i.product.price,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrderNumber(data.orderNumber);
      setStep("success");
      setCart([]);
    } catch (err) {
      alert("Błąd składania zamówienia. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  // ── Sukces ──
  if (step === "success") {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl font-display font-bold uppercase text-secondary mb-4">
            Zamówienie złożone!
          </h1>
          <p className="text-muted-foreground mb-2">Nr zamówienia: <strong className="text-primary">{orderNumber}</strong></p>
          <p className="text-muted-foreground mb-8">Wysłaliśmy potwierdzenie na Twój email. Sprawdź skrzynkę.</p>

          <div className="bg-secondary text-white p-8 rounded-lg text-left mb-8">
            <h2 className="font-display uppercase tracking-wider text-primary mb-4 text-lg">Dane do płatności</h2>
            {paymentMethod === "blik" ? (
              <>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">BLIK na numer</p>
                <p className="text-2xl font-display font-bold">570 168 991</p>
                <p className="text-gray-400 text-sm mt-1">Krzysztof Jurczyński</p>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Przelew bankowy</p>
                <p className="font-bold text-lg">Krzysztof Jurczyński</p>
                <p className="font-mono text-primary text-lg mt-1">48 2910 0006 0000 0000 2933 3770</p>
                <p className="text-sm text-gray-400 mt-2">Tytuł: <strong className="text-white">{orderNumber}</strong></p>
              </>
            )}
            <p className="mt-4 text-sm text-gray-400">
              Kwota: <strong className="text-white text-lg">{(totalAmount / 100).toFixed(2)} zł</strong>
              <span className="ml-2">(lub sprawdź email)</span>
            </p>
            <p className="mt-2 text-xs text-gray-500">Płatność w ciągu 3 dni roboczych. Po zaksięgowaniu skontaktujemy się z Tobą.</p>
          </div>

          <Button onClick={() => setStep("shop")} className="bg-primary hover:bg-primary/90 text-white font-display uppercase tracking-wider">
            Wróć do sklepu
          </Button>
        </div>
      </div>
    );
  }

  // ── Checkout ──
  if (step === "checkout") {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <button onClick={() => setStep("shop")} className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 uppercase font-display tracking-wider text-sm">
            ← Wróć do sklepu
          </button>
          <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-12 border-l-8 border-primary pl-6">
            Finalizacja
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formularz */}
            <div className="space-y-4">
              <h2 className="font-display uppercase tracking-wider text-lg font-bold border-b pb-2">Dane dostawy</h2>
              {[
                { key: "customerName", label: "Imię i nazwisko *", placeholder: "Jan Kowalski" },
                { key: "customerEmail", label: "Email *", placeholder: "jan@example.com" },
                { key: "customerPhone", label: "Telefon", placeholder: "+48 600 000 000" },
                { key: "customerAddress", label: "Adres dostawy *", placeholder: "ul. Przykładowa 1, 35-001 Rzeszów" },
              ].map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{f.label}</label>
                  <input
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Uwagi do zamówienia</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Opcjonalne uwagi..."
                  rows={3}
                  className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Metoda płatności */}
              <h2 className="font-display uppercase tracking-wider text-lg font-bold border-b pb-2 pt-4">Metoda płatności</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod("transfer")}
                  className={`p-4 border-2 rounded text-left transition-all ${paymentMethod === "transfer" ? "border-primary bg-primary/5" : "border-input"}`}
                >
                  <div className="font-display font-bold uppercase text-sm">Przelew</div>
                  <div className="text-xs text-muted-foreground mt-1">Tradycyjny przelew bankowy</div>
                </button>
                <button
                  onClick={() => setPaymentMethod("blik")}
                  className={`p-4 border-2 rounded text-left transition-all ${paymentMethod === "blik" ? "border-primary bg-primary/5" : "border-input"}`}
                >
                  <div className="font-display font-bold uppercase text-sm">BLIK</div>
                  <div className="text-xs text-muted-foreground mt-1">BLIK na numer telefonu</div>
                </button>
              </div>

              {paymentMethod === "transfer" && (
                <div className="bg-muted/50 rounded p-4 text-sm">
                  <p className="font-bold mb-1">Krzysztof Jurczyński</p>
                  <p className="font-mono text-primary">48 2910 0006 0000 0000 2933 3770</p>
                  <p className="text-muted-foreground text-xs mt-1">Tytuł przelewu: numer zamówienia (otrzymasz po złożeniu)</p>
                </div>
              )}
              {paymentMethod === "blik" && (
                <div className="bg-muted/50 rounded p-4 text-sm">
                  <p className="font-bold mb-1">BLIK na numer:</p>
                  <p className="text-primary text-xl font-display font-bold">570 168 991</p>
                  <p className="text-muted-foreground text-xs mt-1">Krzysztof Jurczyński</p>
                </div>
              )}
            </div>

            {/* Podsumowanie */}
            <div>
              <h2 className="font-display uppercase tracking-wider text-lg font-bold border-b pb-2 mb-4">Podsumowanie</h2>
              <div className="space-y-3 mb-6">
                {cart.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded">
                    <img src={item.product.image} className="w-14 h-14 object-cover rounded" alt={item.product.name} />
                    <div className="flex-1">
                      <div className="font-bold text-sm">{item.product.name}</div>
                      {item.size && <div className="text-xs text-muted-foreground">Rozmiar: {item.size}</div>}
                      <div className="text-xs text-muted-foreground">x{item.quantity}</div>
                    </div>
                    <div className="font-bold text-primary">{((item.product.price * item.quantity) / 100).toFixed(2)} zł</div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 flex justify-between items-center mb-6">
                <span className="font-display uppercase tracking-wider font-bold">Razem</span>
                <span className="text-2xl font-display font-bold text-primary">{(totalAmount / 100).toFixed(2)} zł</span>
              </div>
              <Button
                onClick={handleOrder}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-display uppercase tracking-wider text-lg h-14"
              >
                {loading ? "Składanie zamówienia..." : "Złóż zamówienie"}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Klikając „Złóż zamówienie" akceptujesz warunki sprzedaży. Płatność realizujesz po złożeniu zamówienia.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Sklep ──
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">

        {/* Nagłówek */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-display font-bold uppercase text-secondary border-l-8 border-primary pl-6">
            Sklep ⚾
          </h1>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 bg-secondary text-white px-5 py-3 rounded font-display uppercase tracking-wider text-sm hover:bg-secondary/90 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Koszyk
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Produkty */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl">Brak produktów w sklepie.</p>
            <p className="text-sm mt-2">Wróć wkrótce — już pracujemy nad ofertą!</p>
          </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <Card key={product.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={product.image || "https://placehold.co/400x400"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                    {product.category}
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-display text-base uppercase font-bold mb-1">
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

                  {product.sizes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Rozmiar</p>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                            className={`px-3 py-1 text-xs font-bold border rounded transition-all ${
                              selectedSizes[product.id] === size
                                ? "bg-secondary text-white border-secondary"
                                : "border-input hover:border-primary"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-display font-bold text-primary">
                      {(product.price / 100).toFixed(2)} zł
                    </span>
                    <Button
                      onClick={() => addToCart(product)}
                      className="bg-primary hover:bg-primary/90 text-white font-display uppercase tracking-wider text-xs px-4"
                    >
                      Dodaj do koszyka
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Koszyk sidebar */}
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/50" onClick={() => setCartOpen(false)} />
            <div className="w-full max-w-md bg-white flex flex-col shadow-2xl">
              <div className="bg-secondary text-white p-5 flex items-center justify-between">
                <h2 className="font-display uppercase tracking-wider text-xl font-bold flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" /> Koszyk
                </h2>
                <button onClick={() => setCartOpen(false)}><X className="w-6 h-6" /></button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Koszyk jest pusty
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {cart.map((item, i) => (
                      <div key={i} className="flex gap-3 items-start border-b pb-4">
                        <img src={item.product.image} className="w-16 h-16 object-cover rounded" alt={item.product.name} />
                        <div className="flex-1">
                          <div className="font-bold text-sm">{item.product.name}</div>
                          {item.size && <div className="text-xs text-muted-foreground">Rozmiar: {item.size}</div>}
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQty(item.product.id, item.size, -1)} className="w-6 h-6 border rounded flex items-center justify-center hover:bg-muted">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => updateQty(item.product.id, item.size, 1)} className="w-6 h-6 border rounded flex items-center justify-center hover:bg-muted">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="font-bold text-primary text-sm">
                          {((item.product.price * item.quantity) / 100).toFixed(2)} zł
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-5 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-display uppercase tracking-wider font-bold">Razem</span>
                      <span className="text-2xl font-display font-bold text-primary">{(totalAmount / 100).toFixed(2)} zł</span>
                    </div>
                    <Button
                      onClick={() => { setCartOpen(false); setStep("checkout"); }}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-display uppercase tracking-wider h-12 flex items-center gap-2"
                    >
                      Przejdź do zamówienia <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
