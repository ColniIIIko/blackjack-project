import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Rooms from '@/pages/Rooms/Rooms';
import GameTable from '@/pages/GameTable/GameTable';
import Layout from '@/pages/Layout';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Rooms />,
      },
      {
        path: '/room/:id',
        element: <GameTable />,
      },
    ],
  },
]);

export default routes;
