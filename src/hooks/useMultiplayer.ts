import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { GameRoom, GameState, GameMode } from '../types/multiplayer';
import { generateRoomCode } from '../types/multiplayer';
import { getRandomWord, type Category } from '../data/words';

const MAX_ERRORS = 6;
const STORAGE_KEY = 'hangman_player_id';
const ROOM_KEY = 'hangman_room_id';

export function useMultiplayer() {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [myState, setMyState] = useState<GameState | null>(null);
  const [opponentState, setOpponentState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const channelRef = useRef<ReturnType<NonNullable<typeof supabase>['channel']> | null>(null);

  const isHost = room?.host_id === playerId;
  const isMyTurn = room?.mode === 'cooperative'
    ? (myState?.guessed_letters.length || 0) <= (opponentState?.guessed_letters.length || 0)
    : true;

  // Helpers para modo desafiante
  // Palavra que EU preciso adivinhar (do oponente)
  const wordToGuess = room?.mode === 'challenger'
    ? (isHost ? room.guest_word : room.host_word)
    : room?.word;

  // Categoria da palavra que EU preciso adivinhar
  const categoryToGuess = room?.mode === 'challenger'
    ? (isHost ? room.guest_category : room.host_category)
    : room?.category;

  // Minha palavra (que o oponente precisa adivinhar) - para verificar se ja defini
  const myWordSet = room?.mode === 'challenger'
    ? (isHost ? room.host_word : room.guest_word)
    : null;

  // Load player ID and restore room from storage
  useEffect(() => {
    const storedPlayerId = localStorage.getItem(STORAGE_KEY);
    const storedRoomId = sessionStorage.getItem(ROOM_KEY);

    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    }

    // Restore room if we have both player and room IDs
    if (storedPlayerId && storedRoomId && supabase) {
      (async () => {
        try {
          const { data } = await supabase
            .from('game_rooms')
            .select()
            .eq('id', storedRoomId)
            .single();

          if (data && data.status !== 'finished') {
            setRoom(data);
          } else {
            sessionStorage.removeItem(ROOM_KEY);
          }
        } catch {
          sessionStorage.removeItem(ROOM_KEY);
        } finally {
          setInitialized(true);
        }
      })();
    } else {
      setInitialized(true);
    }
  }, []);

  // Save room ID to session storage when it changes
  useEffect(() => {
    if (room?.id) {
      sessionStorage.setItem(ROOM_KEY, room.id);
    }
  }, [room?.id]);

  // Timer for elapsed game time
  useEffect(() => {
    if (room?.status !== 'playing') {
      setElapsedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [room?.status]);

  // Create player in database
  const createPlayer = useCallback(async (name: string): Promise<string | null> => {
    if (!supabase) return null;

    try {
      const { data, error: insertError } = await supabase
        .from('players')
        .insert({ display_name: name })
        .select('id')
        .single();

      if (insertError) throw insertError;

      const id = data.id;
      localStorage.setItem(STORAGE_KEY, id);
      setPlayerId(id);
      setPlayerName(name);
      return id;
    } catch (err) {
      console.error('Error creating player:', err);
      return null;
    }
  }, []);

  // Create a new room
  const createRoom = useCallback(async (
    name: string,
    mode: GameMode,
    category: Category
  ): Promise<string | null> => {
    if (!supabase) {
      setError('Conexão não disponível');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      let currentPlayerId = playerId;
      if (!currentPlayerId) {
        currentPlayerId = await createPlayer(name);
        if (!currentPlayerId) throw new Error('Failed to create player');
      }

      const code = generateRoomCode();
      const word = mode === 'challenger' ? null : getRandomWord(category);

      const { data: roomData, error: roomError } = await supabase
        .from('game_rooms')
        .insert({
          code,
          host_id: currentPlayerId,
          host_name: name,
          mode,
          word,
          category,
          status: 'waiting',
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Create initial game state for host
      const { error: stateError } = await supabase
        .from('game_state')
        .insert({
          room_id: roomData.id,
          player_id: currentPlayerId,
          guessed_letters: [],
          errors: 0,
        });

      if (stateError) throw stateError;

      setRoom(roomData);
      setPlayerName(name);
      return code;
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Erro ao criar sala');
      return null;
    } finally {
      setLoading(false);
    }
  }, [playerId, createPlayer]);

  // Join an existing room
  const joinRoom = useCallback(async (code: string, name: string): Promise<boolean> => {
    if (!supabase) {
      setError('Conexão não disponível');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      let currentPlayerId = playerId;
      if (!currentPlayerId) {
        currentPlayerId = await createPlayer(name);
        if (!currentPlayerId) throw new Error('Failed to create player');
      }

      // Find the room
      const { data: roomData, error: findError } = await supabase
        .from('game_rooms')
        .select()
        .eq('code', code.toUpperCase())
        .single();

      if (findError || !roomData) {
        setError('Sala não encontrada');
        return false;
      }

      if (roomData.status !== 'waiting') {
        setError('Esta sala já está em jogo');
        return false;
      }

      if (roomData.guest_id) {
        setError('Esta sala já está cheia');
        return false;
      }

      // Update room with guest
      // No modo challenger, nao muda para 'playing' ainda (ambos precisam definir palavras)
      const newStatus = roomData.mode === 'challenger' ? 'waiting' : 'playing';
      const { data: updatedRoom, error: updateError } = await supabase
        .from('game_rooms')
        .update({
          guest_id: currentPlayerId,
          guest_name: name,
          status: newStatus,
        })
        .eq('id', roomData.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Create game state for guest
      const { error: stateError } = await supabase
        .from('game_state')
        .insert({
          room_id: roomData.id,
          player_id: currentPlayerId,
          guessed_letters: [],
          errors: 0,
        });

      if (stateError) throw stateError;

      setRoom(updatedRoom);
      setPlayerName(name);
      return true;
    } catch (err) {
      console.error('Error joining room:', err);
      setError('Erro ao entrar na sala');
      return false;
    } finally {
      setLoading(false);
    }
  }, [playerId, createPlayer]);

  // Set word (for challenger mode - each player sets word for opponent)
  const setWord = useCallback(async (word: string, category: string): Promise<boolean> => {
    if (!supabase || !room || !playerId) return false;

    try {
      // No modo desafiante, cada jogador define a palavra que o outro vai adivinhar
      const updateData: Record<string, string> = isHost
        ? { host_word: word.toUpperCase(), host_category: category }
        : { guest_word: word.toUpperCase(), guest_category: category };

      // Verificar se o outro jogador ja definiu a palavra
      const opponentWordSet = isHost ? room.guest_word : room.host_word;

      // Se ambos definiram, iniciar o jogo
      if (opponentWordSet) {
        Object.assign(updateData, { status: 'playing' });
      }

      const { error: updateError } = await supabase
        .from('game_rooms')
        .update(updateData)
        .eq('id', room.id);

      if (updateError) throw updateError;
      return true;
    } catch (err) {
      console.error('Error setting word:', err);
      return false;
    }
  }, [room, playerId, isHost]);

  // Make a guess
  const guess = useCallback(async (letter: string): Promise<void> => {
    if (!supabase || !room || !myState || !playerId) return;
    if (room.status !== 'playing') return;

    const upperLetter = letter.toUpperCase();
    if (myState.guessed_letters.includes(upperLetter)) return;

    // In cooperative mode, check if it's my turn
    if (room.mode === 'cooperative' && !isMyTurn) return;

    // Determinar qual palavra eu estou adivinhando
    // No modo desafiante: host adivinha guest_word, guest adivinha host_word
    const wordToGuess = room.mode === 'challenger'
      ? (isHost ? room.guest_word : room.host_word)
      : room.word;

    const newGuessedLetters = [...myState.guessed_letters, upperLetter];
    const isCorrect = wordToGuess?.includes(upperLetter);
    const newErrors = isCorrect ? myState.errors : myState.errors + 1;

    // Check win/loss
    const wordLetters = new Set(wordToGuess?.split('') || []);
    const guessedSet = new Set(newGuessedLetters);
    const allLettersGuessed = [...wordLetters].every(l => guessedSet.has(l));
    const isLost = newErrors >= MAX_ERRORS;
    const isWon = allLettersGuessed && !isLost;

    try {
      // Update my state
      await supabase
        .from('game_state')
        .update({
          guessed_letters: newGuessedLetters,
          errors: newErrors,
          finished: isWon || isLost,
          won: isWon,
        })
        .eq('room_id', room.id)
        .eq('player_id', playerId);

      // In cooperative mode, also update opponent's guessed letters
      if (room.mode === 'cooperative' && opponentState) {
        await supabase
          .from('game_state')
          .update({
            guessed_letters: newGuessedLetters,
            errors: newErrors,
            finished: isWon || isLost,
            won: isWon,
          })
          .eq('room_id', room.id)
          .eq('player_id', room.host_id === playerId ? room.guest_id : room.host_id);
      }

      // Update room status if game ended
      if (isWon || isLost) {
        // No modo competitivo e desafiante, quem acerta primeiro vence
        const winnerId = isWon ? (room.mode === 'cooperative' ? null : playerId) : null;
        await supabase
          .from('game_rooms')
          .update({
            status: 'finished',
            winner_id: winnerId,
          })
          .eq('id', room.id);
      }
    } catch (err) {
      console.error('Error making guess:', err);
    }
  }, [room, myState, opponentState, playerId, isMyTurn]);

  // Subscribe to room changes
  const subscribeToRoom = useCallback((roomId: string) => {
    if (!supabase) return;

    // Unsubscribe from previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setRoom(payload.new as GameRoom);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_state',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const state = payload.new as GameState;
          if (state.player_id === playerId) {
            setMyState(state);
          } else {
            setOpponentState(state);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, [playerId]);

  // Fetch room and states
  const fetchRoomData = useCallback(async (roomId: string) => {
    if (!supabase || !playerId) return;

    try {
      // Fetch room
      const { data: roomData } = await supabase
        .from('game_rooms')
        .select()
        .eq('id', roomId)
        .single();

      if (roomData) {
        setRoom(roomData);
      }

      // Fetch game states
      const { data: states } = await supabase
        .from('game_state')
        .select()
        .eq('room_id', roomId);

      if (states) {
        const mine = states.find(s => s.player_id === playerId);
        const opponent = states.find(s => s.player_id !== playerId);
        if (mine) setMyState(mine);
        if (opponent) setOpponentState(opponent);
      }
    } catch (err) {
      console.error('Error fetching room data:', err);
    }
  }, [playerId]);

  // When room changes, subscribe to updates
  useEffect(() => {
    if (room?.id && playerId) {
      subscribeToRoom(room.id);
      fetchRoomData(room.id);
    }

    return () => {
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [room?.id, playerId, subscribeToRoom, fetchRoomData]);

  // Leave room
  const leaveRoom = useCallback(() => {
    if (channelRef.current && supabase) {
      supabase.removeChannel(channelRef.current);
    }
    sessionStorage.removeItem(ROOM_KEY);
    setRoom(null);
    setMyState(null);
    setOpponentState(null);
    setError(null);
  }, []);

  return {
    room,
    myState,
    opponentState,
    playerId,
    playerName,
    isHost,
    isMyTurn,
    loading,
    error,
    initialized,
    elapsedSeconds,
    wordToGuess,
    categoryToGuess,
    myWordSet,
    createRoom,
    joinRoom,
    setWord,
    guess,
    leaveRoom,
    setPlayerName,
  };
}
