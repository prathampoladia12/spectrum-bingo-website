import React, { useEffect, useRef } from 'react';
import type { Player } from '../types/game';
import { Trophy, RotateCcw, Award } from 'lucide-react';
import { fireLocalizedConfetti } from '../utils/confetti';

interface GameOverModalProps {
  isOpen: boolean;
  winnerId: number | null;
  players: Player[];
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winnerId,
  players,
  onPlayAgain,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fireLocalizedConfetti(modalRef.current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const winner = players.find(p => p.id === winnerId) || players[0];
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
      <div 
        ref={modalRef}
        className="w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Victory Header */}
        <div className="p-8 text-center bg-gradient-to-b from-zinc-850 to-zinc-900 border-b border-zinc-800">
          <div className="inline-flex p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 mb-4 animate-bounce">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase mb-1">
            Tournament Champion
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            {winner.name} Wins!
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Achieved {winner.score} Points with {winner.credits} Credits remaining!
          </p>
        </div>

        {/* Final Standings */}
        <div className="p-6 space-y-3">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
            Final Standings
          </div>

          <div className="space-y-2">
            {sortedPlayers.map((player, idx) => {
              const isWinner = player.id === winner.id;
              return (
                <div
                  key={player.id}
                  className={`
                    p-3.5 rounded-xl border flex items-center justify-between transition-all
                    ${isWinner 
                      ? 'bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/20' 
                      : 'bg-zinc-950/40 border-zinc-850'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 font-mono text-xs text-zinc-400 font-bold">
                      #{idx + 1}
                    </span>
                    <div
                      style={{ backgroundColor: `${player.color.hex}22`, borderColor: `${player.color.hex}88` }}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center font-mono font-bold text-xs"
                    >
                      <span style={{ color: player.color.hex }}>{player.avatar}</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                        <span>{player.name}</span>
                        {isWinner && <Award className="w-3.5 h-3.5 text-amber-400" />}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {player.correctCount} correct • {player.wrongCount} missed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="font-mono text-sm font-bold text-white">{player.score} PTS</div>
                      <div className="font-mono text-[11px] text-zinc-400">{player.credits} CR left</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-center">
          <button
            onClick={onPlayAgain}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white text-zinc-950 hover:bg-zinc-200 transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play New Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};
