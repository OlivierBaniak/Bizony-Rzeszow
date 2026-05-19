import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar } from "lucide-react";
import 'react-quill-new/dist/quill.snow.css';

interface LearnArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  slug: string;
  sortOrder: number;
  createdAt?: string;
}

export default function LearnBaseball() {
  const [articles, setArticles] = useState<LearnArticle[]>([]);
  const [selected, setSelected] = useState<LearnArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learn")
      .then(r => r.json())
      .then(data => { setArticles(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (selected) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => setSelected(null)}
            className="mb-8 hover:text-primary transition-colors uppercase font-display tracking-widest"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Powrót do Poznaj Baseball
          </Button>

          <article className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl shadow-2xl border border-border">
              <img
                src={selected.image}
                alt={selected.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 bg-green-700 text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-[0.2em] shadow-lg">
                Poznaj Baseball
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-display font-bold uppercase leading-tight text-secondary">
                {selected.title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed italic border-l-4 border-primary pl-6 py-2">
                {selected.excerpt}
              </p>
            </div>

            <div
              className="news-content py-8 border-t border-border text-foreground"
              dangerouslySetInnerHTML={{ __html: selected.content }}
            />
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-4 border-l-8 border-primary pl-6">
          Poznaj Baseball
        </h1>
        <p className="text-muted-foreground mb-12 pl-7">
          Nie znasz zasad? Nie szkodzi — wyjaśniamy wszystko od podstaw.
        </p>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Ładowanie...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card
                key={article.id}
                onClick={() => setSelected(article)}
                className="group overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full cursor-pointer hover:-translate-y-2 bg-white"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                  <div className="absolute top-4 left-4 bg-green-700 text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-[0.2em] shadow-lg">
                    Poznaj Baseball
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-2xl uppercase leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow pt-0">
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="mt-6 flex items-center text-primary text-[10px] font-bold uppercase tracking-[0.2em] group-hover:gap-2 transition-all">
                    Czytaj więcej →
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
