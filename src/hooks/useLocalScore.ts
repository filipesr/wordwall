import { useState, useEffect, useCallback } from 'react';

export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  category: string;
  date: string;
}

const STORAGE_KEY = 'hangman_scores';
const MAX_ENTRIES = 10;

let memoryCache: ScoreEntry[] | null = null;

function loadScores(): ScoreEntry[] {
  if (memoryCache !== null) {
    return memoryCache;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: ScoreEntry[] = JSON.parse(stored);
      memoryCache = parsed;
      return parsed;
    }
  } catch (e) {
    console.error('Error loading scores:', e);
  }
  memoryCache = [];
  return memoryCache;
}

function saveScores(scores: ScoreEntry[]) {
  memoryCache = scores;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch (e) {
    console.error('Error saving scores:', e);
  }
}

export function useLocalScore() {
  const [scores, setScores] = useState<ScoreEntry[]>(() => loadScores());

  useEffect(() => {
    saveScores(scores);
  }, [scores]);

  const addScore = useCallback((name: string, score: number, category: string) => {
    const newEntry: ScoreEntry = {
      id: Date.now().toString(),
      name,
      score,
      category,
      date: new Date().toLocaleDateString('pt-BR'),
    };

    setScores((prev) => {
      const updated = [...prev, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_ENTRIES);
      return updated;
    });
  }, []);

  const clearScores = useCallback(() => {
    setScores([]);
  }, []);

  return {
    scores,
    addScore,
    clearScores,
  };
}
