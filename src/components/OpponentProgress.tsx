import { memo } from 'react';
import type { GameState } from '../types/multiplayer';

interface OpponentProgressProps {
  state: GameState | null;
  name: string;
  maxErrors: number;
  isTheirTurn?: boolean;
}

export const OpponentProgress = memo(function OpponentProgress({
  state,
  name,
  maxErrors,
  isTheirTurn = false,
}: OpponentProgressProps) {
  const errors = state?.errors || 0;
  const progress = Math.max(0, ((maxErrors - errors) / maxErrors) * 100);

  return (
    <div className={`bg-white rounded-2xl shadow-md p-4 ${isTheirTurn ? 'ring-2 ring-amarelo-sol' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👤</span>
          <span className="font-bold text-marrom">{name}</span>
          {isTheirTurn && (
            <span className="bg-amarelo-sol text-marrom text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              Jogando
            </span>
          )}
        </div>
        <div className="text-sm text-marrom/60">
          Erros: <span className={errors >= maxErrors - 1 ? 'text-rosa-chiclete font-bold' : ''}>{errors}/{maxErrors}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            errors >= maxErrors ? 'bg-rosa-chiclete' :
            errors >= maxErrors - 2 ? 'bg-laranja' : 'bg-verde-menta'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status indicators */}
      {state?.finished && (
        <div className={`mt-2 text-center font-bold ${state.won ? 'text-verde-menta' : 'text-rosa-chiclete'}`}>
          {state.won ? '🎉 Venceu!' : '💀 Perdeu'}
        </div>
      )}
    </div>
  );
});
