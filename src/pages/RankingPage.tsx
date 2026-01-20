import { Link } from 'react-router-dom';
import { useLocalScore } from '../hooks/useLocalScore';

export function RankingPage() {
  const { scores, clearScores } = useLocalScore();

  return (
    <div className="min-h-screen bg-creme flex flex-col items-center p-4">
      <div className="max-w-2xl w-full">
        <Link
          to="/"
          className="text-roxo-uva hover:text-roxo-uva/70 font-semibold mb-6 inline-block"
        >
          ← Voltar
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-marrom text-center mb-8">
          Placar
        </h1>

        {scores.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <span className="text-6xl block mb-4">🏆</span>
            <p className="text-marrom text-lg">
              Nenhuma pontuacao ainda!
            </p>
            <p className="text-marrom/60 mt-2">
              Jogue para aparecer no placar.
            </p>
            <Link
              to="/categorias"
              className="inline-block mt-6 bg-rosa-chiclete hover:bg-rosa-chiclete/80 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              Jogar Agora
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile: Cards */}
            <div className="sm:hidden space-y-3">
              {scores.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`bg-white rounded-2xl shadow-md p-4 ${
                    index === 0 ? 'ring-2 ring-amarelo-sol' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl w-8 text-center">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && <span className="text-marrom font-bold text-lg">{index + 1}</span>}
                      </span>
                      <div>
                        <p className="text-marrom font-bold text-lg">{entry.name}</p>
                        <p className="text-marrom/60 text-sm">{entry.category}</p>
                      </div>
                    </div>
                    <div className="text-verde-menta font-bold text-xl">
                      {entry.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden sm:block bg-white rounded-3xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-amarelo-sol">
                  <tr>
                    <th className="py-4 px-4 text-left text-marrom font-bold">#</th>
                    <th className="py-4 px-4 text-left text-marrom font-bold">Nome</th>
                    <th className="py-4 px-4 text-center text-marrom font-bold">Categoria</th>
                    <th className="py-4 px-4 text-right text-marrom font-bold">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-gray-100 ${
                        index === 0 ? 'bg-amarelo-sol/20' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        {index === 0 && <span className="text-2xl">🥇</span>}
                        {index === 1 && <span className="text-2xl">🥈</span>}
                        {index === 2 && <span className="text-2xl">🥉</span>}
                        {index > 2 && <span className="text-marrom font-semibold">{index + 1}</span>}
                      </td>
                      <td className="py-4 px-4 text-marrom font-semibold">{entry.name}</td>
                      <td className="py-4 px-4 text-center text-marrom/70">{entry.category}</td>
                      <td className="py-4 px-4 text-right text-verde-menta font-bold text-lg">
                        {entry.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja limpar o placar?')) {
                    clearScores();
                  }
                }}
                className="text-rosa-chiclete hover:text-rosa-chiclete/70 font-semibold underline"
              >
                Limpar Placar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
