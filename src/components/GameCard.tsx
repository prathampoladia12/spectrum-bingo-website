import React from 'react';
import type { CardState, Player, Category } from '../types/game';
import { 
  GitBranch, 
  BrainCircuit, 
  Globe, 
  Terminal, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Coins 
} from 'lucide-react';

interface GameCardProps {
  card: CardState;
  activePlayer: Player;
  onSelect: (cardId: string) => void;
  allPlayers: Player[];
}

const CATEGORY_CONFIG: Record<Category, { 
  icon: React.ComponentType<{ className?: string }>; 
  subcode: string; 
  accentColor: string;
  badgeBg: string;
}> = {
  'DSA': {
    icon: GitBranch,
    subcode: 'SYS_01 // ALGO',
    accentColor: 'text-sky-400',
    badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  },
  'AI/ML': {
    icon: BrainCircuit,
    subcode: 'SYS_02 // NEURAL',
    accentColor: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  'WSD': {
    icon: Globe,
    subcode: 'SYS_03 // WEB',
    accentColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  'PROGRAMMING': {
    icon: Terminal,
    subcode: 'SYS_04 // SYNTAX',
    accentColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
};

export const GameCard: React.FC<GameCardProps> = ({
  card,
  activePlayer,
  onSelect,
  allPlayers,
}) => {
  const config = CATEGORY_CONFIG[card.category];
  const IconComponent = config.icon;
  const canAfford = activePlayer.credits >= card.cost;
  const isMasked = card.status === 'masked';
  const isAnsweredCorrect = card.status === 'answered_correct';

  const answeringPlayer = card.answeredByPlayerId
    ? allPlayers.find(p => p.id === card.answeredByPlayerId)
    : null;

  const handleClick = () => {
    if (isMasked && canAfford) {
      onSelect(card.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative group h-44 sm:h-48 md:h-52 rounded-xl p-4 flex flex-col justify-between 
        transition-all duration-300 select-none overflow-hidden
        border backdrop-blur-md
        ${isMasked 
          ? canAfford 
            ? 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-600 hover:bg-zinc-800/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 cursor-pointer' 
            : 'bg-zinc-950/40 border-zinc-800/40 opacity-70 cursor-not-allowed'
          : isAnsweredCorrect
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-zinc-900/30 border-rose-500/20 opacity-85'
        }
      `}
    >
      {/* Background ambient gradient glow */}
      {isMasked && canAfford && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      )}

      {/* Shimmer sweep animation when masked and affordable */}
      {isMasked && canAfford && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none" />
      )}

      {/* Top Header: Category Tag & Monospace Subcode */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <span className={`p-1 rounded-md border ${config.badgeBg}`}>
            <IconComponent className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] font-mono font-medium tracking-wider text-zinc-400 uppercase">
            {card.category}
          </span>
        </div>
        <span className="text-[9px] font-mono text-zinc-400 tracking-tight">
          {config.subcode}
        </span>
      </div>

      {/* Center: Hero Points Value or Answered State */}
      <div className="my-auto text-center z-10">
        {isMasked ? (
          <div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white group-hover:scale-105 transition-transform duration-200">
              {card.points}
            </div>
            <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">
              POINTS
            </div>
          </div>
        ) : isAnsweredCorrect ? (
          <div className="flex flex-col items-center justify-center animate-fade-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-1" />
            <span className="text-lg font-bold text-emerald-300">+{card.points} PTS</span>
            {answeringPlayer && (
              <span className="text-[11px] font-medium text-zinc-400 mt-0.5">
                Claimed by <span style={{ color: answeringPlayer.color.hex }} className="font-semibold">{answeringPlayer.name}</span>
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center animate-fade-in">
            <XCircle className="w-7 h-7 text-rose-400/80 mb-1" />
            <span className="text-xs font-mono font-bold tracking-wider text-rose-300 uppercase">MISSED</span>
            {answeringPlayer && (
              <span className="text-[10px] font-medium text-zinc-400 mt-0.5">
                by {answeringPlayer.name}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar: Merged Cost Badge or Status Banner */}
      <div className="z-10 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
        {isMasked ? (
          canAfford ? (
            <div className="w-full flex items-center justify-between text-zinc-400 group-hover:text-zinc-200 transition-colors">
              <span className="flex items-center gap-1 text-[11px] font-medium">
                <Coins className="w-3.5 h-3.5 text-amber-400/90" />
                <span>Risk: <span className="font-semibold text-zinc-200">-{card.cost} CR</span> <span className="text-[9px] text-zinc-400">(on miss)</span></span>
              </span>
              <span className="text-[10px] font-mono uppercase bg-zinc-800/80 px-2 py-0.5 rounded text-zinc-300 border border-zinc-700/50">
                Reveal
              </span>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between text-rose-400/80">
              <span className="flex items-center gap-1 text-[11px]">
                <Lock className="w-3.5 h-3.5" />
                <span>Risk: {card.cost} CR</span>
              </span>
              <span className="text-[9px] font-mono uppercase bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20">
                Needs {card.cost} CR
              </span>
            </div>
          )
        ) : (
          <div className="w-full flex items-center justify-center text-[11px] font-mono text-zinc-400">
            {isAnsweredCorrect ? 'SOLVED' : 'COMPLETED'}
          </div>
        )}
      </div>
    </div>
  );
};
