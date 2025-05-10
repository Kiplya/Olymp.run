import { ReactElement } from 'react'

import AdminPanel from '../pages/AdminPanel'
import Authorization from '../pages/Authorization'
import Contests from '../pages/Contests'

type AppRoute = {
  path: string
  element: ReactElement
}

export const privateRoutes: AppRoute[] = [{ path: '/contests', element: <Contests /> }]

export const publicRoutes: AppRoute[] = [{ path: '/login', element: <Authorization /> }]

export const adminRoutes: AppRoute[] = [{ path: '/admin', element: <AdminPanel /> }]
