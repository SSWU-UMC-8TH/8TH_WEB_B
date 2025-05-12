import { createBrowserRouter, RouterProvider,RouteObject } from 'react-router-dom'
import './App.css'
import { HomePage }from './pages/HomePage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { LoginPage } from './pages/LoginPage'
import { HomeLayout } from './layouts/HomeLayout'
import { SignupPage } from './pages/SignupPage'
import { AuthProvider } from './context/AuthContext'
import NotFoundPage from './pages/NotFoundPage'
import { MyPage } from './pages/MyPage'
import { LpDetailPage } from './pages/LpDetail'
import { ProtectedLayout } from './layouts/ProtectedLayout'
import { GoogleLoginRedirectPage } from './pages/GoogleLoginRedirectPage'

const publicRouter: RouteObject[] = [
  {
    path: "/v1/auth/google/callback",
    element: <GoogleLoginRedirectPage />,
  },
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
    ]
  }
];

// 인증 필요한 페이지 protectedRoutes
const protectedRoutes:RouteObject[]=[
  {
    path:"/",
    element:<ProtectedLayout/>,
    errorElement: <NotFoundPage/>,
    children:[
      {
        path:"my",
        element:<MyPage/>
      },
      {
        path: 'lp/:id',
        element: <LpDetailPage />
      }
    ]
  }
]

const router=createBrowserRouter( [...publicRouter, ...protectedRoutes]);

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App
