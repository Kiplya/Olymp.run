import { FC } from 'react'
import { Outlet, useParams, Navigate } from 'react-router'

import Loader from './Loader'

import { useContestGetInfoQuery } from '../api/contestApi'
import cl from '../styles/contestLayout.module.css'

const ContestLayout: FC = () => {
  const { contestId } = useParams()
  const { data, isError, isFetching } = useContestGetInfoQuery({ contestId: contestId! })

  if (isError) {
    return <Navigate to='/contests' replace />
  }

  return (
    <>
      {isFetching && (
        <div className={cl.loaderDiv}>
          <Loader />
        </div>
      )}

      {!isFetching && data && (
        <>
          <div className={cl.contestLayoutDiv}>
            <p>
              <strong>{data.title}</strong>
            </p>
          </div>

          <Outlet />
        </>
      )}
    </>
  )
}

export default ContestLayout
