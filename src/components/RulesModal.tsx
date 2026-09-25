import React from 'react';
import { X, BookOpen, Coins, Trophy, Swords, Zap, CheckCircle2 } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Tech Trivia Challenge Rules
              </h3>
              <div className="text-[11px] font-mono text-zinc-400">
                Official 4×4 Jeopardy-Bingo Hybrid Rules & Economy
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-zinc-300">
          {/* Section 1: Overview */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-zinc-100 font-semibold text-xs uppercase tracking-wider font-mono">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Core Objective & Win Condition</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              4 players take turns selecting questions on an interactive 4×4 grid. Categories span Data Structures & Algorithms, Artificial Intelligence & Machine Learning, Web Systems & Dev, and Core Programming. The first player to reach <strong>100 Points</strong> wins the match.
            </p>
          </div>

          {/* Section 2: Economy & Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-zinc-100 font-semibold text-xs uppercase tracking-wider font-mono">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Credit Economy</span>
              </div>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>Every player starts with <strong>100 Credits</strong>.</li>
                <li>Attempting a question costs credits equal to its point value (20, 30, 40, or 50 CR).</li>
                <li>Credits are <strong>subtracted for every attempt</strong> regardless of result.</li>
                <li>A player who reaches <strong>10 or fewer Credits</strong> is done and will not receive further turns.</li>
                <li>If all players reach <strong>10 or 0 Credits</strong>, the winner is determined by points earned. If points are tied, a Tie-Breaker is triggered!</li>
                <li>If a player wishes to skip their turn, they can <strong>Pass Turn</strong>.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-zinc-100 font-semibold text-xs uppercase tracking-wider font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Round-Based Format & Scoring</span>
              </div>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>Gameplay is strictly <strong>round-based</strong>: in each round, every eligible player receives exactly one turn (Player 1 → Player 2 → Player 3 → Player 4).</li>
                <li>Answering correctly awards the full points value (20, 30, 40, or 50 PTS). Answering incorrectly awards 0 points.</li>
                <li>Win conditions and ties are evaluated <strong>at the completion of each round</strong>.</li>
                <li>If 2 or more players reach <strong>100+ points in the same round</strong>, it is declared a tie and triggers the Championship Tie-Breaker phase!</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Tie-Breaker & FFF Sudden Death */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-zinc-100 font-semibold text-xs uppercase tracking-wider font-mono">
              <Swords className="w-4 h-4 text-purple-400" />
              <span>Tie-Breaker & Fastest Finger First (FFF)</span>
            </div>
            <div className="text-xs text-zinc-400 space-y-2 leading-relaxed">
              <p>
                <strong>Tie-Breaker Phase:</strong> When 2 or more contestants reach 100+ points in the same round (or tie on points when all credits run out), the system enters the Tie-Breaker Phase where tied contestants face high-difficulty questions.
              </p>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Fastest Finger First (FFF) Sudden Death:</strong> If the tie-breaker questions conclude in an exact tie, the match escalates to FFF Sudden Death. The first tied player to strike their buzzer button (or press Keys 1–4) gets 10 seconds to answer for an instant victory!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all cursor-pointer"
          >
            Got it, Let's Play
          </button>
        </div>
      </div>
    </div>
  );
};
