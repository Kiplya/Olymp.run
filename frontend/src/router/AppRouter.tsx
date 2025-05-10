import { FC } from 'react'
import { BrowserRouter } from 'react-router'

import AppRoutes from './AppRoutes'
import { publicRoutes, privateRoutes } from './routes'

import PageLayout from '../components/PageLayout'
import useAppSelector from '../hooks/useAppSelector'

const AppRouter: FC = () => {
  const isAuth = useAppSelector((state) => state.authSlice.isAuth)

  return (
    <BrowserRouter>
      <PageLayout>
        <AppRoutes routes={isAuth ? privateRoutes : publicRoutes} />
      </PageLayout>
    </BrowserRouter>
  )
}

export default AppRouter
