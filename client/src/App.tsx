import { RouterProvider } from 'react-router';

import routes from '@/routes';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { useSocketConnection } from '@/hooks/useSocketConnection';
import { useUpdateRooms } from '@/hooks/useUpdateRooms';
import { ASSET_PATHS } from '@/const';
import { socket } from '@/socket';
import { GlobalContext, globalStore } from '@/stores/GlobalStore';

import OverlayLoader from '@/components/OverlayLoader/OverlayLoader';

import './App.css';

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
