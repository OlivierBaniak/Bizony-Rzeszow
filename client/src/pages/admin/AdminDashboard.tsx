import { useApp, NewsItem } from "@/lib/store";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Plus, Trash, Save, LayoutDashboard, Newspaper, Users, Trophy, Image as ImageIcon, FolderOpen, Info, ShieldCheck, ShieldAlert, QrCode, ScrollText, Lock } from "lucide-react";

export default function AdminDashboard() {
  const { 
    isAdmin, 
    userRole,
    currentUser,
    users, addUser, deleteUser, updateUserRole,
    loginLogs,
    changePassword,
    toggle2FA,
    news, addNews, deleteNews, updateNews,
    players, addPlayer, deletePlayer, updatePlayer,
    results, addResult, deleteResult, updateResult,
    standings, updateStandings,
    leagueMetadata, updateLeagueMetadata,
    galleryFolders, addGalleryFolder, deleteGalleryFolder, addImageToFolder, deleteImageFromFolder,
    clubHistory, updateClubHistory,
    nextMatch, updateNextMatch,
    contactDetails, updateContactDetails
  } = useApp();
  const [, setLocation] = useLocation();

  // Form States
  const [newsForm, setNewsForm] = useState({ id: "", title: "", excerpt: "", content: "", image: "" });
  const [playerForm, setPlayerForm] = useState({ id: "", name: "", number: "", position: "", image: "" });
  const [resultForm, setResultForm] = useState({ id: "", date: "", location: "", opponent: "", competition: "", result: "W", pointsScored: "", pointsConceded: "" });
  const [userForm, setUserForm] = useState({ email: "", role: "editor" as "admin" | "editor", password: "" });
  const [folderForm, setFolderForm] = useState({ title: "", description: "", mainImage: "" });
  const [imageForm, setImageForm] = useState({ url: "", description: "" });
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  
  // Local states for metadata and history
  const [metaDraft, setMetaDraft] = useState(leagueMetadata);
  const [standingsDraft, setStandingsDraft] = useState(standings);
  const [historyDraft, setHistoryDraft] = useState(clubHistory);
  const [matchDraft, setMatchDraft] = useState(nextMatch);
  const [contactDraft, setContactDraft] = useState(contactDetails);

  if (!isAdmin) {
    setLocation("/login");
    return null;
  }

  const handleChangePassword = () => {
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Oba pola są wymagane" });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Hasła się nie zgadzają" });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "Hasło musi mieć co najmniej 8 znaków" });
      return;
    }
    changePassword(passwordForm.newPassword);
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setPasswordMessage({ type: "success", text: "Hasło zmieniono pomyślnie!" });
    setTimeout(() => setPasswordMessage(null), 3000);
  };

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
    if (newsForm.id) {
      updateNews(newsForm as NewsItem);
      setNewsForm({ id: "", title: "", excerpt: "", content: "", image: "" });
    } else {
      addNews({ ...newsForm, image: newsForm.image || "https://placehold.co/600x400" });
      setNewsForm({ id: "", title: "", excerpt: "", content: "", image: "" });
    }
  };

  const handleEditNews = (item: any) => {
    setNewsForm(item);
  };

  const handleAddPlayer = () => {
    if (!playerForm.name) return;
    
    if (playerForm.id) {
      updatePlayer({
        ...playerForm,
        number: parseInt(playerForm.number as any) || 0
      });
      setPlayerForm({ id: "", name: "", number: "", position: "", image: "" });
    } else {
      addPlayer({ 
        name: playerForm.name,
        number: parseInt(playerForm.number as any) || 0,
        position: playerForm.position,
        image: playerForm.image || "https://placehold.co/400x600" 
      });
      setPlayerForm({ id: "", name: "", number: "", position: "", image: "" });
    }
  };

  const handleEditPlayer = (player: any) => {
    setPlayerForm({
      id: player.id,
      name: player.name,
      number: player.number.toString(),
      position: player.position,
      image: player.image
    });
  };

  const handleAddResult = () => {
    if (!resultForm.date || !resultForm.opponent) return;
    const itemData = {
      date: resultForm.date,
      location: resultForm.location,
      opponent: resultForm.opponent,
      competition: resultForm.competition,
      result: resultForm.result as "W" | "L",
      pointsScored: parseInt(resultForm.pointsScored) || 0,
      pointsConceded: parseInt(resultForm.pointsConceded) || 0,
    };

    if (resultForm.id) {
      updateResult({ ...itemData, id: resultForm.id });
    } else {
      addResult(itemData);
    }
    setResultForm({ id: "", date: "", location: "", opponent: "", competition: "", result: "W", pointsScored: "", pointsConceded: "" });
  };

  const handleEditResult = (item: any) => {
    setResultForm({
      id: item.id,
      date: item.date,
      location: item.location,
      opponent: item.opponent,
      competition: item.competition,
      result: item.result,
      pointsScored: item.pointsScored.toString(),
      pointsConceded: item.pointsConceded.toString()
    });
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

  const handleSaveContact = () => {
    updateContactDetails(contactDraft);
  };

  const handleAddUser = () => {
    if (!userForm.email) return;
    addUser(userForm);
    setUserForm({ email: "", role: "editor" });
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
            <TabsTrigger value="results" className="px-6 py-2 uppercase font-display tracking-wider">
              Wyniki
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
            <TabsTrigger value="contact" className="px-6 py-2 uppercase font-display tracking-wider">
              Kontakt
            </TabsTrigger>
            <TabsTrigger value="settings" className="px-6 py-2 uppercase font-display tracking-wider">
              Ustawienia
            </TabsTrigger>
            {userRole === "admin" && (
              <>
                <TabsTrigger value="users" className="px-6 py-2 uppercase font-display tracking-wider">
                  Użytkownicy
                </TabsTrigger>
                <TabsTrigger value="logs" className="px-6 py-2 uppercase font-display tracking-wider">
                  Logi
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* NEWS TAB */}
          <TabsContent value="news" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle>{newsForm.id ? 'Edytuj Artykuł' : 'Dodaj Artykuł'}</CardTitle>
                </CardHeader>
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
                    <div className="bg-white rounded-md border min-h-[200px] overflow-hidden">
                      <ReactQuill 
                        theme="snow" 
                        value={newsForm.content} 
                        onChange={(content) => setNewsForm({ ...newsForm, content })}
                        className="h-48 mb-12"
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            ['link', 'clean']
                          ],
                        }}
                      />
                    </div>
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
                  <div className="flex gap-2">
                    <Button onClick={handleAddNews} className="flex-1 bg-primary hover:bg-primary/90 text-white">
                      {newsForm.id ? <><Save className="w-4 h-4 mr-2" /> Zapisz</> : <><Plus className="w-4 h-4 mr-2" /> Opublikuj</>}
                    </Button>
                    {newsForm.id && (
                      <Button variant="outline" onClick={() => setNewsForm({ id: "", title: "", excerpt: "", content: "", image: "" })}>
                        Anuluj
                      </Button>
                    )}
                  </div>
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
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditNews(item)}>
                        <LayoutDashboard className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => deleteNews(item.id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TEAM TAB */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 h-fit">
                <CardHeader><CardTitle>{playerForm.id ? 'Edytuj Zawodnika' : 'Dodaj Zawodnika'}</CardTitle></CardHeader>
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
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={playerForm.position} 
                        onChange={e => setPlayerForm({...playerForm, position: e.target.value})}
                      >
                        <option value="">Wybierz pozycję</option>
                        <option value="Miotacz">Miotacz</option>
                        <option value="Łapacz">Łapacz</option>
                        <option value="Gracz z pola">Gracz z pola</option>
                        <option value="Zapolowy">Zapolowy</option>
                      </select>
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
                  <div className="flex gap-2">
                    <Button onClick={handleAddPlayer} className="flex-1 bg-primary">
                      {playerForm.id ? 'Zapisz' : 'Dodaj'}
                    </Button>
                    {playerForm.id && (
                      <Button variant="outline" onClick={() => setPlayerForm({ id: "", name: "", number: "", position: "", image: "" })}>
                        Anuluj
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2 grid grid-cols-1 gap-4">
                {players.map(player => (
                  <Card key={player.id} className="flex items-center p-4 gap-4">
                    <img src={player.image} className="w-16 h-16 object-cover rounded-full bg-muted" />
                    <div className="flex-grow">
                      <h3 className="font-bold">{player.name}</h3>
                      <p className="text-sm text-muted-foreground">#{player.number} • {player.position}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditPlayer(player)}>
                        <LayoutDashboard className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => deletePlayer(player.id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* RESULTS TAB */}
          <TabsContent value="results" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 h-fit">
                <CardHeader><CardTitle>{resultForm.id ? 'Edytuj Wynik' : 'Dodaj Wynik'}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Termin (RRRR.MM.DD)</Label>
                      <Input value={resultForm.date} onChange={e => setResultForm({...resultForm, date: e.target.value})} placeholder="2025.04.13" />
                    </div>
                    <div className="space-y-2">
                      <Label>Miejsce</Label>
                      <Input value={resultForm.location} onChange={e => setResultForm({...resultForm, location: e.target.value})} placeholder="Rybnik" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Przeciwnik</Label>
                    <Input value={resultForm.opponent} onChange={e => setResultForm({...resultForm, opponent: e.target.value})} placeholder="Wizards Opole" />
                  </div>
                  <div className="space-y-2">
                    <Label>Rozgrywki</Label>
                    <Input value={resultForm.competition} onChange={e => setResultForm({...resultForm, competition: e.target.value})} placeholder="BLB" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Wynik</Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={resultForm.result} 
                        onChange={e => setResultForm({...resultForm, result: e.target.value})}
                      >
                        <option value="W">W (Win)</option>
                        <option value="L">L (Loss)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Pkt +</Label>
                      <Input type="number" value={resultForm.pointsScored} onChange={e => setResultForm({...resultForm, pointsScored: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Pkt -</Label>
                      <Input type="number" value={resultForm.pointsConceded} onChange={e => setResultForm({...resultForm, pointsConceded: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddResult} className="flex-1 bg-primary">
                      {resultForm.id ? 'Zapisz' : 'Dodaj'}
                    </Button>
                    {resultForm.id && (
                      <Button variant="outline" onClick={() => setResultForm({ id: "", date: "", location: "", opponent: "", competition: "", result: "W", pointsScored: "", pointsConceded: "" })}>
                        Anuluj
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2 space-y-4">
                {results.map(item => (
                  <Card key={item.id} className="flex items-center p-4 gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${item.result === 'W' ? 'bg-green-600' : 'bg-red-600'}`}>
                      {item.result}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{item.opponent}</h3>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.date} • {item.location} • {item.competition}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-bold text-lg">{item.pointsScored} : {item.pointsConceded}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditResult(item)}>
                        <LayoutDashboard className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => deleteResult(item.id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTACT TAB */}
          <TabsContent value="contact">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center border-b">
                <CardTitle>Dane Kontaktowe</CardTitle>
                <Button onClick={handleSaveContact} className="bg-green-600 hover:bg-green-700 text-white font-display uppercase tracking-wider">
                  <Save className="w-4 h-4 mr-2" /> Zapisz Kontakt
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Adres</Label>
                    <Input value={contactDraft.address} onChange={e => setContactDraft({...contactDraft, address: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={contactDraft.email} onChange={e => setContactDraft({...contactDraft, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    <Input value={contactDraft.phone} onChange={e => setContactDraft({...contactDraft, phone: e.target.value})} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                  <div className="space-y-2">
                    <Label>Facebook URL</Label>
                    <Input value={contactDraft.facebook} onChange={e => setContactDraft({...contactDraft, facebook: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram URL</Label>
                    <Input value={contactDraft.instagram} onChange={e => setContactDraft({...contactDraft, instagram: e.target.value})} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Bezpieczeństwo Konta (2FA)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      Uwierzytelnianie dwuskładnikowe (2FA)
                      {currentUser?.is2FAEnabled ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Aktywne
                        </span>
                      ) : (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Nieaktywne
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Dodaj dodatkową warstwę bezpieczeństwa do swojego konta, wymagając kodu z aplikacji uwierzytelniającej przy każdym logowaniu.
                    </p>
                  </div>
                  <Button 
                    onClick={toggle2FA} 
                    variant={currentUser?.is2FAEnabled ? "destructive" : "default"}
                    className="font-display uppercase tracking-wider"
                  >
                    {currentUser?.is2FAEnabled ? "Wyłącz 2FA" : "Skonfiguruj 2FA"}
                  </Button>
                </div>

                {currentUser?.is2FAEnabled && !currentUser?.twoFASecret && (
                   <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
                     Twoje konto jest chronione przez 2FA.
                   </div>
                )}

                {currentUser?.is2FAEnabled && currentUser?.twoFASecret && (
                  <div className="grid md:grid-cols-2 gap-8 p-6 border rounded-lg animate-in fade-in slide-in-from-top-4">
                    <div className="space-y-4">
                      <h4 className="font-bold uppercase text-sm tracking-wider flex items-center gap-2">
                        <QrCode className="w-4 h-4" /> Krok 1: Zeskanuj kod QR
                      </h4>
                      <div className="bg-white p-4 border rounded aspect-square w-48 flex items-center justify-center shadow-inner mx-auto md:mx-0 relative">
                         <div className="w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px] opacity-20" />
                         <span className="absolute font-mono text-[10px] text-muted-foreground uppercase text-center px-2">Mock QR Code for {currentUser.email}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Zeskanuj ten kod w swojej aplikacji (np. Google Authenticator lub Authy).
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold uppercase text-sm tracking-wider">Krok 2: Wpisz klucz ręcznie</h4>
                      <div className="bg-muted p-4 rounded font-mono text-xl tracking-widest text-center select-all border border-dashed">
                        {currentUser.twoFASecret}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Jeśli nie możesz zeskanować kodu, wpisz powyższy klucz w aplikacji.
                      </p>
                      <div className="pt-4 border-t space-y-2">
                        <Label className="text-xs uppercase tracking-tighter">Kod Weryfikacyjny</Label>
                        <div className="flex gap-2">
                          <Input placeholder="000 000" className="text-center font-mono text-lg tracking-widest" maxLength={6} />
                          <Button className="bg-primary px-8">Weryfikuj</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Zmiana Hasła
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {passwordMessage && (
                  <div className={`p-3 rounded-md text-sm ${
                    passwordMessage.type === "success" 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {passwordMessage.text}
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Nowe Hasło</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Potwierdź Hasło</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  />
                </div>
                <Button onClick={handleChangePassword} className="w-full bg-primary">
                  Zmień Hasło
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {userRole === "admin" && (
            <TabsContent value="users" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 h-fit">
                  <CardHeader><CardTitle>Dodaj Użytkownika</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input 
                        value={userForm.email} 
                        onChange={e => setUserForm({...userForm, email: e.target.value})} 
                        placeholder="user@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rola</Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={userForm.role} 
                        onChange={e => setUserForm({...userForm, role: e.target.value as "admin" | "editor"})}
                      >
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Hasło startowe</Label>
                      <Input 
                        type="password"
                        value={userForm.password} 
                        onChange={e => setUserForm({...userForm, password: e.target.value})} 
                        placeholder="••••••••"
                      />
                    </div>
                    <Button onClick={handleAddUser} className="w-full bg-primary">Dodaj</Button>
                  </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-4">
                  {users.map(user => (
                    <Card key={user.id} className="flex items-center p-4 gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold">{user.email}</h3>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">{user.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <select 
                          className="h-8 rounded border text-xs px-2"
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value as "admin" | "editor")}
                        >
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                        <Button 
                          variant="destructive" size="icon" 
                          onClick={() => deleteUser(user.id)}
                          disabled={users.length <= 1}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}

          {userRole === "admin" && (
            <TabsContent value="logs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ScrollText className="w-5 h-5 text-primary" />
                    Logi Logowania
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted text-muted-foreground font-display uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold">Użytkownik</th>
                          <th className="px-4 py-3 text-left font-bold">Data i Godzina</th>
                          <th className="px-4 py-3 text-left font-bold">Adres IP</th>
                          <th className="px-4 py-3 text-center font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {loginLogs.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground italic">
                              Brak zarejestrowanych prób logowania.
                            </td>
                          </tr>
                        ) : (
                          loginLogs.map(log => (
                            <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                              <td className="px-4 py-3 font-medium">{log.email}</td>
                              <td className="px-4 py-3 text-muted-foreground">{log.timestamp}</td>
                              <td className="px-4 py-3 font-mono text-xs">{log.ip}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {log.status === 'success' ? 'Sukces' : 'Błąd'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

        </Tabs>
      </div>
    </div>
  );
}
