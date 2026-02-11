import { useApp } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const { clubHistory } = useApp();

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-12 border-l-8 border-primary pl-6">
          O Klubie
        </h1>

        <div className="space-y-12">
          <Card className="border-none shadow-xl overflow-hidden bg-white">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans">
                {clubHistory.content}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clubHistory.images.map((img, i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-lg aspect-video border border-border">
                <img 
                  src={img} 
                  alt={`Klubowe zdjęcie ${i + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
