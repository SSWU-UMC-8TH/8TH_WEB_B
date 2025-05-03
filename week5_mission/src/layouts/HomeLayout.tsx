import { Outlet } from 'react-router-dom'

export const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col">
        <nav></nav>
        <main className="flex-1">
            <Outlet/>
        </main>
        <footer></footer>
    </div>
  )
}
