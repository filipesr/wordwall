import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiplayer } from '../hooks/useMultiplayer';
import { HangmanDrawing } from '../components/HangmanDrawing';
import { WordDisplay } from '../components/WordDisplay';
import { Keyboard } from '../components/Keyboard';
import { OpponentProgress } from '../components/OpponentProgress';
import { GAME_MODE_LABELS } from '../types/multiplayer';
import { categories } from '../data/words';

const MAX_ERRORS = 6;

export function MultiplayerGame() {
  const navigate = useNavigate();
  const [customWord, setCustomWord] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const {
    room,
    myState,
    opponentState,
    isHost,
    isMyTurn,
    guess,
    setWord,
    leaveRoom,
  } = useMultiplayer();

  // Redirect if no room
  useEffect(() => {
    if (!room) {
      navigate('/multiplayer');
    }
  }, [room, navigate]);

  if (!room) {
    return null;
  }

  const word = room.word || '';
  const guessedLetters = new Set(myState?.guessed_letters || []);
  const correctLetters = new Set(
    [...guessedLetters].filter(l => word.includes(l))
  );
  const errors = myState?.errors || 0;

  const opponentName = isHost ? room.guest_name : room.host_name;
  const myName = isHost ? room.host_name : room.guest_name;
  const categoryInfo = categories.find(c => c.name === room.category);

  const isGameOver = room.status === 'finished' || myState?.finished;
  const iWon = myState?.won;
  const opponentWon = opponentState?.won;

  // Challenger mode: host needs to set word
  const needsToSetWord = room.mode === 'challenger' && isHost && !room.word;

  const handleSetWord = async () => {
    if (customWord.trim().length < 3) return;
    await setWord(customWord.trim(), customCategory || 'Personalizada');
  };

  const handleLeave = () => {
    leaveRoom();
    navigate('/multiplayer');
  };

  // Challenger mode: waiting for host to set word (guest view)
  if (room.mode === 'challenger' && !room.word && !isHost) {
    return (
      <div className="min-h-screen bg-creme flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-marrom mb-2">
            Modo Desafiante
          </h2>
          <p className="text-marrom/60 mb-6">
            <span className="font-bold">{room.host_name}</span> está escolhendo a palavra...
          </p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-rosa-chiclete rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-rosa-chiclete rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-rosa-chiclete rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Challenger mode: host sets the word
  if (needsToSetWord) {
    return (
      <div className="min-h-screen bg-creme flex flex-col items-center p-4">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-marrom text-center mb-6">
            Escolha a Palavra
          </h1>
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
            <p className="text-marrom/70 text-center">
              <span className="font-bold">{opponentName}</span> vai tentar adivinhar!
            </p>

            <div>
              <label className="block text-marrom font-bold mb-2">Palavra</label>
              <input
                type="text"
                value={customWord}
                onChange={(e) => setCustomWord(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                placeholder="Digite a palavra"
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border-2 border-amarelo-sol focus:outline-none focus:border-rosa-chiclete text-lg text-center uppercase tracking-widest"
              />
            </div>

            <div>
              <label className="block text-marrom font-bold mb-2">Dica (opcional)</label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Ex: Animal, Fruta, Filme..."
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-rosa-chiclete text-lg"
              />
            </div>

            <button
              onClick={handleSetWord}
              disabled={customWord.trim().length < 3}
              className="w-full bg-verde-menta hover:bg-verde-menta/80 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-xl transition-all"
            >
              Começar Jogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game over screen
  if (isGameOver) {
    let resultMessage = '';
    let resultEmoji = '';
    let resultColor = '';

    if (room.mode === 'cooperative') {
      if (iWon || opponentWon) {
        resultMessage = 'Vocês venceram juntos!';
        resultEmoji = '🎉';
        resultColor = 'text-verde-menta';
      } else {
        resultMessage = 'Vocês perderam...';
        resultEmoji = '😢';
        resultColor = 'text-rosa-chiclete';
      }
    } else {
      if (iWon) {
        resultMessage = 'Você venceu!';
        resultEmoji = '🏆';
        resultColor = 'text-verde-menta';
      } else if (opponentWon) {
        resultMessage = `${opponentName} venceu!`;
        resultEmoji = '😢';
        resultColor = 'text-rosa-chiclete';
      } else {
        resultMessage = 'Ninguém acertou...';
        resultEmoji = '💀';
        resultColor = 'text-marrom';
      }
    }

    return (
      <div className="min-h-screen bg-creme flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">{resultEmoji}</div>
          <h2 className={`text-3xl font-bold ${resultColor} mb-4`}>
            {resultMessage}
          </h2>
          <p className="text-marrom mb-2">A palavra era:</p>
          <p className="text-2xl font-bold text-marrom mb-6">{word}</p>

          <div className="flex gap-3">
            <button
              onClick={handleLeave}
              className="flex-1 bg-azul-ceu hover:bg-azul-ceu/80 text-white font-bold py-3 rounded-xl transition-all"
            >
              Nova Partida
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-roxo-uva hover:bg-roxo-uva/80 text-white font-bold py-3 rounded-xl transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-creme flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-2xl mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">{GAME_MODE_LABELS[room.mode].emoji}</span>
            <span className="text-marrom font-bold">{GAME_MODE_LABELS[room.mode].name}</span>
          </div>
          {categoryInfo && (
            <div className={`${categoryInfo.color} px-3 py-1 rounded-full`}>
              <span className="text-white font-bold text-sm">
                {categoryInfo.emoji} {categoryInfo.name}
              </span>
            </div>
          )}
          {room.category && !categoryInfo && (
            <div className="bg-roxo-uva px-3 py-1 rounded-full">
              <span className="text-white font-bold text-sm">
                {room.category}
              </span>
            </div>
          )}
        </div>

        {/* Turn indicator for cooperative mode */}
        {room.mode === 'cooperative' && (
          <div className={`mt-2 text-center py-2 rounded-xl ${isMyTurn ? 'bg-verde-menta/20 text-verde-menta' : 'bg-gray-200 text-marrom/60'}`}>
            {isMyTurn ? '🎮 Sua vez!' : `⏳ Vez de ${opponentName}`}
          </div>
        )}
      </div>

      {/* Opponent progress (for competitive mode) */}
      {room.mode === 'competitive' && opponentName && (
        <div className="w-full max-w-2xl mb-4">
          <OpponentProgress
            state={opponentState}
            name={opponentName}
            maxErrors={MAX_ERRORS}
          />
        </div>
      )}

      {/* My game area */}
      <div className="w-full max-w-2xl">
        {room.mode !== 'cooperative' && (
          <div className="text-center mb-2">
            <span className="text-marrom font-bold">{myName}</span>
            <span className="text-marrom/60 ml-2">
              Erros: <span className="text-rosa-chiclete">{errors}</span> / {MAX_ERRORS}
            </span>
          </div>
        )}

        {room.mode === 'cooperative' && (
          <div className="text-center mb-2">
            <span className="text-marrom/60">
              Erros da dupla: <span className="text-rosa-chiclete font-bold">{errors}</span> / {MAX_ERRORS}
            </span>
          </div>
        )}

        <HangmanDrawing errors={errors} />

        <WordDisplay
          word={word}
          guessedLetters={guessedLetters}
          revealed={false}
        />

        <Keyboard
          guessedLetters={guessedLetters}
          correctLetters={correctLetters}
          onGuess={guess}
          disabled={room.mode === 'cooperative' && !isMyTurn}
        />
      </div>
    </div>
  );
}
