import { FC } from 'react'
import { Provider } from 'react-redux'

import ApiController from './components/ApiController'
import AppRouter from './router/AppRouter'
import { setupStore } from './store/index'

const App: FC = () => (
  <Provider store={setupStore()}>
    <ApiController>
      <AppRouter />
    </ApiController>
  </Provider>
)

export default App
