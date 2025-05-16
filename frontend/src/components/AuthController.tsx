import { FC, ReactNode } from 'react'

import Loader from './Loader'

import { useCheckAdminQuery, useCheckAuthQuery } from '../api/userApi'

import cl from '../styles/loader.module.css'

interface AuthControllerProps {
  children: ReactNode
}

const AuthController: FC<AuthControllerProps> = ({ children }) => {
  const { isFetching: isAuthFetching } = useCheckAuthQuery()
  const { isFetching: isAdminFetching } = useCheckAdminQuery()

  return (
    <>
      {isAdminFetching || isAuthFetching ? (
        <div className={cl.loaderDiv}>
          <Loader />
        </div>
      ) : (
        children
      )}
    </>
  )
}

export default AuthController
