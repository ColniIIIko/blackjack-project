import './App.css';
import GameTable from './components/GameTable/GameTable';
import OverlayLoader from './components/OverlayLoader/OverlayLoader';
import { useImagePreloader } from './hooks/useImagePreloader';
import { ASSET_PATHS } from './const';

function App() {
  const { isLoading } = useImagePreloader(ASSET_PATHS);

  return <>{isLoading ? <OverlayLoader /> : <GameTable />}</>;
}

export default App;
