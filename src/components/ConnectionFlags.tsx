import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link2, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getAllConnections, 
  addConnection, 
  deleteConnection, 
  incrementConnectionPractice,
  type ConnectionFlag 
} from '@/lib/storage-enhanced';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ConnectionFlagsProps {
  currentPage: number;
}

export function ConnectionFlags({ currentPage }: ConnectionFlagsProps) {
  const [connections, setConnections] = useState<ConnectionFlag[]>(
    getAllConnections().filter(c => c.fromPage === currentPage || c.toPage === currentPage)
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [targetPage, setTargetPage] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddConnection = () => {
    const target = parseInt(targetPage);
    if (isNaN(target) || target < 1 || target > 604) {
      alert('Please enter a valid page number (1-604)');
      return;
    }
    
    if (target === currentPage) {
      alert('Cannot create connection to the same page');
      return;
    }

    const connection: ConnectionFlag = {
      fromPage: currentPage,
      toPage: target,
      notes: notes.trim() || undefined,
      timesReviewed: 0,
    };
    
    addConnection(connection);
    setConnections(
      getAllConnections().filter(c => c.fromPage === currentPage || c.toPage === currentPage)
    );
    setShowAddDialog(false);
    setTargetPage('');
    setNotes('');
  };

  const handleDeleteConnection = (fromPage: number, toPage: number) => {
    deleteConnection(fromPage, toPage);
    setConnections(
      getAllConnections().filter(c => c.fromPage === currentPage || c.toPage === currentPage)
    );
  };

  const handlePracticeConnection = (fromPage: number, toPage: number) => {
    incrementConnectionPractice(fromPage, toPage);
    setConnections(
      getAllConnections().filter(c => c.fromPage === currentPage || c.toPage === currentPage)
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          Page Connections
        </h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" /> Add Connection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Flag Page Connection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Mark a connection from page {currentPage} to another page for practice.
              </p>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Target Page
                </label>
                <Input
                  type="number"
                  min={1}
                  max={604}
                  value={targetPage}
                  onChange={(e) => setTargetPage(e.target.value)}
                  placeholder="Enter page number..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Notes (Optional)
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Why is this connection important? Any memory aids?"
                  rows={3}
                />
              </div>

              <Button onClick={handleAddConnection} className="w-full">
                Create Connection
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <AnimatePresence>
        {connections.length > 0 ? (
          <div className="space-y-2">
            {connections.map((conn) => {
              const isOutgoing = conn.fromPage === currentPage;
              const otherPage = isOutgoing ? conn.toPage : conn.fromPage;
              
              return (
                <motion.div
                  key={`${conn.fromPage}-${conn.toPage}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          Page {currentPage} {isOutgoing ? '→' : '←'} Page {otherPage}
                        </span>
                        {conn.timesReviewed > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Reviewed {conn.timesReviewed}x
                          </Badge>
                        )}
                      </div>
                      
                      {conn.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{conn.notes}</p>
                      )}
                      
                      {conn.lastPracticed && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last practiced: {new Date(conn.lastPracticed).toLocaleDateString()}
                        </p>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePracticeConnection(conn.fromPage, conn.toPage)}
                        className="mt-2 h-7 text-xs"
                      >
                        Mark as Practiced
                      </Button>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteConnection(conn.fromPage, conn.toPage)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <Link2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
            No page connections yet
          </div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground">
        Flag transitions between pages that you find difficult to connect smoothly during recitation.
      </p>
    </div>
  );
}
