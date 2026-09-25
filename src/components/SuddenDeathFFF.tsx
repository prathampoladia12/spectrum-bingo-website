import React, { useState, useEffect } from 'react';
import type { Player, QuestionItem } from '../types/game';
import { Zap, Clock, Eye, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SuddenDeathFFFProps {
  isOpen: boolean;
  question: QuestionItem | null;
  tiedPlayers: Player[];
  buzzedPlayerId: number | null;
  onBuzzIn: (playerId: number) => void;
  onSubmitAnswer: (isCorrect: boolean) => void;
}

export const SuddenDeathFFF: React.FC<SuddenDeathFFFProps> = ({
  isOpen,
  question,
  tiedPlayers,
  buzzedPlayerId,
  onBuzzIn,
  onSubmitAnswer,
}) => {
  const [countdown, setCountdown] = useState<number>(10);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);

  const buzzedPlayer = tiedPlayers.find(p => p.id === buzzedPlayerId) || null;

  // Countdown timer once someone buzzes in
  useEffect(() => {
    if (!buzzedPlayerId || hasEvaluated) return;
    setCountdown(10);
    setIsAnswerRevealed(false);
    setHasEvaluated(false);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [buzzedPlayerId, hasEvaluated]);

  // Keyboard shortcut listener: Keys 1..4 to buzz in
  useEffect(() => {
    if (!isOpen || buzzedPlayerId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      tiedPlayers.forEach((p) => {
        if (key === String(p.id)) {
          onBuzzIn(p.id);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, buzzedPlayerId, tiedPlayers, onBuzzIn]);

  if (!isOpen || !question) return null;

  const handleEvaluate = (isCorrect: boolean) => {
    if (hasEvaluated) return;
    setHasEvaluated(true);
    onSubmitAnswer(isCorrect);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-zinc-900 border-2 border-rose-500/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="px-6 py-4 bg-rose-500/10 border-b border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 animate-pulse">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <div className="text-sm font-black tracking-wider text-rose-400 uppercase flex items-center gap-2">
                <span>Fastest Finger First (FFF)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                  Sudden Death
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-400">
                Hit buzzer first, answer aloud. Correct answer wins instantly!
              </div>
            </div>
          </div>

          {buzzedPlayer && !hasEvaluated && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white font-mono text-xs font-bold animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>{countdown}s</span>
            </div>
          )}
        </div>

        {/* Buzzer Console (if no one buzzed in yet) */}
        {!buzzedPlayer ? (
          <div className="p-6 bg-zinc-950/80 border-b border-zinc-800">
            <div className="text-center mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Hit Your Buzzer or Press Number Key (1-4)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {tiedPlayers.map((player) => (
                <button
                  key={player.id}
                  onClick={() => onBuzzIn(player.id)}
                  className="p-5 rounded-2xl border-2 transition-all duration-150 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:scale-105 active:scale-95 shadow-lg bg-zinc-900 border-zinc-700 hover:border-rose-500 hover:bg-rose-500/10"
                >
                  <div
                    style={{ backgroundColor: `${player.color.hex}22`, borderColor: `${player.color.hex}88` }}
                    className="w-10 h-10 rounded-full border flex items-center justify-center font-mono font-bold text-sm"
                  >
                    <span style={{ color: player.color.hex }}>{player.avatar}</span>
                  </div>
                  <div className="text-sm font-bold text-white group-hover:text-rose-300">
                    {player.name}
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    [Key: {player.id}] BUZZ IN
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-6 py-3 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                style={{ backgroundColor: `${buzzedPlayer.color.hex}22`, borderColor: `${buzzedPlayer.color.hex}88` }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center font-mono font-bold text-xs"
              >
                <span style={{ color: buzzedPlayer.color.hex }}>{buzzedPlayer.avatar}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-white">{buzzedPlayer.name} buzzed in first!</span>
                <div className="text-[10px] font-mono text-zinc-400">Contestant has the floor to state their answer.</div>
              </div>
            </div>

            <div className="text-xs font-mono text-zinc-400">
              Other players locked out
            </div>
          </div>
        )}

        {/* Question Display */}
        <div className="p-6 overflow-y-auto space-y-5">
          <h3 className="text-lg font-medium text-white leading-relaxed">
            {question.question_text}
          </h3>

          {/* Reveal & Verification (NO MCQ) */}
          {buzzedPlayer && (
            !isAnswerRevealed ? (
              <div className="py-4 text-center border-t border-b border-zinc-800">
                <button
                  onClick={() => {
                    sounds.playUnlock();
                    setIsAnswerRevealed(true);
                  }}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 transition-all flex items-center gap-2 mx-auto cursor-pointer shadow-md"
                >
                  <Eye className="w-4 h-4 text-rose-400" />
                  <span>Reveal Official Answer</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-rose-500/40 space-y-1">
                  <div className="text-[10px] font-mono text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Official Answer</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    {question.answer}
                  </div>
                  <div className="text-xs text-zinc-400 pt-1 border-t border-zinc-850">
                    {question.explanation}
                  </div>
                </div>

                {!hasEvaluated && (
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-xs font-mono text-zinc-400">
                      Verify {buzzedPlayer.name}'s answer:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEvaluate(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Incorrect (Re-open Buzzer)</span>
                      </button>
                      <button
                        onClick={() => handleEvaluate(true)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Correct (Wins Tournament!)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
