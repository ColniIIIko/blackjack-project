import './App.css';
import GameTable from './components/GameTable/GameTable';
import OverlayLoader from './components/OverlayLoader/OverlayLoader';
import { useImagePreloader } from './hooks/useImagePreloader';
import { getCardsString } from './utils/cardsStrings';

const cardsPath = getCardsString().map((card) => `/src/assets/${card}.svg`);
const ASSET_PATHS = [...cardsPath, '/src/assets/back.svg'];

function App() {
  const { isLoading } = useImagePreloader(ASSET_PATHS);

  return <>{isLoading ? <OverlayLoader /> : <GameTable />}</>;
}

export default App;
