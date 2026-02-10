import { useApp } from "@/lib/store";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Save, LayoutDashboard, Newspaper, Users, Trophy, Image as ImageIcon } from "lucide-react";

export default function AdminDashboard() {
  const { 
    isAdmin, 
    news, addNews, deleteNews,
    players, addPlayer, deletePlayer,
    standings, updateStandings,
    gallery, addGalleryItem, deleteGalleryItem
  } = useApp();
  const [, setLocation] = useLocation();

  // Form States
  const [newsForm, setNewsForm] = useState({ title: "", excerpt: "", content: "", image: "" });
  const [playerForm, setPlayerForm] = useState({ name: "", number: "", position: "", image: "" });
  const [galleryForm, setGalleryForm] = useState({ title: "", url: "" });
  
  // Local state for standings editing
  const [standingsDraft, setStandingsDraft] = useState(standings);

  if (!isAdmin) {
    setLocation("/login");
    return null;
  }

  const handleAddNews = () => {
    if (!newsForm.title) return;
    addNews({ ...newsForm, image: newsForm.image || "https://placehold.co/600x400" });
    setNewsForm({ title: "", excerpt: "", content: "", image: "" });
  };

  const handleAddPlayer = () => {
    if (!playerForm.name) return;
    addPlayer({ 
      ...playerForm, 
      number: parseInt(playerForm.number) || 0,
      image: playerForm.image || "https://placehold.co/400x600" 
    });
    setPlayerForm({ name: "", number: "", position: "", image: "" });
  };

  const handleAddGallery = () => {
    if (!galleryForm.url) return;
    addGalleryItem(galleryForm);
    setGalleryForm({ title: "", url: "" });
  };

  const handleSaveStandings = () => {
    updateStandings(standingsDraft);
  };

  const updateDraftTeam = (id: string, field: string, value: string | number) => {
    setStandingsDraft(standingsDraft.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-secondary text-white py-8 mb-8 shadow-md">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold uppercase tracking-wider">CMS Dashboard</h1>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="bg-white p-1 shadow-sm border h-auto flex-wrap justify-start">
            <TabsTrigger value="news" className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-2 uppercase font-display tracking-wider">
              <Newspaper className="w-4 h-4 mr-2" /> Aktualności
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-2 uppercase font-display tracking-wider">
              <Users className="w-4 h-4 mr-2" /> Skład
            </TabsTrigger>
            <TabsTrigger value="standings" className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-2 uppercase font-display tracking-wider">
              <Trophy className="w-4 h-4 mr-2" /> Tabela
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-2 uppercase font-display tracking-wider">
              <ImageIcon className="w-4 h-4 mr-2" /> Galeria
            </TabsTrigger>
          </TabsList>

          {/* NEWS TAB */}
          <TabsContent value="news" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 h-fit">
                <CardHeader><CardTitle>Dodaj Artykuł</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tytuł</Label>
                    <Input value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} placeholder="Zwycięstwo nad Warszawą..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Wstęp</Label>
                    <Textarea value={newsForm.excerpt} onChange={e => setNewsForm({...newsForm, excerpt: e.target.value})} placeholder="Krótkie podsumowanie..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Treść</Label>
                    <Textarea className="h-32" value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} placeholder="Pełna treść..." />
                  </div>
                  <div className="space-y-2">
                    <Label>URL Obrazu</Label>
                    <Input value={newsForm.image} onChange={e => setNewsForm({...newsForm, image: e.target.value})} placeholder="https://..." />
                  </div>
                  <Button onClick={handleAddNews} className="w-full bg-primary hover:bg-primary/90 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Opublikuj
                  </Button>
                </CardContent>
              </Card>

              <div className="md:col-span-2 space-y-4">
                {news.map(item => (
                  <Card key={item.id} className="flex flex-row items-center p-4 gap-4">
                    <img src={item.image} className="w-24 h-24 object-cover rounded bg-muted" />
                    <div className="flex-grow">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => deleteNews(item.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TEAM TAB */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 h-fit">
                <CardHeader><CardTitle>Add Player</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={playerForm.name} onChange={e => setPlayerForm({...playerForm, name: e.target.value})} placeholder="John Doe" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Number</Label>
                      <Input type="number" value={playerForm.number} onChange={e => setPlayerForm({...playerForm, number: e.target.value})} placeholder="23" />
                    </div>
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input value={playerForm.position} onChange={e => setPlayerForm({...playerForm, position: e.target.value})} placeholder="Pitcher" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Photo URL</Label>
                    <Input value={playerForm.image} onChange={e => setPlayerForm({...playerForm, image: e.target.value})} placeholder="https://..." />
                  </div>
                  <Button onClick={handleAddPlayer} className="w-full bg-primary hover:bg-primary/90 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Player
                  </Button>
                </CardContent>
              </Card>

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {players.map(player => (
                  <Card key={player.id} className="flex items-center p-4 gap-4">
                    <img src={player.image} className="w-16 h-16 object-cover rounded-full bg-muted" />
                    <div className="flex-grow">
                      <h3 className="font-bold">{player.name}</h3>
                      <p className="text-sm text-muted-foreground">#{player.number} • {player.position}</p>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => deletePlayer(player.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* STANDINGS TAB */}
          <TabsContent value="standings">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Manage League Table</CardTitle>
                <Button onClick={handleSaveStandings} className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                   <div className="grid grid-cols-6 font-bold text-sm uppercase bg-muted p-3 rounded">
                      <div className="col-span-2">Team Name</div>
                      <div className="text-center">Played</div>
                      <div className="text-center">Won</div>
                      <div className="text-center">Lost</div>
                      <div className="text-center">Points</div>
                   </div>
                   {standingsDraft.map(team => (
                     <div key={team.id} className="grid grid-cols-6 gap-2 items-center p-2 border-b">
                        <div className="col-span-2">
                          <Input value={team.team} onChange={e => updateDraftTeam(team.id, 'team', e.target.value)} />
                        </div>
                        <Input type="number" value={team.played} onChange={e => updateDraftTeam(team.id, 'played', parseInt(e.target.value))} className="text-center" />
                        <Input type="number" value={team.won} onChange={e => updateDraftTeam(team.id, 'won', parseInt(e.target.value))} className="text-center" />
                        <Input type="number" value={team.lost} onChange={e => updateDraftTeam(team.id, 'lost', parseInt(e.target.value))} className="text-center" />
                        <Input type="number" value={team.points} onChange={e => updateDraftTeam(team.id, 'points', parseInt(e.target.value))} className="text-center font-bold" />
                     </div>
                   ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* GALLERY TAB */}
           <TabsContent value="gallery" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 h-fit">
                <CardHeader><CardTitle>Add Photo</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title / Caption</Label>
                    <Input value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} placeholder="Game vs Kutno" />
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input value={galleryForm.url} onChange={e => setGalleryForm({...galleryForm, url: e.target.value})} placeholder="https://..." />
                  </div>
                  <Button onClick={handleAddGallery} className="w-full bg-primary hover:bg-primary/90 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add to Gallery
                  </Button>
                </CardContent>
              </Card>

              <div className="md:col-span-2 grid grid-cols-3 gap-4">
                {gallery.map(item => (
                  <div key={item.id} className="relative group aspect-square rounded overflow-hidden">
                    <img src={item.url} className="w-full h-full object-cover" />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => deleteGalleryItem(item.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                    <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-xs p-2 truncate">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
