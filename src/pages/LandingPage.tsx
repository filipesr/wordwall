import { Link } from 'react-router-dom';

const hangmanIllustration = (
  <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
    <line x1="20" y1="180" x2="100" y2="180" stroke="#5D4E37" strokeWidth="4" strokeLinecap="round" />
    <line x1="60" y1="180" x2="60" y2="20" stroke="#5D4E37" strokeWidth="4" strokeLinecap="round" />
    <line x1="60" y1="20" x2="140" y2="20" stroke="#5D4E37" strokeWidth="4" strokeLinecap="round" />
    <line x1="140" y1="20" x2="140" y2="40" stroke="#5D4E37" strokeWidth="3" strokeLinecap="round" />
    <circle cx="140" cy="60" r="20" fill="#FFD93D" stroke="#5D4E37" strokeWidth="2" />
    <circle cx="133" cy="55" r="3" fill="#5D4E37" />
    <circle cx="147" cy="55" r="3" fill="#5D4E37" />
    <path d="M 130 67 Q 140 77 150 67" stroke="#5D4E37" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

export function LandingPage() {
  return (
    <div className="min-h-screen bg-creme flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-marrom mb-4">
          Jogo da <span className="text-rosa-chiclete">Forca</span>
        </h1>

        {/* Hangman illustration */}
        <div className="my-8">
          {hangmanIllustration}
        </div>

        {/* How to play section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-roxo-uva mb-6">
            Como Jogar
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex flex-col items-center text-center p-4 bg-amarelo-sol/20 rounded-2xl">
              <span className="text-4xl mb-3">1️⃣</span>
              <h3 className="font-bold text-lg text-marrom mb-2">Escolha uma Categoria</h3>
              <p className="text-marrom/70">Animais, frutas, cores ou objetos!</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-azul-ceu/20 rounded-2xl">
              <span className="text-4xl mb-3">2️⃣</span>
              <h3 className="font-bold text-lg text-marrom mb-2">Adivinhe as Letras</h3>
              <p className="text-marrom/70">Clique nas letras para descobrir a palavra secreta!</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-verde-menta/20 rounded-2xl">
              <span className="text-4xl mb-3">3️⃣</span>
              <h3 className="font-bold text-lg text-marrom mb-2">Cuidado com os Erros!</h3>
              <p className="text-marrom/70">Voce tem 6 chances. Nao deixe o boneco completar!</p>
            </div>
          </div>
        </div>

        {/* Play buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/categorias"
            className="inline-block bg-rosa-chiclete hover:bg-rosa-chiclete/80 text-white text-xl sm:text-2xl font-bold py-4 px-8 sm:px-12 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Jogar Solo
          </Link>
          <Link
            to="/multiplayer"
            className="inline-block bg-azul-ceu hover:bg-azul-ceu/80 text-white text-xl sm:text-2xl font-bold py-4 px-8 sm:px-12 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Jogar em Dupla
          </Link>
        </div>

        {/* Ranking link */}
        <div className="mt-6">
          <Link
            to="/ranking"
            className="text-roxo-uva hover:text-roxo-uva/70 font-semibold underline"
          >
            Ver Placar
          </Link>
        </div>
      </div>
    </div>
  );
}
