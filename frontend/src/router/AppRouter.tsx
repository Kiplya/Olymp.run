import { FC } from 'react'
import { BrowserRouter } from 'react-router'

import AppRoutes from './AppRoutes'
import { publicRoutes, privateRoutes } from './routes'

import PageLayout from '../components/PageLayout'

import { useAuth } from '../context/AuthContext'

const AppRouter: FC = () => {
  const { isAuth } = useAuth()

  return (
    <BrowserRouter>
      <PageLayout>
        <AppRoutes routes={isAuth ? privateRoutes : publicRoutes} />
      </PageLayout>
    </BrowserRouter>
  )
}

export default AppRouter
