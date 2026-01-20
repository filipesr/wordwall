import { useState, useCallback, useMemo } from 'react';
import { type Category, getRandomWord } from '../data/words';

const MAX_ERRORS = 6;

export type GameStatus = 'playing' | 'won' | 'lost';

export function useGame(category: Category) {
  const [word, setWord] = useState(() => getRandomWord(category));
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());

  const correctLetters = useMemo(() => {
    return new Set([...guessedLetters].filter((letter) => word.includes(letter)));
  }, [guessedLetters, word]);

  const errors = useMemo(() => {
    return [...guessedLetters].filter((letter) => !word.includes(letter)).length;
  }, [guessedLetters, word]);

  const status: GameStatus = useMemo(() => {
    const wordLetters = new Set(word.split(''));
    const allLettersGuessed = [...wordLetters].every((letter) => guessedLetters.has(letter));

    if (allLettersGuessed) return 'won';
    if (errors >= MAX_ERRORS) return 'lost';
    return 'playing';
  }, [word, guessedLetters, errors]);

  const score = useMemo(() => {
    if (status !== 'won') return 0;
    return Math.max(0, 100 - errors * 10);
  }, [status, errors]);

  const guess = useCallback((letter: string) => {
    if (status !== 'playing') return;
    setGuessedLetters((prev) => new Set([...prev, letter.toUpperCase()]));
  }, [status]);

  const reset = useCallback(() => {
    setWord(getRandomWord(category));
    setGuessedLetters(new Set());
  }, [category]);

  return {
    word,
    guessedLetters,
    correctLetters,
    errors,
    status,
    score,
    guess,
    reset,
    maxErrors: MAX_ERRORS,
  };
}
