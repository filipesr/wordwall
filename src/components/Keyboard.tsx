import { memo, useCallback } from 'react';

interface KeyboardProps {
  guessedLetters: Set<string>;
  correctLetters: Set<string>;
  onGuess: (letter: string) => void;
  disabled?: boolean;
}

interface KeyButtonProps {
  letter: string;
  isGuessed: boolean;
  isCorrect: boolean;
  onGuess: (letter: string) => void;
  disabled: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const getKeyStyle = (isGuessed: boolean, isCorrect: boolean) => {
  if (!isGuessed) {
    return 'bg-amarelo-sol hover:bg-amarelo-sol/80 text-marrom';
  }
  if (isCorrect) {
    return 'bg-verde-menta text-white';
  }
  return 'bg-gray-300 text-gray-500';
};

const KeyButton = memo(function KeyButton({ letter, isGuessed, isCorrect, onGuess, disabled }: KeyButtonProps) {
  const handleClick = useCallback(() => {
    onGuess(letter);
  }, [letter, onGuess]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isGuessed}
      className={`
        min-w-[2.75rem] min-h-[2.75rem] w-[8.5vw] h-[8.5vw]
        sm:w-10 sm:h-12
        md:w-12 md:h-14
        lg:w-14 lg:h-16
        max-w-14 max-h-16
        rounded-lg font-bold text-base sm:text-lg md:text-xl
        shadow-md
        transform active:scale-95
        transition-all duration-150
        disabled:cursor-not-allowed
        touch-manipulation
        ${getKeyStyle(isGuessed, isCorrect)}
      `}
    >
      {letter}
    </button>
  );
});

export const Keyboard = memo(function Keyboard({ guessedLetters, correctLetters, onGuess, disabled = false }: KeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-full max-w-lg mx-auto px-1">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 sm:gap-1.5 md:gap-2 justify-center">
          {row.map((letter) => (
            <KeyButton
              key={letter}
              letter={letter}
              isGuessed={guessedLetters.has(letter)}
              isCorrect={correctLetters.has(letter)}
              onGuess={onGuess}
              disabled={disabled}
            />
          ))}
        </div>
      ))}
    </div>
  );
});
