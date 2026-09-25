import React, { useRef, useEffect } from 'react';
import type { Player } from '../types/game';
import { Coins, Trophy } from 'lucide-react';
import { fireLocalizedConfetti } from '../utils/confetti';

interface PlayerStatusProps {
  player: Player;
  isActive: boolean;
  onSelectPlayer?: (index: number) => void;
  index: number;
  highlightScored?: boolean;
}

export const PlayerStatus: React.FC<PlayerStatusProps> = ({
  player,
  isActive,
  onSelectPlayer,
  index,
  highlightScored = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prevScoreRef = useRef(player.score);

  // Trigger targeted micro-confetti on score increase
  useEffect(() => {
    if (player.score > prevScoreRef.current) {
      fireLocalizedConfetti(cardRef.current, [player.color.hex, '#10b981', '#ffffff']);
    }
    prevScoreRef.current = player.score;
  }, [player.score, player.color.hex]);

  const scorePercentage = Math.min(100, Math.round((player.score / 100) * 100));
  const creditPercentage = Math.min(100, Math.max(0, player.credits));

  return (
    <div
      ref={cardRef}
      onClick={() => onSelectPlayer && onSelectPlayer(index)}
      className={`
        relative rounded-xl p-4 transition-all duration-300 border backdrop-blur-md select-none
        ${isActive
          ? 'bg-zinc-900/90 border-zinc-500/80 shadow-lg shadow-black/40 ring-1 ring-white/10'
          : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/60'
        }
        ${highlightScored ? 'animate-pulse ring-2 ring-emerald-500/80' : ''}
      `}
    >
      {/* Active turn badge */}
      {isActive && (
        <div className="absolute -top-2.5 right-4 z-20">
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-zinc-950 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Turn Active
          </span>
        </div>
      )}

      {/* Header: Avatar, Name & Turn Chip */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            style={{ backgroundColor: `${player.color.hex}22`, borderColor: `${player.color.hex}88` }}
            className="w-8 h-8 rounded-lg border flex items-center justify-center font-mono font-bold text-xs"
          >
            <span style={{ color: player.color.hex }}>{player.avatar}</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
              <span>{player.name}</span>
              {player.score >= 100 && (
                <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />
              )}
            </div>
            <div className="text-[11px] font-mono text-zinc-400">
              {player.correctCount} correct • {player.wrongCount} missed
            </div>
          </div>
        </div>

        {/* Small rank / spend readout */}
        <div className="text-right">
          <span className="text-[10px] font-mono text-zinc-400 uppercase block">Spent</span>
          <span className="text-xs font-mono font-medium text-zinc-400">{player.totalSpent} CR</span>
        </div>
      </div>

      {/* Score Progress (Goal: 100 PTS) */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-mono text-[11px] flex items-center gap-1">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Score (Win: 100)</span>
          </span>
          <span className="font-mono font-bold text-white tracking-tight">
            {player.score} <span className="text-zinc-400 font-normal">/ 100</span>
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-zinc-800/80 overflow-hidden p-0.5 border border-zinc-700/40">
          <div
            style={{ 
              width: `${scorePercentage}%`,
              backgroundColor: player.score >= 100 ? '#10b981' : player.color.hex 
            }}
            className="h-full rounded-full transition-all duration-500 shadow-sm"
          />
        </div>
      </div>

      {/* Credits Readout */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-mono text-[11px] flex items-center gap-1">
            <Coins className="w-3 h-3 text-amber-400/80" />
            <span>Credits</span>
          </span>
          <span className={`font-mono font-semibold ${player.credits < 20 ? 'text-rose-400' : 'text-zinc-200'}`}>
            {player.credits} CR
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-zinc-800/80 overflow-hidden border border-zinc-700/30">
          <div
            style={{ width: `${creditPercentage}%` }}
            className={`h-full rounded-full transition-all duration-300 ${
              player.credits < 20 ? 'bg-rose-500' : 'bg-zinc-400'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
