import { memo, useState } from 'react';
import { GAME_MODE_LABELS, type GameMode } from '../types/multiplayer';
import { categories, type Category } from '../data/words';

interface WaitingRoomProps {
  code: string;
  mode: GameMode;
  category: Category;
  onCancel: () => void;
}

export const WaitingRoom = memo(function WaitingRoom({
  code,
  mode,
  category,
  onCancel,
}: WaitingRoomProps) {
  const [copied, setCopied] = useState(false);
  const categoryInfo = categories.find(c => c.id === category);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Jogo da Forca - Multiplayer',
          text: `Entre na minha sala com o código: ${code}`,
          url: window.location.origin,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-creme flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h2 className="text-2xl font-bold text-marrom mb-2">
          Aguardando Jogador
        </h2>
        <p className="text-marrom-light mb-6">
          Compartilhe o código com seu amigo
        </p>

        {/* Room Code */}
        <div className="bg-amarelo-sol/20 rounded-2xl p-6 mb-6">
          <p className="text-sm text-marrom-light mb-2">Código da Sala</p>
          <p className="text-4xl font-mono font-bold text-marrom tracking-widest">
            {code}
          </p>
        </div>

        {/* Copy & Share buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleCopy}
            className="flex-1 bg-azul-ceu hover:bg-azul-ceu/80 text-white font-bold py-3 rounded-xl transition-all"
          >
            {copied ? '✓ Copiado!' : 'Copiar Código'}
          </button>
          {'share' in navigator && (
            <button
              onClick={handleShare}
              className="flex-1 bg-verde-menta hover:bg-verde-menta/80 text-white font-bold py-3 rounded-xl transition-all"
            >
              Compartilhar
            </button>
          )}
        </div>

        {/* Game info */}
        <div className="bg-gray-100 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{GAME_MODE_LABELS[mode].emoji}</span>
            <span className="font-bold text-marrom">{GAME_MODE_LABELS[mode].name}</span>
          </div>
          {categoryInfo && (
            <div className="flex items-center gap-2">
              <span className="text-xl">{categoryInfo.emoji}</span>
              <span className="text-marrom-light">{categoryInfo.name}</span>
            </div>
          )}
        </div>

        {/* Loading animation */}
        <div className="flex justify-center gap-2 mb-6">
          <div className="w-3 h-3 bg-rosa-chiclete rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-rosa-chiclete rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-rosa-chiclete rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        <button
          onClick={onCancel}
          className="text-rosa-chiclete hover:text-rosa-chiclete/70 font-semibold underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
});
