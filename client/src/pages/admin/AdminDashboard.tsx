import { useApp } from "@/lib/store";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Save, LayoutDashboard, Newspaper, Users, Trophy, Image as ImageIcon, FolderOpen, Info } from "lucide-react";

export default function AdminDashboard() {
  const { 
    isAdmin, 
    news, addNews, deleteNews,
    players, addPlayer, deletePlayer,
    standings, updateStandings,
    leagueMetadata, updateLeagueMetadata,
    galleryFolders, addGalleryFolder, deleteGalleryFolder, addImageToFolder, deleteImageFromFolder,
    clubHistory, updateClubHistory,
    nextMatch, updateNextMatch
  } = useApp();
  const [, setLocation] = useLocation();

  // Form States
  const [newsForm, setNewsForm] = useState({ title: "", excerpt: "", content: "", image: "" });
  const [playerForm, setPlayerForm] = useState({ name: "", number: "", position: "", image: "" });
  const [folderForm, setFolderForm] = useState({ title: "", description: "", mainImage: "" });
  const [imageForm, setImageForm] = useState({ url: "", description: "" });
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  
  // Local states for metadata and history
  const [metaDraft, setMetaDraft] = useState(leagueMetadata);
  const [standingsDraft, setStandingsDraft] = useState(standings);
  const [historyDraft, setHistoryDraft] = useState(clubHistory);
  const [matchDraft, setMatchDraft] = useState(nextMatch);

  if (!isAdmin) {
    setLocation("/login");
    return null;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (urls: string[]) => void) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const urls: string[] = [];
    let processedCount = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        urls.push(reader.result as string);
        processedCount++;
        if (processedCount === files.length) {
          callback(urls);
        }
      };
      reader.readAsDataURL(file);
    });
  };

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

  const handleAddFolder = () => {
    if (!folderForm.title) return;
    addGalleryFolder(folderForm);
    setFolderForm({ title: "", description: "", mainImage: "" });
  };

  const handleAddImage = (folderId: string) => {
    if (!imageForm.url) return;
    addImageToFolder(folderId, imageForm);
    setImageForm({ url: "", description: "" });
  };

  const handleSaveStandings = () => {
    updateStandings(standingsDraft);
    updateLeagueMetadata(metaDraft);
  };

  const handleSaveHistory = () => {
    updateClubHistory(historyDraft);
  };

  const handleSaveMatch = () => {
    updateNextMatch(matchDraft);
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
            <TabsTrigger value="news" className="px-6 py-2 uppercase font-display tracking-wider">
              Aktualności
            </TabsTrigger>
            <TabsTrigger value="team" className="px-6 py-2 uppercase font-display tracking-wider">
              Skład
            </TabsTrigger>
            <TabsTrigger value="standings" className="px-6 py-2 uppercase font-display tracking-wider">
              Tabela
            </TabsTrigger>
            <TabsTrigger value="gallery" className="px-6 py-2 uppercase font-display tracking-wider">
              Galeria
            </TabsTrigger>
            <TabsTrigger value="about" className="px-6 py-2 uppercase font-display tracking-wider">
              O Klubie
            </TabsTrigger>
            <TabsTrigger value="match" className="px-6 py-2 uppercase font-display tracking-wider">
              Mecz
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
                    <Label>Obraz (Adres URL lub Prześlij)</Label>
                    <div className="flex gap-2">
                      <Input value={newsForm.image} onChange={e => setNewsForm({...newsForm, image: e.target.value})} placeholder="https://..." />
                      <div className="relative">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={(e) => handleFileUpload(e, (url) => setNewsForm({...newsForm, image: url}))}
                        />
                        <Button variant="outline" type="button">Wybierz</Button>
                      </div>
                    </div>
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
                <CardHeader><CardTitle>Dodaj Zawodnika</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Imię i Nazwisko</Label>
                    <Input value={playerForm.name} onChange={e => setPlayerForm({...playerForm, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Numer</Label>
                      <Input type="number" value={playerForm.number} onChange={e => setPlayerForm({...playerForm, number: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Pozycja</Label>
                      <Input value={playerForm.position} onChange={e => setPlayerForm({...playerForm, position: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Zdjęcie (Adres URL lub Prześlij)</Label>
                    <div className="flex gap-2">
                      <Input value={playerForm.image} onChange={e => setPlayerForm({...playerForm, image: e.target.value})} />
                      <div className="relative">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={(e) => handleFileUpload(e, (url) => setPlayerForm({...playerForm, image: url}))}
                        />
                        <Button variant="outline" type="button">Wybierz</Button>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleAddPlayer} className="w-full bg-primary">Dodaj</Button>
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
          <TabsContent value="standings" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center border-b">
                <CardTitle>Zarządzaj Tabelą i Nagłówkami</CardTitle>
                <Button onClick={handleSaveStandings} className="bg-green-600 hover:bg-green-700 text-white font-display uppercase tracking-wider">
                  <Save className="w-4 h-4 mr-2" /> Zapisz Wszystko
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Główny Nagłówek (np. Tabela Ligowa)</Label>
                    <Input value={metaDraft.title} onChange={e => setMetaDraft({...metaDraft, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Podtytuł (np. Sezon Zasadniczy 2026)</Label>
                    <Input value={metaDraft.subtitle} onChange={e => setMetaDraft({...metaDraft, subtitle: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                   <Label className="text-lg font-display uppercase mb-4 block">Wyniki Drużyn</Label>
                   <div className="grid grid-cols-7 font-bold text-xs uppercase bg-muted p-3 rounded">
                      <div className="col-span-2">Drużyna</div>
                      <div className="text-center">Mecze</div>
                      <div className="text-center">W</div>
                      <div className="text-center">P</div>
                      <div className="text-center">Pkt</div>
                      <div></div>
                   </div>
                   {standingsDraft.map(team => (
                     <div key={team.id} className="grid grid-cols-7 gap-2 items-center p-2 border-b">
                        <div className="col-span-2">
                          <Input value={team.team} onChange={e => updateDraftTeam(team.id, 'team', e.target.value)} />
                        </div>
                        <Input type="number" value={team.played} onChange={e => updateDraftTeam(team.id, 'played', parseInt(e.target.value))} className="text-center" />
                        <Input type="number" value={team.won} onChange={e => updateDraftTeam(team.id, 'won', parseInt(e.target.value))} className="text-center" />
                        <Input type="number" value={team.lost} onChange={e => updateDraftTeam(team.id, 'lost', parseInt(e.target.value))} className="text-center" />
                        <Input type="number" value={team.points} onChange={e => updateDraftTeam(team.id, 'points', parseInt(e.target.value))} className="text-center font-bold" />
                        <Button variant="ghost" size="icon" onClick={() => setStandingsDraft(standingsDraft.filter(t => t.id !== team.id))}>
                          <Trash className="w-4 h-4 text-destructive" />
                        </Button>
                     </div>
                   ))}
                   <Button variant="outline" className="mt-4" onClick={() => setStandingsDraft([...standingsDraft, { id: Math.random().toString(), team: "Nowa Drużyna", played: 0, won: 0, lost: 0, points: 0 }])}>
                     <Plus className="w-4 h-4 mr-2" /> Dodaj Wiersz
                   </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* GALLERY TAB */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 h-fit">
                <CardHeader><CardTitle>Nowy Album</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tytuł Albumu</Label>
                    <Input value={folderForm.title} onChange={e => setFolderForm({...folderForm, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Krótki Opis</Label>
                    <Textarea value={folderForm.description} onChange={e => setFolderForm({...folderForm, description: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Zdjęcie Główne (Adres URL lub Prześlij)</Label>
                    <div className="flex gap-2">
                      <Input value={folderForm.mainImage} onChange={e => setFolderForm({...folderForm, mainImage: e.target.value})} />
                      <div className="relative">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={(e) => handleFileUpload(e, (url) => setFolderForm({...folderForm, mainImage: url}))}
                        />
                        <Button variant="outline" type="button">Wybierz</Button>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleAddFolder} className="w-full bg-primary">
                    Stwórz Album
                  </Button>
                </CardContent>
              </Card>

              <div className="md:col-span-2 space-y-6">
                {galleryFolders.map(folder => (
                  <Card key={folder.id} className={`border-2 transition-colors ${selectedFolderId === folder.id ? 'border-primary' : 'border-transparent'}`}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={folder.mainImage} className="w-16 h-12 object-cover rounded" />
                        <div>
                          <CardTitle className="text-xl uppercase font-display">{folder.title}</CardTitle>
                          <p className="text-xs text-muted-foreground">{folder.images.length} zdjęć</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedFolderId(selectedFolderId === folder.id ? null : folder.id)}>
                          <FolderOpen className="w-4 h-4 mr-2" /> 
                          {selectedFolderId === folder.id ? 'Zamknij' : 'Zarządzaj'}
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => deleteGalleryFolder(folder.id)}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    {selectedFolderId === folder.id && (
                      <CardContent className="pt-4 border-t bg-muted/20">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs">Nowe Zdjęcie (Adres URL lub Prześlij)</Label>
                              <div className="flex gap-2">
                                <Input value={imageForm.url} onChange={e => setImageForm({...imageForm, url: e.target.value})} />
                                <div className="relative">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    multiple
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                                    onChange={(e) => handleMultipleFilesUpload(e, (urls) => {
                                      urls.forEach(url => {
                                        addImageToFolder(folder.id, { url, description: imageForm.description });
                                      });
                                      setImageForm({ url: "", description: "" });
                                      // Clear the input value so the same files can be selected again if needed
                                      e.target.value = "";
                                    })}
                                  />
                                  <Button variant="outline" type="button" className="relative z-0">Wybierz (Wiele)</Button>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Opis Zdjęcia</Label>
                              <div className="flex gap-2">
                                <Input value={imageForm.description} onChange={e => setImageForm({...imageForm, description: e.target.value})} />
                                <Button onClick={() => handleAddImage(folder.id)}>Dodaj</Button>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {folder.images.map(img => (
                              <div key={img.id} className="relative aspect-square group">
                                <img src={img.url} className="w-full h-full object-cover rounded border" />
                                <Button 
                                  variant="destructive" size="icon" 
                                  className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100"
                                  onClick={() => deleteImageFromFolder(folder.id, img.id)}
                                >
                                  <Trash className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ABOUT TAB */}
          <TabsContent value="about">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center border-b">
                <CardTitle>Historia Klubu</CardTitle>
                <Button onClick={handleSaveHistory} className="bg-green-600 hover:bg-green-700 text-white font-display uppercase tracking-wider">
                  <Save className="w-4 h-4 mr-2" /> Zapisz Historię
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label>Treść Historii (obsługuje wiele linii)</Label>
                  <Textarea 
                    className="h-64 font-sans text-lg" 
                    value={historyDraft.content} 
                    onChange={e => setHistoryDraft({...historyDraft, content: e.target.value})} 
                  />
                </div>
                <div className="space-y-4">
                   <Label>Zdjęcia w sekcji O Klubie (Adres URL lub Prześlij)</Label>
                   {historyDraft.images.map((url, idx) => (
                     <div key={idx} className="flex gap-2">
                       <Input value={url} onChange={e => {
                         const newImages = [...historyDraft.images];
                         newImages[idx] = e.target.value;
                         setHistoryDraft({...historyDraft, images: newImages});
                       }} />
                       <div className="relative">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={(e) => handleFileUpload(e, (uploadedUrl) => {
                            const newImages = [...historyDraft.images];
                            newImages[idx] = uploadedUrl;
                            setHistoryDraft({...historyDraft, images: newImages});
                          })}
                        />
                        <Button variant="outline" type="button">Wybierz</Button>
                      </div>
                       <Button variant="destructive" size="icon" onClick={() => {
                         setHistoryDraft({...historyDraft, images: historyDraft.images.filter((_, i) => i !== idx)});
                       }}>
                         <Trash className="w-4 h-4" />
                       </Button>
                     </div>
                   ))}
                   <Button variant="outline" onClick={() => setHistoryDraft({...historyDraft, images: [...historyDraft.images, ""]})}>
                     <Plus className="w-4 h-4 mr-2" /> Dodaj URL Zdjęcia
                   </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MATCH TAB */}
          <TabsContent value="match">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center border-b">
                <CardTitle>Następny Mecz</CardTitle>
                <Button onClick={handleSaveMatch} className="bg-green-600 hover:bg-green-700 text-white font-display uppercase tracking-wider">
                  <Save className="w-4 h-4 mr-2" /> Zapisz Mecz
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Home Team */}
                  <div className="space-y-4">
                    <h3 className="font-display text-xl border-b pb-2">Gospodarz</h3>
                    <div className="space-y-2">
                      <Label>Nazwa Drużyny</Label>
                      <Input value={matchDraft.homeTeam} onChange={e => setMatchDraft({...matchDraft, homeTeam: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Logo Drużyny</Label>
                      <div className="flex gap-2">
                        <Input value={matchDraft.homeLogo} onChange={e => setMatchDraft({...matchDraft, homeLogo: e.target.value})} placeholder="URL lub Prześlij" />
                        <div className="relative">
                          <Input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={(e) => handleFileUpload(e, (url) => setMatchDraft({...matchDraft, homeLogo: url}))}
                          />
                          <Button variant="outline" type="button">Wybierz</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="space-y-4">
                    <h3 className="font-display text-xl border-b pb-2">Gość</h3>
                    <div className="space-y-2">
                      <Label>Nazwa Drużyny</Label>
                      <Input value={matchDraft.awayTeam} onChange={e => setMatchDraft({...matchDraft, awayTeam: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Logo Drużyny</Label>
                      <div className="flex gap-2">
                        <Input value={matchDraft.awayLogo} onChange={e => setMatchDraft({...matchDraft, awayLogo: e.target.value})} placeholder="URL lub Prześlij" />
                        <div className="relative">
                          <Input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={(e) => handleFileUpload(e, (url) => setMatchDraft({...matchDraft, awayLogo: url}))}
                          />
                          <Button variant="outline" type="button">Wybierz</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-6 border-t">
                  <div className="space-y-2">
                    <Label>Data (np. 15 MAJA)</Label>
                    <Input value={matchDraft.date} onChange={e => setMatchDraft({...matchDraft, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Godzina i Miejsce</Label>
                    <Input value={matchDraft.time + " • " + matchDraft.location} onChange={e => {
                      const [time, ...locParts] = e.target.value.split(" • ");
                      setMatchDraft({...matchDraft, time: time || "", location: locParts.join(" • ") || ""});
                    }} placeholder="14:00 • Boisko Rzeszów" />
                  </div>
                  <div className="space-y-2">
                    <Label>Link do Biletów</Label>
                    <Input value={matchDraft.ticketLink} onChange={e => setMatchDraft({...matchDraft, ticketLink: e.target.value})} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
