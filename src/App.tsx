import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CategorySelect } from './pages/CategorySelect';
import { GamePage } from './pages/GamePage';
import { RankingPage } from './pages/RankingPage';
import { MultiplayerLobby } from './pages/MultiplayerLobby';
import { MultiplayerGame } from './pages/MultiplayerGame';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/categorias" element={<CategorySelect />} />
        <Route path="/jogar/:category" element={<GamePage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/multiplayer" element={<MultiplayerLobby />} />
        <Route path="/multiplayer/game" element={<MultiplayerGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
