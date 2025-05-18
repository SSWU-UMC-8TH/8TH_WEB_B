import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { HomeLayout } from './layouts/HomeLayout';
import { SignupPage } from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext';
import { MyPage } from './pages/MyPage';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { GoogleLoginRedirectPage } from './pages/GoogleLoginRedirectPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LpDetailPage } from './pages/LpDetail';
import { WritePage } from './pages/WritePage';
import { PostDetailPage } from './pages/PostDetailPage';

const publicRouter: RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout />, // 공통 레이아웃
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'v1/auth/google/callback', element: <GoogleLoginRedirectPage /> },

    ],
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: 'my', element: <MyPage /> },
      { path: 'lps/:id', element: <LpDetailPage /> }, 
      { path: 'write', element: <WritePage /> },
      { path:"posts/:id", element:<PostDetailPage />},

    ],
  },
];

const router = createBrowserRouter([...publicRouter, ...protectedRoutes]);

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {/* 개발환경일 때만 Devtools를 켠다 */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
