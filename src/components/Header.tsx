import React, { useState } from 'react';
import type { Player } from '../types/game';
import { 
  Terminal, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  History 
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  currentRound: number;
  activePlayer: Player;
  onReset: () => void;
  onOpenRules: () => void;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRound,
  activePlayer,
  onReset,
  onOpenRules,
  onOpenHistory,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());

  const handleToggleMute = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  return (
    <header className="w-full border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                SPECTRUM
              </span>
              <span className="text-zinc-600 font-mono text-xs">/</span>
              <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-widest hidden sm:inline">
                Tech Trivia Challenge
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60 hidden md:inline">
                4×4 HYBRID
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
              <span>Goal: <span className="text-zinc-300 font-semibold">100 PTS</span></span>
              <span>•</span>
              <span>Start: <span className="text-zinc-300 font-semibold">100 CR</span></span>
            </div>
          </div>
        </div>

        {/* Center: Turn & Round Status Pill */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
            <span>ROUND</span>
            <span className="font-bold text-white bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
              {currentRound}
            </span>
          </div>

          <span className="w-1 h-1 rounded-full bg-zinc-700" />

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 font-mono">TURN:</span>
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <span
                style={{ backgroundColor: activePlayer.color.hex }}
                className="w-2 h-2 rounded-full animate-ping"
              />
              <span style={{ color: activePlayer.color.hex }}>{activePlayer.name}</span>
            </div>
            <span className="text-zinc-400 font-mono text-[11px]">
              ({activePlayer.credits} CR left)
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Rules Button */}
          <button
            onClick={onOpenRules}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            title="Game Rules & Tie Breaker Mechanics"
          >
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          {/* Activity Log Button */}
          <button
            onClick={onOpenHistory}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            title="Action Audit Log"
          >
            <History className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">Log</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Reset / New Game */}
          <button
            onClick={onReset}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            title="Reset Game State"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
