import { memo } from 'react';

interface WordDisplayProps {
  word: string;
  guessedLetters: Set<string>;
  revealed?: boolean;
}

export const WordDisplay = memo(function WordDisplay({ word, guessedLetters, revealed = false }: WordDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 my-6">
      {word.split('').map((letter, index) => {
        const isGuessed = guessedLetters.has(letter);
        const showLetter = isGuessed || revealed;

        return (
          <div
            key={index}
            className={`
              w-10 h-12 md:w-14 md:h-16
              flex items-center justify-center
              border-b-4 border-marrom
              text-2xl md:text-4xl font-bold
              ${showLetter ? 'text-marrom' : 'text-transparent'}
              ${revealed && !isGuessed ? 'text-rosa-chiclete' : ''}
              transition-all duration-300
            `}
          >
            {showLetter ? letter : '_'}
          </div>
        );
      })}
    </div>
  );
});
