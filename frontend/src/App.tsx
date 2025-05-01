import { FC } from 'react'

import Footer from './components/Footer'
import Header from './components/Header'
import AppProvider from './context/AppProvider'
import AppRouter from './router/AppRouter'

const App: FC = () => (
  <AppProvider>
    <Header />
    <AppRouter />
    <Footer />
  </AppProvider>
)

export default App
