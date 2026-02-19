export default function Results() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-12 border-l-8 border-primary pl-6">
          Wyniki Rozgrywek
        </h1>
        
        <div className="bg-muted p-12 rounded-lg text-center border-2 border-dashed border-primary/20">
          <p className="text-2xl font-display uppercase text-muted-foreground">
            Brak wyników do wyświetlenia. Sezon w toku.
          </p>
        </div>
      </div>
    </div>
  );
}