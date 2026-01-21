import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CategorySelect } from './pages/CategorySelect';
import { GamePage } from './pages/GamePage';
import { RankingPage } from './pages/RankingPage';
import { MultiplayerLobby } from './pages/MultiplayerLobby';
import { MultiplayerGame } from './pages/MultiplayerGame';
import { AdBanner } from './components/AdBanner';

function App() {
  return (
    <BrowserRouter>
      <div className="pb-14">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/categorias" element={<CategorySelect />} />
          <Route path="/jogar/:category" element={<GamePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/multiplayer" element={<MultiplayerLobby />} />
          <Route path="/multiplayer/game" element={<MultiplayerGame />} />
        </Routes>
      </div>

      {/* Banner fixo no rodapé */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <AdBanner slot="9490547363" format="horizontal" />
      </div>
    </BrowserRouter>
  );
}

export default App;
