import { useApp } from "@/lib/store";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Gallery() {
  const { galleryFolders } = useApp();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [viewerImageIndex, setViewerImageIndex] = useState<number | null>(null);

  const selectedFolder = galleryFolders.find(f => f.id === selectedFolderId);

  const openViewer = (index: number) => {
    setViewerImageIndex(index);
  };

  const closeViewer = () => {
    setViewerImageIndex(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedFolder && viewerImageIndex !== null) {
      setViewerImageIndex((viewerImageIndex + 1) % selectedFolder.images.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedFolder && viewerImageIndex !== null) {
      setViewerImageIndex((viewerImageIndex - 1 + selectedFolder.images.length) % selectedFolder.images.length);
    }
  };

  if (selectedFolderId && selectedFolder) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedFolderId(null)}
            className="mb-8 hover:text-primary transition-colors"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Powrót do Albumów
          </Button>

          <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-4">
            {selectedFolder.title}
          </h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            {selectedFolder.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedFolder.images.map((img, index) => (
              <div 
                key={img.id}
                onClick={() => openViewer(index)}
                className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-lg shadow-md border border-border"
              >
                <img
                  src={img.url}
                  alt={img.description}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                  <Maximize2 className="text-white w-10 h-10" />
                </div>
                {img.description && (
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-medium">{img.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fullscreen Image Viewer */}
        {viewerImageIndex !== null && (
          <div 
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-300"
            onClick={closeViewer}
          >
            <button 
              onClick={closeViewer}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]"
            >
              <X className="w-8 h-8" />
            </button>

            <button 
              onClick={prevImage}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-[110] p-2 bg-white/10 rounded-full hover:bg-white/20"
            >
              <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
            </button>

            <div className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center">
              <img
                src={selectedFolder.images[viewerImageIndex].url}
                alt={selectedFolder.images[viewerImageIndex].description}
                className="max-w-full max-h-[80vh] object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="mt-6 text-center">
                <h2 className="text-white font-display text-2xl uppercase tracking-wider">
                  {selectedFolder.images[viewerImageIndex].description || selectedFolder.title}
                </h2>
                <p className="text-white/50 text-sm mt-2">
                  Zdjęcie {viewerImageIndex + 1} z {selectedFolder.images.length}
                </p>
              </div>
            </div>

            <button 
              onClick={nextImage}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-[110] p-2 bg-white/10 rounded-full hover:bg-white/20"
            >
              <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-12 border-l-8 border-primary pl-6">
          Galeria Zdjęć
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryFolders.map((folder) => (
            <Card 
              key={folder.id} 
              className="group cursor-pointer overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300"
              onClick={() => setSelectedFolderId(folder.id)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={folder.mainImage}
                  alt={folder.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-secondary via-secondary/60 to-transparent">
                  <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-1">
                    {folder.title}
                  </h3>
                  <p className="text-white/80 text-sm line-clamp-1">
                    {folder.description}
                  </p>
                  <div className="mt-4 flex items-center text-primary text-xs font-bold uppercase tracking-widest">
                    Zobacz Album ({folder.images.length})
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
