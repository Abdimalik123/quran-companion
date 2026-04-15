import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookMarked, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { getMutashaabihBookmarks, addMutashaabihBookmark, deleteMutashaabihBookmark, type MutashaabihBookmark } from '@/lib/storage-enhanced';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

// Simplified mutashaabihaat database - in production this would be comprehensive
const SIMILAR_VERSES_DB: Record<string, Array<{ surah: number; ayah: number; page: number; similarity: string }>> = {
  // Example: Surah Al-Baqarah verses with similar patterns
  '2:25': [
    { surah: 3, ayah: 15, page: 50, similarity: 'Gardens beneath which rivers flow' },
    { surah: 4, ayah: 57, page: 88, similarity: 'Gardens beneath which rivers flow' },
  ],
  '2:255': [
    { surah: 3, ayah: 2, page: 50, similarity: 'Allah - there is no deity except Him' },
  ],
  // Add more as needed...
};

interface MutashaabihFinderProps {
  currentSurah?: number;
  currentAyah?: number;
  currentPage?: number;
}

export function MutashaabihFinder({ currentSurah, currentAyah, currentPage }: MutashaabihFinderProps) {
  const [bookmarks, setBookmarks] = useState<MutashaabihBookmark[]>(getMutashaabihBookmarks());
  const [searchQuery, setSearchQuery] = useState('');
  const [similarVerses, setSimilarVerses] = useState<Array<{ surah: number; ayah: number; page: number; similarity: string }>>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [verse1Surah, setVerse1Surah] = useState(currentSurah || 1);
  const [verse1Ayah, setVerse1Ayah] = useState(currentAyah || 1);
  const [verse1Page, setVerse1Page] = useState(currentPage || 1);
  const [verse2Surah, setVerse2Surah] = useState(1);
  const [verse2Ayah, setVerse2Ayah] = useState(1);
  const [verse2Page, setVerse2Page] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (currentSurah && currentAyah) {
      const key = `${currentSurah}:${currentAyah}`;
      setSimilarVerses(SIMILAR_VERSES_DB[key] || []);
    }
  }, [currentSurah, currentAyah]);

  const handleSearch = () => {
    // Simple search in database
    const query = searchQuery.toLowerCase();
    const results: Array<{ surah: number; ayah: number; page: number; similarity: string }> = [];
    
    Object.entries(SIMILAR_VERSES_DB).forEach(([key, verses]) => {
      verses.forEach(v => {
        if (v.similarity.toLowerCase().includes(query)) {
          const [surah, ayah] = key.split(':').map(Number);
          results.push({ ...v, surah, ayah });
        }
      });
    });
    
    setSimilarVerses(results);
  };

  const handleAddBookmark = () => {
    const bookmark: MutashaabihBookmark = {
      verse1: { surah: verse1Surah, ayah: verse1Ayah, page: verse1Page },
      verse2: { surah: verse2Surah, ayah: verse2Ayah, page: verse2Page },
      notes: notes.trim() || undefined,
    };
    
    addMutashaabihBookmark(bookmark);
    setBookmarks(getMutashaabihBookmarks());
    setShowAddDialog(false);
    setNotes('');
  };

  const handleDeleteBookmark = (index: number) => {
    deleteMutashaabihBookmark(index);
    setBookmarks(getMutashaabihBookmarks());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <BookMarked className="h-4 w-4 text-muted-foreground" />
          Similar Verses (Mutashaabihaat)
        </h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <BookMarked className="h-4 w-4 mr-1" /> Bookmark Pair
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bookmark Similar Verses</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium text-foreground">Verse 1 - Surah</label>
                  <Input
                    type="number"
                    min={1}
                    max={114}
                    value={verse1Surah}
                    onChange={(e) => setVerse1Surah(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Ayah</label>
                  <Input
                    type="number"
                    min={1}
                    value={verse1Ayah}
                    onChange={(e) => setVerse1Ayah(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Page</label>
                  <Input
                    type="number"
                    min={1}
                    max={604}
                    value={verse1Page}
                    onChange={(e) => setVerse1Page(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="text-center text-xs text-muted-foreground">↕ Similar to ↕</div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium text-foreground">Verse 2 - Surah</label>
                  <Input
                    type="number"
                    min={1}
                    max={114}
                    value={verse2Surah}
                    onChange={(e) => setVerse2Surah(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Ayah</label>
                  <Input
                    type="number"
                    min={1}
                    value={verse2Ayah}
                    onChange={(e) => setVerse2Ayah(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Page</label>
                  <Input
                    type="number"
                    min={1}
                    max={604}
                    value={verse2Page}
                    onChange={(e) => setVerse2Page(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What makes these verses similar? Key differences?"
                  rows={3}
                />
              </div>

              <Button onClick={handleAddBookmark} className="w-full">
                Bookmark Pair
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Search for similar patterns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Auto-detected similar verses */}
      {similarVerses.length > 0 && (
        <div className="pile-card p-4 space-y-2">
          <h4 className="text-sm font-medium text-foreground mb-2">Found Similar Verses</h4>
          {similarVerses.map((verse, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-muted text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">Surah {verse.surah}, Ayah {verse.ayah} (Page {verse.page})</span>
                <Badge variant="outline" className="text-xs">Similar</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{verse.similarity}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bookmarked pairs */}
      {bookmarks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Your Bookmarks</h4>
          {bookmarks.map((bookmark, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pile-card p-3 flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {bookmark.verse1.surah}:{bookmark.verse1.ayah} (p.{bookmark.verse1.page})
                  </Badge>
                  <span className="text-xs text-muted-foreground">↔</span>
                  <Badge variant="outline" className="text-xs">
                    {bookmark.verse2.surah}:{bookmark.verse2.ayah} (p.{bookmark.verse2.page})
                  </Badge>
                </div>
                {bookmark.notes && (
                  <p className="text-xs text-muted-foreground mt-1">{bookmark.notes}</p>
                )}
              </div>
              <button
                onClick={() => handleDeleteBookmark(idx)}
                className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {similarVerses.length === 0 && bookmarks.length === 0 && (
        <div className="text-center py-6 text-muted-foreground text-sm">
          <BookMarked className="h-8 w-8 mx-auto mb-2 opacity-30" />
          No similar verses found. Search or bookmark pairs manually.
        </div>
      )}
    </div>
  );
}
