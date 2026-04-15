import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  page: number;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  reciter?: string;
}

type RepeatMode = 'none' | 'ayah' | 'page';

export function AudioPlayer({ page, surahNumber, ayahStart, ayahEnd, reciter = 'ar.alafasy' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(ayahStart);
  const [speed, setSpeed] = useState(1.0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Build audio URL for current ayah
  const audioUrl = `https://cdn.islamic.network/quran/audio/128/${reciter}/${surahNumber}/${currentAyah}.mp3`;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentAyah < ayahEnd) {
      setCurrentAyah(currentAyah + 1);
      setProgress(0);
      if (isPlaying && audioRef.current) {
        audioRef.current.load();
        audioRef.current.play();
      }
    }
  };

  const handlePrevious = () => {
    if (currentAyah > ayahStart) {
      setCurrentAyah(currentAyah - 1);
      setProgress(0);
      if (isPlaying && audioRef.current) {
        audioRef.current.load();
        audioRef.current.play();
      }
    }
  };

  const handleEnded = () => {
    if (repeatMode === 'ayah') {
      // Repeat current ayah
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === 'page') {
      // Continue to next ayah, or loop back to start
      if (currentAyah < ayahEnd) {
        handleNext();
      } else {
        setCurrentAyah(ayahStart);
        setProgress(0);
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play();
        }
      }
    } else {
      // No repeat: just move to next or stop
      if (currentAyah < ayahEnd) {
        handleNext();
      } else {
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percent || 0);
    }
  };

  const toggleRepeatMode = () => {
    const modes: RepeatMode[] = ['none', 'ayah', 'page'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5];
  const cycleSpeed = () => {
    const currentIndex = speedOptions.indexOf(speed);
    setSpeed(speedOptions[(currentIndex + 1) % speedOptions.length]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pile-card p-4 space-y-3"
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Surah {surahNumber}, Ayah {currentAyah}</p>
          <p className="text-xs text-muted-foreground">Page {page} • {ayahEnd - ayahStart + 1} ayahs</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleRepeatMode}
            className={`p-2 rounded-lg transition-colors ${
              repeatMode !== 'none' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'
            }`}
            title={repeatMode === 'ayah' ? 'Repeat ayah' : repeatMode === 'page' ? 'Repeat page' : 'No repeat'}
          >
            {repeatMode === 'ayah' ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
          </button>
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 rounded-lg text-xs font-medium bg-muted text-foreground hover:bg-muted-foreground/20"
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          disabled={currentAyah <= ayahStart}
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        
        <Button
          size="icon"
          onClick={handlePlayPause}
          className="h-12 w-12"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={currentAyah >= ayahEnd}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
}
