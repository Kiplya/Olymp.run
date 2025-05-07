import { FC } from 'react'

import ApiController from './components/ApiController'
import Footer from './components/Footer'
import Header from './components/Header'
import StoreProvider from './context/StoreProvider'
import AppRouter from './router/AppRouter'

const App: FC = () => (
  <StoreProvider>
    <ApiController>
      <Header />
      <AppRouter />
      <Footer />
    </ApiController>
  </StoreProvider>
)

export default App
