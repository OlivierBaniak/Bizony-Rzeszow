import { useApp } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";

export default function Team() {
  const { players } = useApp();

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-12 border-l-8 border-primary pl-6">
          Poznaj Drużynę
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {players.map((player) => (
            <Card key={player.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img 
                  src={player.image} 
                  alt={player.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                   <div className="text-6xl font-display font-bold text-white/10 absolute -top-12 right-4 select-none group-hover:text-primary/20 transition-colors">
                    {player.number}
                   </div>
                  <div className="relative z-10">
                    <div className="text-primary font-bold uppercase tracking-widest text-xs mb-1">
                      {player.position}
                    </div>
                    <h3 className="text-3xl font-display uppercase font-bold leading-none">
                      {player.name}
                    </h3>
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
