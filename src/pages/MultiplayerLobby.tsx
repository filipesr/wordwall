import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMultiplayer } from '../hooks/useMultiplayer';
import { categories, type Category } from '../data/words';
import { GAME_MODE_LABELS, type GameMode } from '../types/multiplayer';
import { WaitingRoom } from '../components/WaitingRoom';

type LobbyStep = 'choice' | 'create' | 'join' | 'waiting';

export function MultiplayerLobby() {
  const navigate = useNavigate();
  const [step, setStep] = useState<LobbyStep>('choice');
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [selectedMode, setSelectedMode] = useState<GameMode>('competitive');
  const [selectedCategory, setSelectedCategory] = useState<Category>('animais');
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const {
    room,
    loading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
  } = useMultiplayer();

  const handleCreateRoom = async () => {
    if (!name.trim()) return;
    const code = await createRoom(name.trim(), selectedMode, selectedCategory);
    if (code) {
      setCreatedCode(code);
      setStep('waiting');
    }
  };

  const handleJoinRoom = async () => {
    if (!name.trim() || !roomCode.trim()) return;
    const success = await joinRoom(roomCode.trim(), name.trim());
    if (success) {
      navigate('/multiplayer/game');
    }
  };

  const handleLeave = () => {
    leaveRoom();
    setStep('choice');
    setCreatedCode(null);
  };

  // If room is playing, redirect to game
  if (room?.status === 'playing') {
    navigate('/multiplayer/game');
    return null;
  }

  // Waiting room
  if (step === 'waiting' && createdCode) {
    return (
      <WaitingRoom
        code={createdCode}
        mode={selectedMode}
        category={selectedCategory}
        onCancel={handleLeave}
      />
    );
  }

  return (
    <div className="min-h-screen bg-creme flex flex-col items-center p-4">
      <div className="max-w-md w-full">
        <Link
          to="/"
          className="text-roxo-uva hover:text-roxo-uva/70 font-semibold mb-6 inline-block"
        >
          ← Voltar
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-marrom text-center mb-8">
          Jogar em <span className="text-rosa-chiclete">Dupla</span>
        </h1>

        {error && (
          <div className="bg-rosa-chiclete/20 text-rosa-chiclete p-4 rounded-2xl mb-6 text-center">
            {error}
          </div>
        )}

        {/* Step: Choice */}
        {step === 'choice' && (
          <div className="space-y-4">
            <button
              onClick={() => setStep('create')}
              className="w-full bg-verde-menta hover:bg-verde-menta/80 text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all transform hover:scale-105"
            >
              Criar Sala
            </button>
            <button
              onClick={() => setStep('join')}
              className="w-full bg-azul-ceu hover:bg-azul-ceu/80 text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all transform hover:scale-105"
            >
              Entrar com Código
            </button>
          </div>
        )}

        {/* Step: Create Room */}
        {step === 'create' && (
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
            <button
              onClick={() => setStep('choice')}
              className="text-roxo-uva hover:text-roxo-uva/70 font-semibold"
            >
              ← Voltar
            </button>

            <div>
              <label className="block text-marrom font-bold mb-2">Seu Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
                maxLength={15}
                className="w-full px-4 py-3 rounded-xl border-2 border-amarelo-sol focus:outline-none focus:border-rosa-chiclete text-lg"
              />
            </div>

            <div>
              <label className="block text-marrom font-bold mb-2">Modo de Jogo</label>
              <div className="space-y-2">
                {(Object.keys(GAME_MODE_LABELS) as GameMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedMode === mode
                        ? 'bg-roxo-uva text-white'
                        : 'bg-gray-100 text-marrom hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-2xl mr-2">{GAME_MODE_LABELS[mode].emoji}</span>
                    <span className="font-bold">{GAME_MODE_LABELS[mode].name}</span>
                    <p className={`text-sm mt-1 ${selectedMode === mode ? 'text-white/80' : 'text-marrom/60'}`}>
                      {GAME_MODE_LABELS[mode].description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {selectedMode !== 'challenger' && (
              <div>
                <label className="block text-marrom font-bold mb-2">Categoria</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        selectedCategory === cat.id
                          ? `${cat.color} text-white`
                          : 'bg-gray-100 text-marrom hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <p className="font-bold text-sm mt-1">{cat.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleCreateRoom}
              disabled={loading || !name.trim()}
              className="w-full bg-verde-menta hover:bg-verde-menta/80 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-xl transition-all"
            >
              {loading ? 'Criando...' : 'Criar Sala'}
            </button>
          </div>
        )}

        {/* Step: Join Room */}
        {step === 'join' && (
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
            <button
              onClick={() => setStep('choice')}
              className="text-roxo-uva hover:text-roxo-uva/70 font-semibold"
            >
              ← Voltar
            </button>

            <div>
              <label className="block text-marrom font-bold mb-2">Seu Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
                maxLength={15}
                className="w-full px-4 py-3 rounded-xl border-2 border-amarelo-sol focus:outline-none focus:border-rosa-chiclete text-lg"
              />
            </div>

            <div>
              <label className="block text-marrom font-bold mb-2">Código da Sala</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Ex: ABC123"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-amarelo-sol focus:outline-none focus:border-rosa-chiclete text-lg text-center font-mono tracking-widest uppercase"
              />
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={loading || !name.trim() || !roomCode.trim()}
              className="w-full bg-azul-ceu hover:bg-azul-ceu/80 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-xl transition-all"
            >
              {loading ? 'Entrando...' : 'Entrar na Sala'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
