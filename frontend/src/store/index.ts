import { combineReducers, configureStore } from '@reduxjs/toolkit'

import authSlice from './reducers/AuthSlice'

import { contestApi } from '../api/contestApi'
import { taskApi } from '../api/taskApi'
import { userApi } from '../api/userApi'

const isDev = import.meta.env.MODE === 'development'

const rootReducer = combineReducers({
  authSlice,
  [userApi.reducerPath]: userApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
  [contestApi.reducerPath]: contestApi.reducer,
})

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    devTools: isDev,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userApi.middleware).concat(taskApi.middleware).concat(contestApi.middleware),
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
