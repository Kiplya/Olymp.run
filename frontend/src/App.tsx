import { FC } from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import AuthController from './components/AuthController'
import AppRouter from './router/AppRouter'
import { setupStore } from './store/index'

const App: FC = () => (
  <Provider store={setupStore()}>
    <AuthController>
      <AppRouter />
      <ToastContainer hideProgressBar={true} autoClose={2000} position='bottom-center' />
    </AuthController>
  </Provider>
)

export default App
