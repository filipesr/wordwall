export type GameMode = 'competitive' | 'cooperative' | 'challenger';
export type RoomStatus = 'waiting' | 'playing' | 'finished';

export interface Player {
  id: string;
  display_name: string;
  created_at: string;
}

export interface GameRoom {
  id: string;
  code: string;
  host_id: string;
  guest_id: string | null;
  host_name: string;
  guest_name: string | null;
  mode: GameMode;
  word: string | null;
  category: string | null;
  status: RoomStatus;
  winner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GameState {
  id: string;
  room_id: string;
  player_id: string;
  guessed_letters: string[];
  errors: number;
  finished: boolean;
  won: boolean;
  updated_at: string;
}

export interface MultiplayerState {
  room: GameRoom | null;
  myState: GameState | null;
  opponentState: GameState | null;
  playerId: string | null;
  isHost: boolean;
  loading: boolean;
  error: string | null;
}

export const GAME_MODE_LABELS: Record<GameMode, { name: string; description: string; emoji: string }> = {
  competitive: {
    name: 'Competitivo',
    description: 'Quem acertar primeiro vence!',
    emoji: '⚔️',
  },
  cooperative: {
    name: 'Cooperativo',
    description: 'Joguem juntos, revezando turnos',
    emoji: '🤝',
  },
  challenger: {
    name: 'Desafiante',
    description: 'Um escolhe a palavra, outro adivinha',
    emoji: '🎯',
  },
};

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
