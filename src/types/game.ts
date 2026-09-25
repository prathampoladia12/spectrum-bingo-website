export type Category = 'DSA' | 'AI/ML' | 'WSD' | 'PROGRAMMING';

export interface QuestionItem {
  id: string;
  category: Category;
  points: number; // 20, 30, 40, 50
  cost: number;   // 20, 30, 40, 50
  question_text: string;
  answer: string;
  explanation: string;
  codeSnippet?: string;
}

export type CardStatus = 'masked' | 'revealed' | 'answered_correct' | 'answered_wrong';

export interface CardState extends QuestionItem {
  status: CardStatus;
  unlockedByPlayerId?: number;
  answeredByPlayerId?: number;
  revealedAt?: number;
}

export interface Player {
  id: number;
  name: string;
  credits: number; // starts at 100
  score: number;   // target 100
  color: {
    accent: string;
    border: string;
    bg: string;
    badge: string;
    ring: string;
    hex: string;
  };
  avatar: string;
  correctCount: number;
  wrongCount: number;
  totalSpent: number;
}

export type GamePhase = 
  | 'PLAYING' 
  | 'QUESTION_MODAL' 
  | 'TIE_BREAKER' 
  | 'SUDDEN_DEATH_FFF' 
  | 'GAME_OVER';

export interface LogEntry {
  id: string;
  timestamp: string;
  playerId?: number;
  playerName?: string;
  type: 'unlock' | 'correct' | 'wrong' | 'pass' | 'tie' | 'win' | 'info';
  message: string;
  pointsDelta?: number;
  creditsDelta?: number;
}

export interface GameState {
  players: Player[];
  cards: CardState[];
  currentRound: number;
  currentPlayerIndex: number;
  activeCardId: string | null;
  phase: GamePhase;
  winnerId: number | null;
  tiedPlayerIds: number[];
  tieBreakerIndex: number;
  tieBreakerScores: Record<number, number>;
  fffQuestion: QuestionItem | null;
  fffBuzzedPlayerId: number | null;
  fffTimer: number | null;
  history: LogEntry[];
}
