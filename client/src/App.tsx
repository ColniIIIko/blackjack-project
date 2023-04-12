import './App.css';
import GameTable from './components/GameTable/GameTable';
import OverlayLoader from './components/OverlayLoader/OverlayLoader';
import { useImagePreloader } from './hooks/useImagePreloader';
import { ASSET_PATHS } from './const';
import { UserContext, userStore } from './stores/UserStore/UserStore';
import Header from './components/Header/Header';
import { useSocketConnection } from './hooks/useSocketConnection';
import { socket } from './socket';

function App() {
  const { isLoading } = useImagePreloader(ASSET_PATHS);
  const { isConnected } = useSocketConnection(socket);

  return (
    <UserContext.Provider value={userStore}>
      {isLoading || !isConnected ? (
        <OverlayLoader />
      ) : (
        <>
          <Header />
          <GameTable />
        </>
      )}
    </UserContext.Provider>
  );
}

export default App;
