import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { type Category, categories } from '../data/words';
import { useGame } from '../hooks/useGame';
import { useLocalScore } from '../hooks/useLocalScore';
import { useOnlineScore } from '../hooks/useOnlineScore';
import { HangmanDrawing } from '../components/HangmanDrawing';
import { WordDisplay } from '../components/WordDisplay';
import { Keyboard } from '../components/Keyboard';
import { AdBanner } from '../components/AdBanner';

export function GamePage() {
  const { category } = useParams<{ category: Category }>();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addScore: addLocalScore } = useLocalScore();
  const { addScore: addOnlineScore } = useOnlineScore();

  const validCategory = categories.find((c) => c.id === category);

  const {
    word,
    guessedLetters,
    correctLetters,
    errors,
    status,
    score,
    guess,
    reset,
    maxErrors,
  } = useGame(category as Category);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter) && status === 'playing') {
        guess(letter);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [guess, status]);

  if (!validCategory) {
    return (
      <div className="min-h-screen bg-creme flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-marrom mb-4">Categoria nao encontrada</h1>
        <Link to="/categorias" className="text-roxo-uva hover:underline">
          Voltar para categorias
        </Link>
      </div>
    );
  }

  const handleSaveScore = async () => {
    if (playerName.trim() && score > 0 && !saving) {
      setSaving(true);
      const name = playerName.trim();
      const categoryName = validCategory.name;

      // Save locally (always works)
      addLocalScore(name, score, categoryName);

      // Try to save online (may fail if offline)
      await addOnlineScore(name, score, categoryName);

      setScoreSaved(true);
      setSaving(false);
    }
  };

  const handlePlayAgain = () => {
    reset();
    setPlayerName('');
    setScoreSaved(false);
  };

  return (
    <div className="min-h-screen bg-creme flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-4">
        <Link
          to="/categorias"
          className="text-roxo-uva hover:text-roxo-uva/70 font-semibold"
        >
          ← Voltar
        </Link>
        <div className={`${validCategory.color} px-4 py-2 rounded-full`}>
          <span className="text-white font-bold">
            {validCategory.emoji} {validCategory.name}
          </span>
        </div>
      </div>

      {/* Errors counter */}
      <div className="text-lg font-semibold text-marrom mb-2">
        Erros: <span className="text-rosa-chiclete">{errors}</span> / {maxErrors}
      </div>

      {/* Hangman drawing */}
      <HangmanDrawing errors={errors} />

      {/* Word display */}
      <WordDisplay
        word={word}
        guessedLetters={guessedLetters}
        revealed={status === 'lost'}
      />

      {/* Game over modal */}
      {status !== 'playing' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full text-center shadow-xl">
            {status === 'won' ? (
              <>
                <span className="text-6xl block mb-4">🎉</span>
                <h2 className="text-3xl font-bold text-verde-menta mb-2">Parabens!</h2>
                <p className="text-marrom mb-2">Voce acertou a palavra!</p>
                <p className="text-2xl font-bold text-amarelo-sol mb-4">
                  +{score} pontos
                </p>

                {!scoreSaved ? (
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      maxLength={15}
                      className="w-full px-4 py-3 rounded-xl border-2 border-amarelo-sol focus:outline-none focus:border-rosa-chiclete text-center text-lg"
                    />
                    <button
                      onClick={handleSaveScore}
                      disabled={!playerName.trim() || saving}
                      className="mt-3 w-full bg-verde-menta hover:bg-verde-menta/80 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      {saving ? 'Salvando...' : 'Salvar Pontuacao'}
                    </button>
                  </div>
                ) : (
                  <p className="text-verde-menta font-semibold mb-4">Pontuacao salva!</p>
                )}
              </>
            ) : (
              <>
                <span className="text-6xl block mb-4">😢</span>
                <h2 className="text-3xl font-bold text-rosa-chiclete mb-2">Que pena!</h2>
                <p className="text-marrom mb-2">A palavra era:</p>
                <p className="text-2xl font-bold text-marrom mb-4">{word}</p>
              </>
            )}

            {/* Banner de anúncio */}
            <div className="mb-4">
              <AdBanner slot="1719513331" format="rectangle" />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePlayAgain}
                className="flex-1 bg-azul-ceu hover:bg-azul-ceu/80 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Jogar Novamente
              </button>
              <button
                onClick={() => navigate('/categorias')}
                className="flex-1 bg-roxo-uva hover:bg-roxo-uva/80 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Mudar Categoria
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard */}
      <Keyboard
        guessedLetters={guessedLetters}
        correctLetters={correctLetters}
        onGuess={guess}
        disabled={status !== 'playing'}
      />
    </div>
  );
}
