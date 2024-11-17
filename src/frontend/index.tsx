import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import Root from './components/Root';
import ChatPage from './components/ChatPage';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';

const rootRoute = createRootRoute({
  component: () => (
    <Root>
      <Outlet />
    </Root>
  ),
});

const router = createRouter({
  routeTree: rootRoute.addChildren([
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: () => <HomePage />,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/login',
      component: () => <LoginPage />,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/chats/$chatId',
      component: () => <ChatPage />,
    }),
  ]),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 5, retryDelay: 1000 },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
