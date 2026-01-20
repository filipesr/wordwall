import { Link } from 'react-router-dom';
import { categories } from '../data/words';

export function CategorySelect() {
  return (
    <div className="min-h-screen bg-creme flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Link
          to="/"
          className="text-roxo-uva hover:text-roxo-uva/70 font-semibold mb-6 inline-block"
        >
          ← Voltar
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-marrom text-center mb-8">
          Escolha uma <span className="text-rosa-chiclete">Categoria</span>
        </h1>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/jogar/${category.id}`}
              className={`${category.color} p-6 md:p-8 rounded-3xl shadow-lg transform hover:scale-105 transition-all duration-200 text-center`}
            >
              <span className="text-5xl md:text-6xl block mb-3">{category.emoji}</span>
              <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
                {category.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
