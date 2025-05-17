import { ReactElement } from 'react'

import ContestLayout from '../components/ContestLayout'
import AdminContest from '../pages/AdminContest'
import AdminTask from '../pages/AdminTask'
import Authorization from '../pages/Authorization'
import Contests from '../pages/Contests'
import ContestTask from '../pages/ContestTask'

type AppRoute = {
  path: string
  element: ReactElement
  children?: AppRoute[]
}

export const privateRoutes: AppRoute[] = [
  { path: '/contests', element: <Contests /> },
  { path: '/contest/:contestId', element: <ContestLayout /> },
]

export const publicRoutes: AppRoute[] = [{ path: '/login', element: <Authorization /> }]

export const adminRoutes: AppRoute[] = [
  { path: '/admin/contest', element: <AdminContest /> },
  { path: '/admin/task', element: <AdminTask /> },
]
