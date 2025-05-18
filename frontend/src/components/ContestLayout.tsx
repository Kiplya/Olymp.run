import { MAX_SCORE_FOR_TASK } from '@shared/apiTypes'
import { FC, useEffect, useState } from 'react'
import { Outlet, useParams, Navigate, useNavigate } from 'react-router'

import CommonButton from './CommonButton'
import Loader from './Loader'

import { useContestGetInfoQuery } from '../api/contestApi'
import cl from '../styles/contestLayout.module.css'
import { getTimeDiffString } from '../utils/common'

const ContestLayout: FC = () => {
  const { contestId, taskId } = useParams()
  const [timeLeft, setTimeLeft] = useState<string | 0>('')
  const { data, isError, isFetching } = useContestGetInfoQuery({ contestId: contestId! })
  const navigate = useNavigate()

  useEffect(() => {
    if (!data?.endTime) return

    const updateTimeLeft = () => setTimeLeft(getTimeDiffString(data.endTime))
    updateTimeLeft()

    const interval = setInterval(updateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [data?.endTime])

  if (isError || timeLeft === 0) return <Navigate to='/contests' replace />

  if (data && taskId) {
    const taskExists = data.tasks.some(({ task }) => task.id === taskId)
    if (!taskExists) return <Navigate to={`/contest/${contestId}`} replace />
  }

  return (
    <>
      {isFetching && (
        <div className={cl.loaderDiv}>
          <Loader />
        </div>
      )}

      {!isFetching && data && (
        <div className={cl.contestDiv}>
          <div className={cl.contestLayoutDiv}>
            <h1>{data.title}</h1>

            <div className={cl.contestInfoDiv}>
              <p>Счет: {data.participants[0].score}</p>
              <p>Завершение через {timeLeft}</p>
            </div>

            <div className={cl.taskButtonsDiv}>
              {data.tasks
                .slice()
                .sort((a, b) => a.order - b.order)
                .map(({ task, participantTasks, order }) => {
                  const score = participantTasks?.[0]?.score
                  let className

                  if (!score) {
                    className = ''
                  } else if (score !== 0 && score !== MAX_SCORE_FOR_TASK) {
                    className = cl.proccess
                  } else {
                    className = cl.completed
                  }

                  if (task.id === taskId) className += ` ${cl.selected}`

                  return (
                    <CommonButton
                      className={className}
                      key={order}
                      label={order.toString()}
                      type='button'
                      onClick={() => {
                        navigate(`${task.id}`)
                      }}
                    />
                  )
                })}
            </div>
          </div>

          <Outlet context={data.tasks.find((t) => t.task.id === taskId)?.task} />
        </div>
      )}
    </>
  )
}

export default ContestLayout
