import Authorization from '../pages/Authorization'
import Contests from '../pages/Contests'

export const privateRoutes = [{ path: '/contests', element: <Contests /> }]

export const publicRoutes = [{ path: '/login', element: <Authorization /> }]
