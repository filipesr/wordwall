export type Category = 'animais' | 'frutas' | 'cores' | 'objetos';

export interface CategoryInfo {
  id: Category;
  name: string;
  emoji: string;
  color: string;
}

export const categories: CategoryInfo[] = [
  { id: 'animais', name: 'Animais', emoji: '🐾', color: 'bg-verde-menta' },
  { id: 'frutas', name: 'Frutas', emoji: '🍎', color: 'bg-rosa-chiclete' },
  { id: 'cores', name: 'Cores', emoji: '🎨', color: 'bg-azul-ceu' },
  { id: 'objetos', name: 'Objetos', emoji: '🎁', color: 'bg-laranja' },
];

export const words: Record<Category, string[]> = {
  animais: [
    'cachorro',
    'gato',
    'elefante',
    'girafa',
    'leao',
    'zebra',
    'macaco',
    'coelho',
    'tartaruga',
    'passaro',
    'peixe',
    'cavalo',
    'vaca',
    'porco',
    'galinha',
    'pato',
    'urso',
    'tigre',
    'lobo',
    'raposa',
  ],
  frutas: [
    'banana',
    'maca',
    'laranja',
    'uva',
    'morango',
    'abacaxi',
    'melancia',
    'manga',
    'pera',
    'limao',
    'cereja',
    'kiwi',
    'mamao',
    'goiaba',
    'pessego',
    'ameixa',
    'coco',
    'framboesa',
    'jabuticaba',
    'acerola',
  ],
  cores: [
    'vermelho',
    'azul',
    'amarelo',
    'verde',
    'roxo',
    'laranja',
    'rosa',
    'marrom',
    'preto',
    'branco',
    'cinza',
    'dourado',
    'prateado',
    'turquesa',
    'violeta',
  ],
  objetos: [
    'cadeira',
    'mesa',
    'bola',
    'carro',
    'boneca',
    'lapis',
    'livro',
    'relogio',
    'telefone',
    'computador',
    'televisao',
    'lampada',
    'cama',
    'sofa',
    'espelho',
    'janela',
    'porta',
    'chave',
    'oculos',
    'mochila',
  ],
};

export function getRandomWord(category: Category): string {
  const categoryWords = words[category];
  const randomIndex = Math.floor(Math.random() * categoryWords.length);
  return categoryWords[randomIndex].toUpperCase();
}
