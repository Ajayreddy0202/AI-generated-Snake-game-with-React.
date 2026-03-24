import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-pixel selection:bg-fuchsia-500 selection:text-black flex flex-col relative overflow-hidden">
      {/* Glitch/Static Overlays */}
      <div className="static-noise" />
      <div className="scanlines" />

      {/* Header */}
      <header className="relative z-10 w-full p-4 flex flex-col items-center justify-center border-b-4 border-fuchsia-500 bg-black">
        <div className="flex items-center gap-4 screen-tear">
          <Terminal className="text-fuchsia-500 w-12 h-12" />
          <h1 
            className="text-6xl font-black uppercase glitch-text" 
            data-text="SYS.SNAKE_PROTOCOL"
          >
            SYS.SNAKE_PROTOCOL
          </h1>
        </div>
        <p className="text-cyan-400 text-2xl mt-2 uppercase tracking-widest">
          STATUS: <span className="text-fuchsia-500 animate-pulse">ACTIVE_ANOMALY</span>
        </p>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 w-full max-w-5xl mx-auto gap-8">
        <div className="w-full flex-1 flex items-center justify-center min-h-[400px]">
          <SnakeGame />
        </div>
        
        <div className="w-full mt-auto pb-6">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}

