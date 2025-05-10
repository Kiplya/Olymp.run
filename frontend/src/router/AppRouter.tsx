import { FC } from 'react'
import { BrowserRouter } from 'react-router'

import AppRoutes from './AppRoutes'
import { publicRoutes, privateRoutes, adminRoutes } from './routes'

import Footer from '../components/Footer'
import Header from '../components/Header'
import PageLayout from '../components/PageLayout'
import useAppSelector from '../hooks/useAppSelector'

const AppRouter: FC = () => {
  let routes = publicRoutes
  const isAuth = useAppSelector((state) => state.authSlice.isAuth)
  const isAdmin = useAppSelector((state) => state.authSlice.isAdmin)

  if (isAuth) {
    routes = isAdmin ? [...privateRoutes, ...adminRoutes] : privateRoutes
  }

  return (
    <BrowserRouter>
      <Header />
      <PageLayout>
        <AppRoutes routes={routes} />
      </PageLayout>
      <Footer />
    </BrowserRouter>
  )
}

export default AppRouter
