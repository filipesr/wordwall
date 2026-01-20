import { memo } from 'react';

interface HangmanDrawingProps {
  errors: number;
}

export const HangmanDrawing = memo(function HangmanDrawing({ errors }: HangmanDrawingProps) {
  return (
    <svg viewBox="0 0 200 250" className="w-48 h-60 md:w-64 md:h-80">
      {/* Base */}
      <line x1="20" y1="230" x2="100" y2="230" stroke="#5D4E37" strokeWidth="4" strokeLinecap="round" />
      {/* Pole */}
      <line x1="60" y1="230" x2="60" y2="20" stroke="#5D4E37" strokeWidth="4" strokeLinecap="round" />
      {/* Top */}
      <line x1="60" y1="20" x2="140" y2="20" stroke="#5D4E37" strokeWidth="4" strokeLinecap="round" />
      {/* Rope */}
      <line x1="140" y1="20" x2="140" y2="50" stroke="#5D4E37" strokeWidth="3" strokeLinecap="round" />

      {/* Head - error 1 */}
      {errors >= 1 && (
        <g className="animate-bounce-in">
          <circle cx="140" cy="75" r="25" fill="#FFD93D" stroke="#5D4E37" strokeWidth="3" />
          {errors < 6 ? (
            <>
              {/* Happy eyes */}
              <circle cx="132" cy="70" r="4" fill="#5D4E37" />
              <circle cx="148" cy="70" r="4" fill="#5D4E37" />
              {/* Smile */}
              <path d="M 128 82 Q 140 95 152 82" stroke="#5D4E37" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Sad eyes - X marks */}
              <line x1="128" y1="66" x2="136" y2="74" stroke="#5D4E37" strokeWidth="3" strokeLinecap="round" />
              <line x1="136" y1="66" x2="128" y2="74" stroke="#5D4E37" strokeWidth="3" strokeLinecap="round" />
              <line x1="144" y1="66" x2="152" y2="74" stroke="#5D4E37" strokeWidth="3" strokeLinecap="round" />
              <line x1="152" y1="66" x2="144" y2="74" stroke="#5D4E37" strokeWidth="3" strokeLinecap="round" />
              {/* Sad mouth */}
              <path d="M 128 90 Q 140 78 152 90" stroke="#5D4E37" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}
        </g>
      )}

      {/* Body - error 2 */}
      {errors >= 2 && (
        <line
          x1="140" y1="100" x2="140" y2="160"
          stroke="#6BC5F8" strokeWidth="6" strokeLinecap="round"
          className="animate-draw-in"
        />
      )}

      {/* Left arm - error 3 */}
      {errors >= 3 && (
        <line
          x1="140" y1="115" x2="110" y2="140"
          stroke="#6BC5F8" strokeWidth="5" strokeLinecap="round"
          className="animate-draw-in"
        />
      )}

      {/* Right arm - error 4 */}
      {errors >= 4 && (
        <line
          x1="140" y1="115" x2="170" y2="140"
          stroke="#6BC5F8" strokeWidth="5" strokeLinecap="round"
          className="animate-draw-in"
        />
      )}

      {/* Left leg - error 5 */}
      {errors >= 5 && (
        <line
          x1="140" y1="160" x2="110" y2="200"
          stroke="#6BC5F8" strokeWidth="5" strokeLinecap="round"
          className="animate-draw-in"
        />
      )}

      {/* Right leg - error 6 */}
      {errors >= 6 && (
        <line
          x1="140" y1="160" x2="170" y2="200"
          stroke="#6BC5F8" strokeWidth="5" strokeLinecap="round"
          className="animate-draw-in"
        />
      )}
    </svg>
  );
});
