import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CategorySelect } from './pages/CategorySelect';
import { GamePage } from './pages/GamePage';
import { RankingPage } from './pages/RankingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/categorias" element={<CategorySelect />} />
        <Route path="/jogar/:category" element={<GamePage />} />
        <Route path="/ranking" element={<RankingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
