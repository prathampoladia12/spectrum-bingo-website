import React, { useState, useEffect } from 'react';
import type { CardState, Player } from '../types/game';
import { 
  GitBranch, 
  BrainCircuit, 
  Globe, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Eye, 
  Clock, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface QuestionModalProps {
  card: CardState | null;
  activePlayer: Player;
  isOpen: boolean;
  onSubmitAnswer: (isCorrect: boolean) => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  card,
  activePlayer,
  isOpen,
  onSubmitAnswer,
  onClose,
}) => {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(45);

  // Reset modal state when opening
  useEffect(() => {
    if (isOpen && card) {
      setIsAnswerRevealed(false);
      setEvaluationResult(null);
      setTimeLeft(45);
    }
  }, [isOpen, card?.id]);

  // Turn timer
  useEffect(() => {
    if (!isOpen || evaluationResult !== null) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, evaluationResult]);

  // Keyboard navigation:
  // Space = reveal answer
  // C / 1 = Correct
  // X / 2 = Incorrect
  // Enter = Continue when evaluated
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (evaluationResult !== null) {
        if (e.key === 'Enter' || e.key === 'Escape') {
          sounds.playClick();
          onClose();
        }
        return;
      }

      if (!isAnswerRevealed) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          sounds.playUnlock();
          setIsAnswerRevealed(true);
        }
        return;
      }

      // If answer is revealed, allow quick evaluation
      const key = e.key.toUpperCase();
      if (key === 'C' || key === '1' || key === 'Y') {
        handleVerification(true);
      } else if (key === 'X' || key === '2' || key === 'N') {
        handleVerification(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isAnswerRevealed, evaluationResult, onClose]);

  if (!isOpen || !card) return null;

  const handleVerification = (isCorrect: boolean) => {
    if (evaluationResult !== null) return;
    setEvaluationResult(isCorrect);
    onSubmitAnswer(isCorrect);
  };

  const getCategoryIcon = () => {
    switch (card.category) {
      case 'DSA': return <GitBranch className="w-4 h-4 text-sky-400" />;
      case 'AI/ML': return <BrainCircuit className="w-4 h-4 text-purple-400" />;
      case 'WSD': return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'PROGRAMMING': return <Terminal className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700">
              {getCategoryIcon()}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-zinc-300 uppercase">
                  {card.category}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs font-mono text-white font-bold">
                  {card.points} PTS
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-400">
                Turn: <span style={{ color: activePlayer.color.hex }} className="font-semibold">{activePlayer.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {evaluationResult === null && (
              <div className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border ${
                timeLeft < 10 
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse' 
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            )}

            <div className="text-[11px] font-mono bg-zinc-800/80 px-2.5 py-1 rounded border border-zinc-700/60 text-zinc-400">
              Risk: <span className="text-amber-400 font-semibold">-{card.cost} CR</span> <span className="text-zinc-500 text-[10px]">(only if wrong)</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Question Text */}
          <div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
              Question Prompt
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-white leading-relaxed">
              {card.question_text}
            </h3>

            {/* Code Snippet (if available) */}
            {card.codeSnippet && (
              <div className="mt-4 rounded-xl bg-zinc-950 p-4 border border-zinc-800 font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto whitespace-pre">
                {card.codeSnippet}
              </div>
            )}
          </div>

          {/* Reveal Official Answer Section (NO MCQ) */}
          {!isAnswerRevealed ? (
            <div className="py-6 text-center border-t border-b border-zinc-850">
              <p className="text-xs font-mono text-zinc-400 mb-3">
                Contestant answers out loud or directly. Click below to verify against the official answer:
              </p>
              <button
                onClick={() => {
                  sounds.playUnlock();
                  setIsAnswerRevealed(true);
                }}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 transition-all flex items-center gap-2 mx-auto cursor-pointer shadow-md active:scale-95"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Reveal Official Answer (Space)</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Revealed Official Answer Box */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-700/80 space-y-1.5">
                <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Official Correct Answer</span>
                </div>
                <div className="text-base font-bold text-white tracking-tight">
                  {card.answer}
                </div>
                <div className="text-xs text-zinc-400 leading-relaxed pt-1 border-t border-zinc-850">
                  {card.explanation}
                </div>
              </div>

              {/* Verification Buttons */}
              {evaluationResult === null && (
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs font-mono text-zinc-400">
                    Did <strong className="text-zinc-200">{activePlayer.name}</strong> answer correctly?
                  </span>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleVerification(false)}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Incorrect (-{card.cost} CR) [X]</span>
                    </button>

                    <button
                      onClick={() => handleVerification(true)}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-emerald-500/10"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Correct (+{card.points} PTS) [C]</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Outcome Status Banner */}
          {evaluationResult !== null && (
            <div className={`p-4 rounded-xl border transition-all animate-fade-in ${
              evaluationResult 
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100' 
                : 'bg-rose-950/30 border-rose-500/40 text-rose-100'
            }`}>
              <div className="flex items-start gap-3">
                {evaluationResult ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="font-semibold text-sm">
                    {evaluationResult 
                      ? `Verified Correct! +${card.points} PTS awarded to ${activePlayer.name}. (Credits intact)` 
                      : `Verified Incorrect. -${card.cost} CR deducted from ${activePlayer.name}.`}
                  </div>
                  <div className="text-xs text-zinc-300">
                    {evaluationResult 
                      ? 'The square has been claimed and points added to the score.' 
                      : 'Points were not awarded. The next player can now take their turn.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <div className="text-xs font-mono text-zinc-400">
            {evaluationResult === null ? (
              <span>No multiple choice options • Open trivia verification</span>
            ) : (
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">Enter</kbd> to continue</span>
            )}
          </div>

          {evaluationResult !== null && (
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white text-zinc-950 hover:bg-zinc-200 transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
