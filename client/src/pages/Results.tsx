import { useApp } from "@/lib/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";

export default function Results() {
  const { results } = useApp();

  // Group results by year
  const groupedResults = results.reduce((acc: any, result) => {
    const year = result.date.split('.')[0] || 'Inne';
    if (!acc[year]) acc[year] = [];
    acc[year].push(result);
    return acc;
  }, {});

  // Sort years descending
  const years = Object.keys(groupedResults).sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-12 border-l-8 border-primary pl-6">
          Wyniki Rozgrywek
        </h1>
        
        <div className="space-y-12">
          {years.map(year => (
            <div key={year} className="space-y-4">
              <div className="bg-[#1a237e] text-white p-4 rounded-t-lg shadow-lg">
                <h2 className="text-2xl font-display font-bold">{year}</h2>
              </div>
              <Card className="border-none shadow-xl overflow-hidden rounded-t-none">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/50 border-b">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-bold text-secondary flex items-center gap-2">Termin <ArrowUpDown className="w-3 h-3" /></TableHead>
                        <TableHead className="font-bold text-secondary">Miejsce <ArrowUpDown className="w-3 h-3" /></TableHead>
                        <TableHead className="font-bold text-secondary">Przeciwnik <ArrowUpDown className="w-3 h-3" /></TableHead>
                        <TableHead className="font-bold text-secondary">Rozgrywki <ArrowUpDown className="w-3 h-3" /></TableHead>
                        <TableHead className="font-bold text-secondary text-center">Wynik <ArrowUpDown className="w-3 h-3" /></TableHead>
                        <TableHead className="font-bold text-secondary text-center">Punkty Zdobyte <ArrowUpDown className="w-3 h-3" /></TableHead>
                        <TableHead className="font-bold text-secondary text-center">Punkty Stracone <ArrowUpDown className="w-3 h-3" /></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedResults[year].sort((a: any, b: any) => b.date.localeCompare(a.date)).map((item: any) => (
                        <TableRow key={item.id} className="hover:bg-primary/5 transition-colors">
                          <TableCell className="font-sans py-4">{item.date}</TableCell>
                          <TableCell className="font-sans">{item.location}</TableCell>
                          <TableCell className="font-sans font-medium">{item.opponent}</TableCell>
                          <TableCell className="font-sans">{item.competition}</TableCell>
                          <TableCell className="text-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${item.result === 'W' ? 'bg-green-600' : 'bg-red-600'}`}>
                              {item.result}
                            </span>
                          </TableCell>
                          <TableCell className="text-center font-bold text-lg">{item.pointsScored}</TableCell>
                          <TableCell className="text-center font-bold text-lg">{item.pointsConceded}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ))}

          {years.length === 0 && (
            <div className="bg-muted p-12 rounded-lg text-center border-2 border-dashed border-primary/20">
              <p className="text-2xl font-display uppercase text-muted-foreground">
                Brak wyników do wyświetlenia. Sezon w toku.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}