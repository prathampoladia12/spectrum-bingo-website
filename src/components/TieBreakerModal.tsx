import React, { useState } from 'react';
import type { Player, QuestionItem } from '../types/game';
import { Swords, CheckCircle2, XCircle, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface TieBreakerModalProps {
  isOpen: boolean;
  question: QuestionItem | null;
  tiedPlayers: Player[];
  tieBreakerScores: Record<number, number>;
  tieBreakerIndex: number;
  totalTieBreakers: number;
  onSubmitAnswer: (playerId: number, isCorrect: boolean) => void;
}

export const TieBreakerModal: React.FC<TieBreakerModalProps> = ({
  isOpen,
  question,
  tiedPlayers,
  tieBreakerScores,
  tieBreakerIndex,
  totalTieBreakers,
  onSubmitAnswer,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(tiedPlayers[0]?.id || 1);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<boolean | null>(null);

  if (!isOpen || !question) return null;

  const currentTiedPlayer = tiedPlayers.find(p => p.id === selectedPlayerId) || tiedPlayers[0];

  const handleReveal = () => {
    sounds.playUnlock();
    setIsRevealed(true);
  };

  const handleEvaluate = (isCorrect: boolean) => {
    setEvaluationResult(isCorrect);
  };

  const handleNext = () => {
    if (evaluationResult === null) return;
    onSubmitAnswer(currentTiedPlayer.id, evaluationResult);
    // Reset for next question
    setIsRevealed(false);
    setEvaluationResult(null);
    // Next player in tied group
    const nextPlayerIndex = (tiedPlayers.findIndex(p => p.id === currentTiedPlayer.id) + 1) % tiedPlayers.length;
    setSelectedPlayerId(tiedPlayers[nextPlayerIndex].id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Banner */}
        <div className="px-6 py-4 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Swords className="w-5 h-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-amber-400 tracking-wide uppercase flex items-center gap-2">
                <span>Championship Tie-Breaker</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                  Round {tieBreakerIndex + 1} of {totalTieBreakers}
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-400">
                Multiple players reached 100+ points! Tie-breaker round in progress.
              </div>
            </div>
          </div>
        </div>

        {/* Tied Players Leaderboard */}
        <div className="px-6 py-3 bg-zinc-950/70 border-b border-zinc-800 flex items-center justify-around gap-4">
          {tiedPlayers.map(p => {
            const isTurn = p.id === currentTiedPlayer.id;
            const tbScore = tieBreakerScores[p.id] || 0;
            return (
              <div
                key={p.id}
                onClick={() => evaluationResult === null && setSelectedPlayerId(p.id)}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-xl border transition-all cursor-pointer
                  ${isTurn 
                    ? 'bg-zinc-800 border-amber-500/60 shadow-md ring-1 ring-amber-500/30' 
                    : 'bg-zinc-900/50 border-zinc-800 opacity-75 hover:opacity-100'
                  }
                `}
              >
                <div 
                  style={{ backgroundColor: `${p.color.hex}22`, borderColor: `${p.color.hex}66` }}
                  className="w-7 h-7 rounded-lg border flex items-center justify-center font-mono font-bold text-xs"
                >
                  <span style={{ color: p.color.hex }}>{p.avatar}</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-200">{p.name}</div>
                  <div className="text-[11px] font-mono text-amber-400 font-bold">{tbScore} TB PTS</div>
                </div>
                {isTurn && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />
                )}
              </div>
            );
          })}
        </div>

        {/* Question Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Active Turn: <span style={{ color: currentTiedPlayer.color.hex }} className="font-semibold">{currentTiedPlayer.name}</span>
          </div>

          <h3 className="text-lg font-medium text-white leading-relaxed">
            {question.question_text}
          </h3>

          {/* Reveal & Verification (NO MCQ) */}
          {!isRevealed ? (
            <div className="py-6 text-center border-t border-b border-zinc-800">
              <p className="text-xs font-mono text-zinc-400 mb-3">
                Contestant responds directly. Click to reveal answer and verify:
              </p>
              <button
                onClick={handleReveal}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 transition-all flex items-center gap-2 mx-auto cursor-pointer shadow-md"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Reveal Official Answer</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-amber-500/30 space-y-1">
                <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Correct Answer</span>
                </div>
                <div className="text-base font-bold text-white">
                  {question.answer}
                </div>
                <div className="text-xs text-zinc-400 pt-1 border-t border-zinc-850">
                  {question.explanation}
                </div>
              </div>

              {/* Verification Buttons */}
              {evaluationResult === null && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-xs font-mono text-zinc-400">
                    Verify {currentTiedPlayer.name}'s answer:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEvaluate(false)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Incorrect (0 PTS)</span>
                    </button>
                    <button
                      onClick={() => handleEvaluate(true)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 transition-all flex items-center gap-1 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Correct (+50 PTS)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <div className="text-xs font-mono text-zinc-400">
            If tied after all rounds, game advances to Fastest Finger First (FFF).
          </div>

          {evaluationResult !== null && (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl font-medium text-sm bg-white text-zinc-950 hover:bg-zinc-200 transition-all flex items-center gap-2 cursor-pointer font-semibold shadow-md"
            >
              <span>Next Turn</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
