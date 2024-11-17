import { useRouter, useRouterState } from '@tanstack/react-router';
import React, { useState } from 'react';
import { useLocalStorage } from '../utils/hooks';
import { AuthContext } from '../utils/contexts';
import Header from './Header';

const Root = ({ children }: { children: React.ReactNode }) => {
  const { getItem, setItem } = useLocalStorage('me');
  const [me, setMe] = useState(getItem());
  const router = useRouter();
  const routerState = useRouterState();

  const currentPath = routerState.location.pathname;
  if (!me && currentPath !== '/login') {
    router.navigate({ to: '/login' });
  }

  const setMeWrapper = (me: { id: number; username: string }) => {
    setItem(me);
    setMe(me);
  };

  return (
    <AuthContext.Provider value={{ me, setMe: setMeWrapper }}>
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', minWidth: '400px', maxWidth: '800px', height: '100%' }}>
          <div style={{ minHeight: '100%' }}>
            {currentPath !== '/login' && <Header />}
            <div style={{ height: 'calc(100vh - 60px)' }}>{children}</div>
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default Root;
