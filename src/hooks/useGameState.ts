import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  GameState, 
  Player, 
  CardState, 
  CardStatus,
  LogEntry 
} from '../types/game';
import { INITIAL_QUESTIONS, TIE_BREAKER_QUESTIONS, FFF_QUESTIONS } from '../data/questions';
import { sounds } from '../utils/audio';

const STORAGE_KEY = 'spectrum_tech_trivia_state_v1';
const SYNC_CHANNEL_NAME = 'spectrum_tech_trivia_channel';

const DEFAULT_PLAYERS: Player[] = [
  {
    id: 1,
    name: 'Player 1',
    credits: 100,
    score: 0,
    color: {
      accent: 'indigo',
      border: 'border-indigo-500/40',
      bg: 'bg-indigo-500/10',
      badge: 'bg-indigo-500 text-white',
      ring: 'ring-indigo-500',
      hex: '#6366f1',
    },
    avatar: 'P1',
    correctCount: 0,
    wrongCount: 0,
    totalSpent: 0,
  },
  {
    id: 2,
    name: 'Player 2',
    credits: 100,
    score: 0,
    color: {
      accent: 'emerald',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      badge: 'bg-emerald-500 text-white',
      ring: 'ring-emerald-500',
      hex: '#10b981',
    },
    avatar: 'P2',
    correctCount: 0,
    wrongCount: 0,
    totalSpent: 0,
  },
  {
    id: 3,
    name: 'Player 3',
    credits: 100,
    score: 0,
    color: {
      accent: 'amber',
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      badge: 'bg-amber-500 text-white',
      ring: 'ring-amber-500',
      hex: '#f59e0b',
    },
    avatar: 'P3',
    correctCount: 0,
    wrongCount: 0,
    totalSpent: 0,
  },
  {
    id: 4,
    name: 'Player 4',
    credits: 100,
    score: 0,
    color: {
      accent: 'purple',
      border: 'border-purple-500/40',
      bg: 'bg-purple-500/10',
      badge: 'bg-purple-500 text-white',
      ring: 'ring-purple-500',
      hex: '#a855f7',
    },
    avatar: 'P4',
    correctCount: 0,
    wrongCount: 0,
    totalSpent: 0,
  },
];

function createInitialCards(): CardState[] {
  return INITIAL_QUESTIONS.map(q => ({
    ...q,
    status: 'masked',
  }));
}

function getInitialState(): GameState {
  return {
    players: DEFAULT_PLAYERS,
    cards: createInitialCards(),
    currentRound: 1,
    currentPlayerIndex: 0,
    activeCardId: null,
    phase: 'PLAYING',
    winnerId: null,
    tiedPlayerIds: [],
    tieBreakerIndex: 0,
    tieBreakerScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
    fffQuestion: null,
    fffBuzzedPlayerId: null,
    fffTimer: null,
    history: [
      {
        id: 'init',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'info',
        message: 'Tech Trivia Challenge started. 4 players ready with 100 credits each.',
      },
    ],
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return getInitialState();
  });

  const broadcastRef = useRef<BroadcastChannel | null>(null);

  // Sync with BroadcastChannel
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      broadcastRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data && typeof event.data === 'object') {
          setState(event.data);
        }
      };

      return () => {
        channel.close();
      };
    }
  }, []);

  // Persist state & broadcast
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (broadcastRef.current) {
        broadcastRef.current.postMessage(state);
      }
    } catch {
      // Storage error
    }
  }, [state]);

  const activePlayer = state.players[state.currentPlayerIndex];

  // Helper to add log
  const createLog = (
    type: LogEntry['type'], 
    message: string, 
    playerId?: number,
    playerName?: string,
    pointsDelta?: number,
    creditsDelta?: number
  ): LogEntry => ({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    type,
    message,
    playerId,
    playerName,
    pointsDelta,
    creditsDelta,
  });

  /**
   * Check if a player can afford to unlock a card
   */
  const canUnlockCard = useCallback((cardId: string): { allowed: boolean; reason?: string } => {
    if (state.phase !== 'PLAYING') {
      return { allowed: false, reason: 'Game is not in active playing phase.' };
    }
    const card = state.cards.find(c => c.id === cardId);
    if (!card) {
      return { allowed: false, reason: 'Card not found.' };
    }
    if (card.status !== 'masked') {
      return { allowed: false, reason: 'Card has already been revealed.' };
    }
    if (activePlayer.credits < card.cost) {
      return { 
        allowed: false, 
        reason: `Insufficient credits. You need ${card.cost} CR, but ${activePlayer.name} only has ${activePlayer.credits} CR.` 
      };
    }
    return { allowed: true };
  }, [state.cards, state.phase, activePlayer]);

  /**
   * Unlock a square: reveals question modal without deducting credits yet
   */
  const unlockCard = useCallback((cardId: string): boolean => {
    const check = canUnlockCard(cardId);
    if (!check.allowed) {
      sounds.playWrong();
      return false;
    }

    sounds.playUnlock();

    setState(prev => {
      const card = prev.cards.find(c => c.id === cardId);
      if (!card) return prev;

      const playerIndex = prev.currentPlayerIndex;
      const currentP = prev.players[playerIndex];

      const updatedCards = prev.cards.map(c => {
        if (c.id === cardId) {
          return {
            ...c,
            status: 'revealed' as const,
            unlockedByPlayerId: currentP.id,
            revealedAt: Date.now(),
          };
        }
        return c;
      });

      const log = createLog(
        'unlock',
        `${currentP.name} revealed ${card.category} for ${card.points} PTS (Risk: ${card.cost} CR if incorrect)`,
        currentP.id,
        currentP.name
      );

      return {
        ...prev,
        cards: updatedCards,
        activeCardId: cardId,
        phase: 'QUESTION_MODAL',
        history: [log, ...prev.history],
      };
    });

    return true;
  }, [canUnlockCard]);

  /**
   * Verify an answer submitted by the player
   * Deducts credits ONLY if answered incorrectly!
   */
  const submitAnswer = useCallback((isCorrect: boolean) => {
    if (!state.activeCardId) return;

    const card = state.cards.find(c => c.id === state.activeCardId);
    if (!card) return;

    const player = state.players[state.currentPlayerIndex];

    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    setState(prev => {
      const updatedPlayers = prev.players.map((p, idx) => {
        if (idx === prev.currentPlayerIndex) {
          return {
            ...p,
            score: isCorrect ? p.score + card.points : p.score,
            credits: isCorrect ? p.credits : Math.max(0, p.credits - card.cost),
            totalSpent: isCorrect ? p.totalSpent : p.totalSpent + card.cost,
            correctCount: isCorrect ? p.correctCount + 1 : p.correctCount,
            wrongCount: !isCorrect ? p.wrongCount + 1 : p.wrongCount,
          };
        }
        return p;
      });

      const updatedCards = prev.cards.map(c => {
        if (c.id === card.id) {
          return {
            ...c,
            status: (isCorrect ? 'answered_correct' : 'answered_wrong') as CardStatus,
            answeredByPlayerId: player.id,
          };
        }
        return c;
      });

      const log = createLog(
        isCorrect ? 'correct' : 'wrong',
        isCorrect
          ? `${player.name} answered correctly! (+${card.points} PTS, credits kept)`
          : `${player.name} answered incorrectly. (-${card.cost} CR)`,
        player.id,
        player.name,
        isCorrect ? card.points : 0,
        isCorrect ? 0 : -card.cost
      );

      return {
        ...prev,
        players: updatedPlayers,
        cards: updatedCards,
        history: [log, ...prev.history],
      };
    });
  }, [state.activeCardId, state.cards, state.currentPlayerIndex, state.players]);

  /**
   * Close question modal and advance turn / check win condition
   */
  const closeQuestionModal = useCallback(() => {
    setState(prev => {
      // Advance to next player
      const nextPlayerIndex = (prev.currentPlayerIndex + 1) % 4;
      const isRoundComplete = nextPlayerIndex === 0;
      const nextRound = isRoundComplete ? prev.currentRound + 1 : prev.currentRound;

      // Check win condition (First to 100 points)
      // If at end of turn/round multiple players reached >= 100
      const playersOver100 = prev.players.filter(p => p.score >= 100);

      if (playersOver100.length === 1) {
        // Single winner!
        sounds.playVictory();
        const winner = playersOver100[0];
        const winLog = createLog(
          'win',
          `🎉 ${winner.name} reached ${winner.score} PTS and won the Tech Trivia Challenge!`,
          winner.id,
          winner.name
        );
        return {
          ...prev,
          activeCardId: null,
          phase: 'GAME_OVER',
          winnerId: winner.id,
          history: [winLog, ...prev.history],
        };
      } else if (playersOver100.length > 1) {
        // Multiple players scored 100+ at the same time: trigger Tie-Breaker!
        sounds.playBuzzer();
        const tiedIds = playersOver100.map(p => p.id);
        const tieLog = createLog(
          'tie',
          `⚔️ TIE DETECTED! ${playersOver100.map(p => p.name).join(' & ')} scored 100+ points! Entering Tie-Breaker Phase.`
        );
        return {
          ...prev,
          activeCardId: null,
          phase: 'TIE_BREAKER',
          tiedPlayerIds: tiedIds,
          tieBreakerIndex: 0,
          history: [tieLog, ...prev.history],
        };
      }

      // Check if all cards answered
      const unmaskedCards = prev.cards.filter(c => c.status === 'masked');
      if (unmaskedCards.length === 0) {
        // Board exhausted, player with highest score wins, or tie
        const sorted = [...prev.players].sort((a, b) => b.score - a.score);
        if (sorted[0].score === sorted[1].score && sorted[0].score > 0) {
          const tied = sorted.filter(p => p.score === sorted[0].score).map(p => p.id);
          return {
            ...prev,
            activeCardId: null,
            phase: 'TIE_BREAKER',
            tiedPlayerIds: tied,
            tieBreakerIndex: 0,
          };
        } else {
          sounds.playVictory();
          return {
            ...prev,
            activeCardId: null,
            phase: 'GAME_OVER',
            winnerId: sorted[0].id,
          };
        }
      }

      return {
        ...prev,
        activeCardId: null,
        phase: 'PLAYING',
        currentPlayerIndex: nextPlayerIndex,
        currentRound: nextRound,
      };
    });
  }, []);

  /**
   * Pass turn if active player chooses to pass
   */
  const passTurn = useCallback(() => {
    sounds.playClick();
    setState(prev => {
      const currentP = prev.players[prev.currentPlayerIndex];
      const nextIndex = (prev.currentPlayerIndex + 1) % 4;
      const isRoundComplete = nextIndex === 0;
      const nextRound = isRoundComplete ? prev.currentRound + 1 : prev.currentRound;

      const log = createLog('pass', `${currentP.name} passed their turn.`, currentP.id, currentP.name);

      return {
        ...prev,
        currentPlayerIndex: nextIndex,
        currentRound: nextRound,
        history: [log, ...prev.history],
      };
    });
  }, []);

  /**
   * Submit Tie-Breaker Answer
   */
  const submitTieBreakerAnswer = useCallback((playerId: number, isCorrect: boolean) => {
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    setState(prev => {
      const newScores = {
        ...prev.tieBreakerScores,
        [playerId]: (prev.tieBreakerScores[playerId] || 0) + (isCorrect ? 50 : 0),
      };

      const nextTBIndex = prev.tieBreakerIndex + 1;
      const player = prev.players.find(p => p.id === playerId);

      const log = createLog(
        isCorrect ? 'correct' : 'wrong',
        `Tie-Breaker: ${player?.name} answered ${isCorrect ? 'CORRECTLY (+50 TB PTS)' : 'INCORRECTLY (0 TB PTS)'}`,
        playerId,
        player?.name
      );

      // Check if tie breaker questions exhausted
      if (nextTBIndex >= TIE_BREAKER_QUESTIONS.length) {
        // Evaluate tie-breaker winner or escalate to FFF
        const tiedPlayerScores = prev.tiedPlayerIds.map(id => ({ id, score: newScores[id] || 0 }));
        tiedPlayerScores.sort((a, b) => b.score - a.score);

        if (tiedPlayerScores[0].score > tiedPlayerScores[1].score) {
          // Clean tie-breaker winner!
          sounds.playVictory();
          const winner = prev.players.find(p => p.id === tiedPlayerScores[0].id);
          return {
            ...prev,
            tieBreakerScores: newScores,
            phase: 'GAME_OVER',
            winnerId: tiedPlayerScores[0].id,
            history: [
              createLog('win', `🏆 ${winner?.name} won the Tie-Breaker!`, winner?.id, winner?.name),
              log,
              ...prev.history,
            ],
          };
        } else {
          // Still tied! Reference image rule:
          // "if tie-breaker Qs also finished then fff [fastest finger first]"
          sounds.playBuzzer();
          return {
            ...prev,
            tieBreakerScores: newScores,
            phase: 'SUDDEN_DEATH_FFF',
            fffQuestion: FFF_QUESTIONS[0],
            fffBuzzedPlayerId: null,
            history: [
              createLog('info', '⚔️ Tie-breaker score tied! Escalating to Fastest Finger First (FFF) Sudden Death!'),
              log,
              ...prev.history,
            ],
          };
        }
      }

      return {
        ...prev,
        tieBreakerScores: newScores,
        tieBreakerIndex: nextTBIndex,
        history: [log, ...prev.history],
      };
    });
  }, []);

  /**
   * Buzzer in for Fastest Finger First (FFF)
   */
  const buzzInFFF = useCallback((playerId: number) => {
    if (state.phase !== 'SUDDEN_DEATH_FFF' || state.fffBuzzedPlayerId !== null) return;
    if (!state.tiedPlayerIds.includes(playerId)) return;

    sounds.playBuzzer();
    setState(prev => {
      const player = prev.players.find(p => p.id === playerId);
      const log = createLog('info', `🚨 ${player?.name} buzzed in first for Sudden Death!`, playerId, player?.name);
      return {
        ...prev,
        fffBuzzedPlayerId: playerId,
        history: [log, ...prev.history],
      };
    });
  }, [state.phase, state.fffBuzzedPlayerId, state.tiedPlayerIds]);

  /**
   * Submit FFF Answer
   */
  const submitFFFAnswer = useCallback((isCorrect: boolean) => {
    if (!state.fffBuzzedPlayerId) return;
    const buzzedPlayer = state.players.find(p => p.id === state.fffBuzzedPlayerId);

    if (isCorrect) {
      sounds.playVictory();
      setState(prev => {
        const log = createLog('win', `👑 ${buzzedPlayer?.name} answered Sudden Death correctly and WON!`, buzzedPlayer?.id, buzzedPlayer?.name);
        return {
          ...prev,
          phase: 'GAME_OVER',
          winnerId: buzzedPlayer?.id || null,
          history: [log, ...prev.history],
        };
      });
    } else {
      sounds.playWrong();
      setState(prev => {
        // Unlock buzzer for other tied players
        const remainingTied = prev.tiedPlayerIds.filter(id => id !== prev.fffBuzzedPlayerId);
        const log = createLog('wrong', `${buzzedPlayer?.name} missed Sudden Death question! Buzzer unlocked.`, buzzedPlayer?.id, buzzedPlayer?.name);

        if (remainingTied.length === 1) {
          // Default winner if only one player remaining
          const soleWinner = prev.players.find(p => p.id === remainingTied[0]);
          return {
            ...prev,
            phase: 'GAME_OVER',
            winnerId: soleWinner?.id || null,
            history: [
              createLog('win', `👑 ${soleWinner?.name} wins as sole remaining contestant!`, soleWinner?.id, soleWinner?.name),
              log,
              ...prev.history,
            ],
          };
        }

        return {
          ...prev,
          fffBuzzedPlayerId: null,
          history: [log, ...prev.history],
        };
      });
    }
  }, [state.fffBuzzedPlayerId, state.players]);

  /**
   * Reset game to initial state
   */
  const resetGame = useCallback(() => {
    sounds.playClick();
    const initial = getInitialState();
    localStorage.removeItem(STORAGE_KEY);
    setState(initial);
  }, []);

  /**
   * Direct player selection for hotseat or manual override
   */
  const setCurrentPlayer = useCallback((playerIndex: number) => {
    sounds.playClick();
    setState(prev => ({
      ...prev,
      currentPlayerIndex: playerIndex,
    }));
  }, []);

  return {
    state,
    activePlayer,
    canUnlockCard,
    unlockCard,
    submitAnswer,
    closeQuestionModal,
    passTurn,
    submitTieBreakerAnswer,
    buzzInFFF,
    submitFFFAnswer,
    resetGame,
    setCurrentPlayer,
    activeCard: state.cards.find(c => c.id === state.activeCardId) || null,
    currentTieBreakerQuestion: TIE_BREAKER_QUESTIONS[state.tieBreakerIndex] || null,
  };
}
