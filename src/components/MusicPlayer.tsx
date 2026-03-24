import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "AUDIO_STREAM_01",
    artist: "SYS.SYNTH",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "FREQ_MODULATION",
    artist: "SYS.SYNTH",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "NEURAL_BEATS",
    artist: "SYS.SYNTH",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    playNext();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black border-4 border-cyan-400 p-4 shadow-[8px_8px_0px_#FF00FF] font-pixel relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-500 animate-pulse" />
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        preload="auto"
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-cyan-400 font-bold text-2xl tracking-wider drop-shadow-[2px_2px_0px_#FF00FF]">
            {currentTrack.title}
          </span>
          <span className="text-fuchsia-500 text-lg tracking-wide uppercase">
            {currentTrack.artist}
          </span>
        </div>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-cyan-400 hover:text-fuchsia-500 transition-colors"
        >
          {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
        </button>
      </div>

      <div className="flex items-center justify-center gap-8">
        <button 
          onClick={playPrev}
          className="p-2 text-fuchsia-500 hover:text-cyan-400 transition-colors"
        >
          <SkipBack size={32} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="p-4 bg-black border-4 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors shadow-[4px_4px_0px_#FF00FF]"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        
        <button 
          onClick={playNext}
          className="p-2 text-fuchsia-500 hover:text-cyan-400 transition-colors"
        >
          <SkipForward size={32} />
        </button>
      </div>
    </div>
  );
}
