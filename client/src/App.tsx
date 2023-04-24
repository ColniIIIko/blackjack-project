import './App.css';
import OverlayLoader from './components/OverlayLoader/OverlayLoader';
import { useImagePreloader } from './hooks/useImagePreloader';
import { ASSET_PATHS } from './const';
import { useSocketConnection } from './hooks/useSocketConnection';
import { RouterProvider } from 'react-router';
import { socket } from './socket';
import routes from './routes';
import { GlobalContext, globalStore } from './stores/GlobalStore';
import { useUpdateRooms } from './hooks/useUpdateRooms';

function App() {
  const { isLoading } = useImagePreloader(ASSET_PATHS);
  const { isConnected } = useSocketConnection(socket);
  useUpdateRooms();

  return (
    <GlobalContext.Provider value={globalStore}>
      {isLoading || !isConnected ? <OverlayLoader /> : <RouterProvider router={routes} />}
    </GlobalContext.Provider>
  );
}

export default App;
