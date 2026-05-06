import { useApp, NewsItem } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import 'react-quill-new/dist/quill.snow.css';
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

function getEmbedUrl(url: string): string {
  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  // Vimeo
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;

  return url; // fallback – zwróć URL bez zmian
}

function getYoutubeThumbnail(videoUrl?: string, fallbackImage?: string): string {
  if (videoUrl) {
    const yt = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;

    const vm = videoUrl.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://vumbnail.com/${vm[1]}.jpg`;
  }
  return fallbackImage || "https://placehold.co/600x400";
}

export default function News() {
  const { news } = useApp();
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  
  const selectedItem = news.find(n => n.id === selectedNewsId);

  if (selectedItem) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedNewsId(null)}
            className="mb-8 hover:text-primary transition-colors uppercase font-display tracking-widest"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Powrót do Aktualności
          </Button>

          <article className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl shadow-2xl border border-border">
              {selectedItem.video_url ? (
                <iframe
                  src={getEmbedUrl(selectedItem.video_url)}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-primary font-bold uppercase tracking-[0.2em]">
                <Calendar className="w-4 h-4" /> {selectedItem.date}
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold uppercase leading-tight text-secondary">
                {selectedItem.title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed italic border-l-4 border-primary pl-6 py-2">
                {selectedItem.excerpt}
              </p>
            </div>

            <div
              className="news-content py-8 border-t border-border text-foreground"
              dangerouslySetInnerHTML={{ __html: selectedItem.content }}
            />
            {selectedItem.images && selectedItem.images.length > 0 && (
              <div className="py-8 border-t border-border">
                <h2 className="text-2xl font-display font-bold uppercase text-secondary mb-6">Galeria</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedItem.images.filter(url => url).map((url, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => { setViewerImages(selectedItem.images!.filter(u => u)); setViewerIndex(idx); }}
                      className="aspect-video overflow-hidden rounded-lg border border-border shadow-sm cursor-zoom-in"
                    >
                      <img src={url} alt={`Zdjęcie ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lightbox */}
            {viewerIndex !== null && (
              <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center" onClick={() => setViewerIndex(null)}>
                <button onClick={() => setViewerIndex(null)} className="absolute top-4 right-4 text-white/70 hover:text-white z-[110] p-2">✕</button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setViewerIndex((viewerIndex - 1 + viewerImages.length) % viewerImages.length); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-[110] p-2 bg-white/10 rounded-full hover:bg-white/20"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <img 
                  src={viewerImages[viewerIndex]} 
                  className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); setViewerIndex((viewerIndex + 1) % viewerImages.length); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-[110] p-2 bg-white/10 rounded-full hover:bg-white/20"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>
            )}
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-12 border-l-8 border-primary pl-6">
          Aktualności
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <Card 
              key={item.id} 
              onClick={() => setSelectedNewsId(item.id)}
              className="group overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full cursor-pointer hover:-translate-y-2 bg-white"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={getYoutubeThumbnail(item.video_url, item.image)} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-[0.2em] shadow-lg">
                  Wiadomości
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">
                  <Calendar className="w-3 h-3 text-primary" /> {item.date}
                </div>
                <CardTitle className="font-display text-2xl uppercase leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                  {item.excerpt}
                </p>
                <div className="mt-6 flex items-center text-primary text-[10px] font-bold uppercase tracking-[0.2em] group-hover:gap-2 transition-all">
                  Czytaj więcej <ArrowRight className="ml-1 w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
