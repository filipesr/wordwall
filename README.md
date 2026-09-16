# WordWall

Jogo da forca online com salas multiplayer em tempo real: três modos de partida, quatro categorias de palavras e ranking. Feito com React, Vite e Supabase Realtime.

**Demo:** https://wordwall-seven.vercel.app

## Modos de jogo

| Modo | Como funciona |
| --- | --- |
| ⚔️ **Competitivo** | Os dois recebem a mesma palavra. Quem acertar primeiro vence. |
| 🤝 **Cooperativo** | Mesma palavra, turnos alternados. Ganham ou perdem juntos. |
| 🎯 **Desafiante** | Cada jogador escolhe a palavra que o outro vai adivinhar. |

Há também o modo solo: escolhe a categoria e joga contra a palavra.

## Multiplayer

O anfitrião cria a sala e recebe um **código de 6 caracteres** para passar ao convidado. Durante a partida, cada jogador vê o progresso do adversário em tempo real — quantas letras já saíram, quantos erros faltam para a forca fechar.

A sincronização usa canais do Supabase Realtime por sala, ouvindo `postgres_changes`. Não há servidor de jogo: o estado vive no banco e os dois clientes reagem às mudanças.

### O alfabeto do código de sala

```ts
const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
```

Faltam o `I`, o `O`, o `0` e o `1` de propósito. O código costuma ser ditado em voz alta ou por mensagem, e esses quatro são os que geram confusão — `I` com `1`, `O` com `0`. Removê-los custa pouca entropia e elimina a classe inteira de "digitei certo e não entrou".

## Categorias

🐾 Animais · 🍎 Frutas · 🎨 Cores · 🎁 Objetos

As palavras ficam em `src/data/words.ts`, sem acentuação — o teclado da tela tem 26 letras e comparar sem acento evita que *leão* exija uma tecla que não existe.

## Ranking

- **Placar local** para o jogo solo, guardado no navegador
- **Ranking online** com nome, pontuação e categoria, gravado no Supabase

## Stack

| Camada | Tecnologia |
| --- | --- |
| Build | Vite |
| UI | React, TypeScript |
| Rotas | React Router |
| Tempo real e dados | Supabase (PostgreSQL + Realtime) |
| Monetização | Google AdSense |
| Deploy | Vercel |

## Rodando localmente

```bash
pnpm install
pnpm dev
```

`.env.local`:

```
VITE_PUBLIC_SUPABASE_URL=
VITE_PUBLIC_SUPABASE_ANON_KEY=
```

O `src/lib/supabase.ts` aceita as duas convenções de nome — `VITE_PUBLIC_*`, que é o prefixo gerado pela integração Supabase da Vercel, e `VITE_*`, o padrão do Vite. Serve para o projeto funcionar sem renomear variável ao alternar entre local e deploy.

**Sem as variáveis o jogo não quebra:** o cliente é `SupabaseClient | null` e a aplicação degrada em vez de falhar. O modo solo e o placar local continuam funcionando; multiplayer e ranking online ficam indisponíveis, com aviso no console.

## Estrutura

```
src/
├── pages/        Landing, seleção de categoria, jogo, lobby, partida online, ranking
├── components/   Desenho da forca, teclado, palavra, progresso do oponente, sala de espera
├── hooks/        useGame, useMultiplayer, useLocalScore, useOnlineScore
├── data/         Palavras por categoria
└── types/        Tipos do banco e do multiplayer
```
