import { ReactElement } from 'react'

import AdminContest from '../pages/AdminContest'
import AdminTask from '../pages/AdminTask'
import Authorization from '../pages/Authorization'
import Contests from '../pages/Contests'

type AppRoute = {
  path: string
  element: ReactElement
  children?: AppRoute[]
}

export const privateRoutes: AppRoute[] = [{ path: '/contests', element: <Contests /> }]

export const publicRoutes: AppRoute[] = [{ path: '/login', element: <Authorization /> }]

export const adminRoutes: AppRoute[] = [
  { path: '/admin/contest', element: <AdminContest /> },
  { path: '/admin/task', element: <AdminTask /> },
]
