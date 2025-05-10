import { FC } from 'react'

import { Provider } from 'react-redux'

import ApiController from './components/ApiController'
import Footer from './components/Footer'
import Header from './components/Header'
import AppRouter from './router/AppRouter'
import { setupStore } from './store/index'

const App: FC = () => (
  <Provider store={setupStore()}>
    <ApiController>
      <Header />
      <AppRouter />
      <Footer />
    </ApiController>
  </Provider>
)

export default App
