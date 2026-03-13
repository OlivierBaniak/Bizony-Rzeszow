import { useApp } from "@/lib/store";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Trophy } from "lucide-react";
import heroImg from "@assets/1771073775355_1771144286177.jpg";
import logo from "@assets/bizony--rSs6oZ4_1770847193876.webp";
import mainSign from "@assets/bizony-sign.webp";
import { motion } from "framer-motion";

export default function Home() {
  const { news, standings, nextMatch } = useApp();
  const latestNews = news.slice(0, 3);
  const topTeams = standings.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImg} 
            alt="Stadium" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-secondary/50 to-secondary/30" />
        </div>
        
        <div className="relative container mx-auto px-4 text-center text-white space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 border border-primary/50 bg-primary rounded-full text-sm font-bold uppercase tracking-widest mb-8 text-white">
              Oficjalna Strona Drużyny
            </span>
            <div className="flex justify-center mb-8">
              <img 
                src={mainSign} 
                alt="Bizony Rzeszów Sign" 
                className="max-w-[300px] md:max-w-[500px] w-full h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/standings">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-display text-xl uppercase px-8 h-14">
                  Zobacz Tabelę
                </Button>
              </Link>
              <Link href="/team">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white font-display text-xl uppercase px-8 h-14">
                  Poznaj Drużynę
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest News & Quick Standings Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* News Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-display font-bold uppercase text-secondary">Aktualności</h2>
              <Link href="/news">
                <Button variant="link" className="text-primary hover:text-primary/80 group">
                  Zobacz Wszystkie <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {latestNews.map((item, idx) => (
                <Link key={item.id} href={`/news`}>
                  <Card className={`group cursor-pointer overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 ${idx === 0 ? 'md:col-span-2' : ''}`}>
                    <div className={`relative ${idx === 0 ? 'aspect-[21/9]' : 'aspect-video'} overflow-hidden`}>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 text-primary">
                          <Calendar className="w-3 h-3" /> {item.date}
                        </div>
                        <h3 className={`${idx === 0 ? 'text-3xl' : 'text-xl'} font-display font-bold uppercase leading-tight group-hover:text-primary transition-colors`}>
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar / Standings */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              <h2 className="text-4xl font-display font-bold uppercase text-secondary">Tabela Ligowa</h2>
            </div>

            <Card className="border-t-4 border-t-primary shadow-lg">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground uppercase font-display tracking-wider">
                    <tr>
                      <th className="p-3 text-left">Drużyna</th>
                      <th className="p-3 text-center">W</th>
                      <th className="p-3 text-center">P</th>
                      <th className="p-3 text-center font-bold">Pkt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTeams.map((team, i) => (
                      <tr key={team.id} className={`border-b last:border-0 ${i === 0 ? 'bg-primary/5' : ''}`}>
                        <td className="p-3 font-medium flex items-center gap-2">
                          <span className="text-muted-foreground w-4">{i + 1}.</span>
                          {team.team}
                        </td>
                        <td className="p-3 text-center text-muted-foreground">{team.won}</td>
                        <td className="p-3 text-center text-muted-foreground">{team.lost}</td>
                        <td className="p-3 text-center font-bold text-primary">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-4 border-t bg-muted/20">
                  <Link href="/standings">
                    <Button variant="outline" className="w-full uppercase font-display tracking-wider text-xs">
                      Pełna Tabela
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Next Match Promo */}
            <div className="bg-secondary text-white p-6 rounded-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
              <h3 className="font-display uppercase tracking-widest text-primary mb-4 text-sm font-bold text-center">Następny Mecz</h3>
              <div className="text-center space-y-4">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 mb-2 flex items-center justify-center bg-white/5 rounded-full overflow-hidden">
                      {nextMatch.homeLogo ? (
                        <img src={nextMatch.homeLogo} alt={nextMatch.homeTeam} className="w-full h-full object-contain" />
                      ) : (
                        <img src={logo} alt="Default Logo" className="w-8 h-8 object-contain opacity-50" />
                      )}
                    </div>
                    <span className="font-bold text-sm uppercase tracking-wider">{nextMatch.homeTeam}</span>
                  </div>
                  
                  <span className="text-primary font-display text-2xl font-bold italic">VS</span>
                  
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 mb-2 flex items-center justify-center bg-white/5 rounded-full overflow-hidden">
                      {nextMatch.awayLogo ? (
                        <img src={nextMatch.awayLogo} alt={nextMatch.awayTeam} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">VS</div>
                      )}
                    </div>
                    <span className="font-bold text-sm uppercase tracking-wider">{nextMatch.awayTeam}</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-white/10">
                  <div className="text-4xl font-display font-bold text-primary">{nextMatch.date}</div>
                  <div className="text-sm text-gray-400 mt-1 uppercase tracking-widest">
                    {nextMatch.time} • {nextMatch.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
