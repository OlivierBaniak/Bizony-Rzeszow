import { useApp } from "@/lib/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Standings() {
  const { standings, leagueMetadata } = useApp();
  // Sort standings by points (descending)
  const sortedStandings = [...standings].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-display font-bold uppercase text-secondary mb-12 border-l-8 border-primary pl-6">
          {leagueMetadata.title}
        </h1>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-secondary text-white">
            <CardTitle className="font-display uppercase tracking-wider text-2xl">
              {leagueMetadata.subtitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="w-[100px] text-center font-bold uppercase">Miejsce</TableHead>
                  <TableHead className="uppercase font-bold">Drużyna</TableHead>
                  <TableHead className="text-center uppercase font-bold">M</TableHead>
                  <TableHead className="text-center uppercase font-bold text-green-600">W</TableHead>
                  <TableHead className="text-center uppercase font-bold text-red-600">P</TableHead>
                  <TableHead className="text-center uppercase font-bold text-green-600">R+</TableHead>
                  <TableHead className="text-center uppercase font-bold text-red-600">R-</TableHead>
                  <TableHead className="text-center uppercase font-bold text-primary text-lg">RD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStandings.map((team, index) => (
                  <TableRow key={team.id} className="group hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium text-center text-lg text-muted-foreground group-hover:text-primary">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-display text-xl uppercase font-bold text-secondary">
                      {team.team}
                    </TableCell>
                    <TableCell className="text-center">{team.played}</TableCell>
                    <TableCell className="text-center font-bold">{team.won}</TableCell>
                    <TableCell className="text-center">{team.lost}</TableCell>
                    <TableCell className="text-center font-bold text-green-600">{team.runsScored}</TableCell>
                    <TableCell className="text-center font-bold text-red-600">{team.runsAllowed}</TableCell>
                    <TableCell className="text-center font-bold text-lg text-primary">{team.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
