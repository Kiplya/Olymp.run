import { FC } from 'react'
import { Provider } from 'react-redux'

import AuthController from './components/AuthController'
import AppRouter from './router/AppRouter'
import { setupStore } from './store/index'

const App: FC = () => (
  <Provider store={setupStore()}>
    <AuthController>
      <AppRouter />
    </AuthController>
  </Provider>
)

export default App
