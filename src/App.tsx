import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { Header } from './components/Header';
import { PlayerStatus } from './components/PlayerStatus';
import { GameCard } from './components/GameCard';
import { QuestionModal } from './components/QuestionModal';
import { TieBreakerModal } from './components/TieBreakerModal';
import { SuddenDeathFFF } from './components/SuddenDeathFFF';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';
import { ActivityLogDrawer } from './components/ActivityLogDrawer';
import { 
  GitBranch, 
  BrainCircuit, 
  Globe, 
  Terminal, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import type { Category } from './types/game';

const CATEGORIES: { id: Category; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'DSA', label: 'DSA', sub: 'ALGORITHMS & STRUCTURES', icon: GitBranch },
  { id: 'AI/ML', label: 'AI / ML', sub: 'NEURAL & LEARNING', icon: BrainCircuit },
  { id: 'WSD', label: 'WSD', sub: 'WEB SYSTEMS & PROTOCOLS', icon: Globe },
  { id: 'PROGRAMMING', label: 'PROGRAMMING', sub: 'LANGUAGES & RUNTIMES', icon: Terminal },
];

const POINT_ROWS = [20, 30, 40, 50];

export function App() {
  const {
    state,
    activePlayer,
    unlockCard,
    submitAnswer,
    closeQuestionModal,
    passTurn,
    submitTieBreakerAnswer,
    buzzInFFF,
    submitFFFAnswer,
    resetGame,
    setCurrentPlayer,
    activeCard,
    currentTieBreakerQuestion,
  } = useGameState();

  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCardSelect = (cardId: string) => {
    const success = unlockCard(cardId);
    if (!success) {
      const card = state.cards.find(c => c.id === cardId);
      if (card && activePlayer.credits < card.cost) {
        setErrorMessage(
          `Insufficient credits: ${card.cost} CR required to risk on this question, but ${activePlayer.name} only has ${activePlayer.credits} CR.`
        );
        setTimeout(() => setErrorMessage(null), 4000);
      }
    }
  };

  // Build grid tiles in 4x4 matrix order:
  // Row 20: DSA 20, AI/ML 20, WSD 20, PROG 20
  // Row 30: DSA 30, AI/ML 30, WSD 30, PROG 30
  // Row 40: DSA 40, AI/ML 40, WSD 40, PROG 40
  // Row 50: DSA 50, AI/ML 50, WSD 50, PROG 50
  const orderedCards = POINT_ROWS.flatMap(pts => 
    CATEGORIES.map(cat => 
      state.cards.find(c => c.points === pts && c.category === cat.id)!
    )
  );

  const tiedPlayers = state.tiedPlayerIds.map(
    id => state.players.find(p => p.id === id)!
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* SaaS Enterprise Header */}
      <Header
        currentRound={state.currentRound}
        activePlayer={activePlayer}
        onReset={resetGame}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onPassTurn={passTurn}
      />

      {/* Main Game Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Floating Error Notification Toast */}
        {errorMessage && (
          <div className="sticky top-20 z-40 mx-auto max-w-md w-full p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between shadow-xl backdrop-blur-md animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white text-xs font-mono ml-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 4 Players Dashboard */}
        <section aria-label="Player Status">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
              Live Contestants Dashboard (Target: 100 PTS)
            </span>
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
              Turn sequence: P1 → P2 → P3 → P4
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {state.players.map((player, idx) => (
              <PlayerStatus
                key={player.id}
                player={player}
                isActive={idx === state.currentPlayerIndex}
                onSelectPlayer={setCurrentPlayer}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* 4x4 Tech Trivia Interactive Grid */}
        <section className="flex-1 flex flex-col justify-center my-2" aria-label="Trivia Grid">
          {/* Category Column Headers */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-3">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="px-3 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-center justify-center gap-2 text-center backdrop-blur-sm"
                >
                  <span className="p-1 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="font-mono font-bold text-xs sm:text-sm tracking-wide text-zinc-200">
                      {cat.label}
                    </div>
                    <div className="text-[9px] font-mono text-zinc-400 hidden md:block">
                      {cat.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4x4 Grid Matrix */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {orderedCards.map(card => (
              <GameCard
                key={card.id}
                card={card}
                activePlayer={activePlayer}
                onSelect={handleCardSelect}
                allPlayers={state.players}
              />
            ))}
          </div>
        </section>

        {/* Bottom Status / Control Summary */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-850 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Reactive Board Sync: Active</span>
            </span>
            <span>•</span>
            <span>Penalty: Deducted only on incorrect answer</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRulesOpen(true)}
              className="hover:text-zinc-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Tie-Breaker & FFF Rules</span>
            </button>
          </div>
        </div>
      </main>

      {/* Question Modal */}
      <QuestionModal
        card={activeCard}
        activePlayer={activePlayer}
        isOpen={state.phase === 'QUESTION_MODAL'}
        onSubmitAnswer={submitAnswer}
        onClose={closeQuestionModal}
      />

      {/* Tie-Breaker Modal (Multi-player 100+ points tie) */}
      <TieBreakerModal
        isOpen={state.phase === 'TIE_BREAKER'}
        question={currentTieBreakerQuestion}
        tiedPlayers={tiedPlayers}
        tieBreakerScores={state.tieBreakerScores}
        tieBreakerIndex={state.tieBreakerIndex}
        totalTieBreakers={4}
        onSubmitAnswer={submitTieBreakerAnswer}
      />

      {/* Fastest Finger First Sudden Death */}
      <SuddenDeathFFF
        isOpen={state.phase === 'SUDDEN_DEATH_FFF'}
        question={state.fffQuestion}
        tiedPlayers={tiedPlayers}
        buzzedPlayerId={state.fffBuzzedPlayerId}
        onBuzzIn={buzzInFFF}
        onSubmitAnswer={submitFFFAnswer}
      />

      {/* Game Over Victory Modal */}
      <GameOverModal
        isOpen={state.phase === 'GAME_OVER'}
        winnerId={state.winnerId}
        players={state.players}
        onPlayAgain={resetGame}
      />

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Activity Log Drawer */}
      <ActivityLogDrawer
        isOpen={isHistoryOpen}
        history={state.history}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}

export default App;
