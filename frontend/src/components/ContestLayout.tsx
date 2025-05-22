import { MAX_SCORE_FOR_TASK, TypeAllowedCompilerIds } from '@shared/apiTypes'
import { FC, useCallback, useEffect, useState } from 'react'
import { Outlet, useParams, Navigate, useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import CommonButton from './CommonButton'
import Loader from './Loader'

import { useContestGetInfoQuery, useContestSolutionSubmitMutation } from '../api/contestApi'
import cl from '../styles/contestLayout.module.css'
import { isErrorMessage } from '../utils/assertions'
import { getTimeDiffString } from '../utils/common'

const ContestLayout: FC = () => {
  const [solutions, setSolutions] = useState<Record<string, { solution: string; compiler: TypeAllowedCompilerIds }>>({})
  const { contestId, taskId } = useParams()
  const [timeLeft, setTimeLeft] = useState<string | 0>('')
  const navigate = useNavigate()
  const {
    data: dataInfo,
    isError: isErrorInfo,
    isFetching: isFetchingInfo,
    refetch: refetchInfo,
  } = useContestGetInfoQuery({ contestId: contestId! })

  const [
    contestSubmitMutation,
    {
      data: dataSubmit,
      isLoading: isLoadingSubmit,
      isError: isErrorSubmit,
      error: errorSubmit,
      isSuccess: isSuccessSubmit,
    },
  ] = useContestSolutionSubmitMutation()

  useEffect(() => {
    const stored = localStorage.getItem(`contest-${contestId}-solutions`)
    if (stored) {
      try {
        setSolutions(JSON.parse(stored))
      } catch {
        console.warn('Error during parse localStorage')
      }
    }
  }, [contestId])

  useEffect(() => {
    localStorage.setItem(`contest-${contestId}-solutions`, JSON.stringify(solutions))
  }, [solutions, contestId])

  const updateTaskState = useCallback(
    (taskId: string, newData: { solution?: string; compiler?: TypeAllowedCompilerIds }) => {
      setSolutions((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          ...newData,
        },
      }))
    },
    [],
  )

  useEffect(() => {
    if (!isErrorSubmit) return
    toast.error(isErrorMessage(errorSubmit) ? errorSubmit.data.message : 'Unknown error')
  }, [errorSubmit, isErrorSubmit])

  useEffect(() => {
    if (!isSuccessSubmit) return

    if (dataSubmit?.score === MAX_SCORE_FOR_TASK) {
      toast.success(dataSubmit?.message)
    } else {
      toast.warn(dataSubmit?.message)
    }
  }, [dataSubmit?.score, dataSubmit?.message, isSuccessSubmit])

  useEffect(() => {
    if (!dataSubmit) return
    refetchInfo()
  }, [dataSubmit, refetchInfo])

  useEffect(() => {
    if (!dataInfo?.endTime) return

    const updateTimeLeft = () => setTimeLeft(getTimeDiffString(dataInfo.endTime))
    updateTimeLeft()

    const interval = setInterval(updateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [dataInfo?.endTime])

  if (isErrorInfo || timeLeft === 0) return <Navigate to='/contests' replace />

  if (dataInfo && taskId) {
    const taskExists = dataInfo.tasks.some(({ task }) => task.id === taskId)
    if (!taskExists) return <Navigate to={`/contest/${contestId}`} replace />
  }

  return (
    <>
      {isFetchingInfo && (
        <div className={cl.loaderDiv}>
          <Loader />
        </div>
      )}

      {!isFetchingInfo && dataInfo && (
        <div className={cl.contestDiv}>
          <div className={cl.contestLayoutDiv}>
            <h1>{dataInfo.title}</h1>

            <div className={cl.contestInfoDiv}>
              <p>Счет: {dataInfo.participants[0].score}</p>
              <p>Завершение через {timeLeft}</p>
            </div>

            <div className={cl.taskButtonsDiv}>
              {dataInfo.tasks
                .slice()
                .sort((a, b) => a.order - b.order)
                .map(({ task, participantTasks, order }) => {
                  const score = participantTasks?.[0]?.score
                  let className

                  if (score == null) {
                    className = ''
                  } else if (score !== MAX_SCORE_FOR_TASK) {
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

          <Outlet
            key={taskId}
            context={{
              task: dataInfo.tasks.find((t) => t.task.id === taskId)?.task!,
              score: dataInfo.tasks.find((t) => t.task.id === taskId)?.participantTasks?.[0]?.score,
              isLoading: isLoadingSubmit,
              submitSolution: contestSubmitMutation,
              taskId,
              contestId,
              state: solutions[taskId!] ?? { solution: '', compiler: '' },
              updateState: (newData: { solution?: string; compiler?: TypeAllowedCompilerIds }) =>
                updateTaskState(taskId!, newData),
            }}
          />
        </div>
      )}
    </>
  )
}

export default ContestLayout
