import { FC } from 'react'
import { Outlet, useLocation, Navigate } from 'react-router'

import Footer from './Footer'
import Header from './Header'
import PageLayout from './PageLayout'
import ScrollToTopButton from './ScrollToTopButton'

import useAppSelector from '../hooks/useAppSelector'

const RouterLayout: FC = () => {
  const isAuth = useAppSelector((state) => state.authSlice.isAuth)
  const location = useLocation()

  if (!isAuth && location.pathname !== '/login') {
    return <Navigate to='/login' replace />
  }

  if (isAuth && location.pathname === '/login') {
    return <Navigate to='/contests' replace />
  }

  return (
    <>
      <Header />
      <PageLayout>
        <Outlet />
      </PageLayout>
      <Footer />
      <ScrollToTopButton />
    </>
  )
}

export default RouterLayout
