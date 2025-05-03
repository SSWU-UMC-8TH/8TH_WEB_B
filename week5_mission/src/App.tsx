import { createBrowserRouter, RouterProvider,RouteObject } from 'react-router-dom'
import './App.css'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LoginPage } from './pages/LoginPage'
import { HomeLayout } from './layouts/HomeLayout'
import { SignupPage } from './pages/SignupPage'
import { AuthProvider } from './context/AuthContext'
import { MyPage } from './pages/MyPage'
import { ProtectedLayout } from './layouts/ProtectedLayout'
import { GoogleLoginRedirectPage } from './pages/GoogleLoginRedirectPage'

const publicRouter: RouteObject[] = [
  {
    path:"/",
    element: <HomeLayout/>,  //elemet는 공유하는 레이아웃들 작성(즉, 고정적인 요소)
    errorElement: <NotFoundPage/>,
    children: [
      {index:true, element:<HomePage/>},
      {path: 'login', element:<LoginPage/>},
      {path: 'signup', element:<SignupPage/>},
      {path: "v1/auth/google/callback", element:<GoogleLoginRedirectPage/>},
    ]
  }
];

const protectedRoutes:RouteObject[]=[
  {
    path:"/",
    element:<ProtectedLayout/>,
    errorElement: <NotFoundPage/>,
    children:[
      {
        path:"my",
        element:<MyPage/>,
      }
    ]
  }
]
const router=createBrowserRouter( [...publicRouter, ...protectedRoutes]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router = {router}/>
    </AuthProvider>
  )

}

export default App
