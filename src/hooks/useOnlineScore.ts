import { useState, useEffect, useCallback } from 'react';
import { supabase, isOnline } from '../lib/supabase';

export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  category: string;
  date: string;
}

const MAX_ENTRIES = 50;

interface DbScore {
  id: string;
  player_name: string;
  score: number;
  category: string;
  created_at: string;
}

function mapScoreToEntry(score: DbScore): ScoreEntry {
  return {
    id: score.id,
    name: score.player_name,
    score: score.score,
    category: score.category,
    date: new Date(score.created_at).toLocaleDateString('pt-BR'),
  };
}

export function useOnlineScore() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnlineMode, setIsOnlineMode] = useState(false);

  const fetchScores = useCallback(async () => {
    if (!isOnline() || !supabase) {
      setIsOnlineMode(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(MAX_ENTRIES);

      if (fetchError) {
        throw fetchError;
      }

      setScores(data?.map(mapScoreToEntry) || []);
      setIsOnlineMode(true);
    } catch (err) {
      console.error('Error fetching scores:', err);
      setError('Erro ao carregar placar online');
      setIsOnlineMode(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const addScore = useCallback(async (name: string, score: number, category: string): Promise<boolean> => {
    if (!isOnline() || !supabase) {
      return false;
    }

    try {
      const { error: insertError } = await supabase
        .from('scores')
        .insert({
          player_name: name,
          score,
          category,
        });

      if (insertError) {
        throw insertError;
      }

      await fetchScores();
      return true;
    } catch (err) {
      console.error('Error saving score:', err);
      return false;
    }
  }, [fetchScores]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('scores-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scores',
        },
        (payload) => {
          const newScore = mapScoreToEntry(payload.new as DbScore);
          setScores((prev) => {
            const updated = [...prev, newScore]
              .sort((a, b) => b.score - a.score || new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, MAX_ENTRIES);
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return {
    scores,
    loading,
    error,
    isOnlineMode,
    addScore,
    refetch: fetchScores,
  };
}
