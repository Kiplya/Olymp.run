import { FC, ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router'

import useAppSelector from '../hooks/useAppSelector'

type RouteConfig = {
  path: string
  element: ReactElement
}

interface AppRoutesProps {
  routes: RouteConfig[]
}

const AppRoutes: FC<AppRoutesProps> = ({ routes }) => {
  const isAuth = useAppSelector((state) => state.authSlice.isAuth)

  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      <Route path='*' element={<Navigate to={isAuth ? '/contests' : '/login'} replace />} />
    </Routes>
  )
}

export default AppRoutes
