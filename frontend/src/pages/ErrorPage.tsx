import { FC } from 'react'

import cl from '../styles/errorPage.module.css'

const ErrorPage: FC = () => (
  <div className={cl.errorDiv}>
    <h1>Something went wrong :{`(`}</h1>
  </div>
)

export default ErrorPage
