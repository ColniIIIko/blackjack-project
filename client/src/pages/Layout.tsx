import React from 'react';
import { Outlet } from 'react-router';

import Header from '@/components/Header/Header';

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default Layout;
