import { TaskGetRequest, TaskGetResponse } from '@shared/apiTypes'
import { FC, useState, FormEvent, useEffect } from 'react'
import { useBeforeUnload } from 'react-router'
import { toast } from 'react-toastify'

import { useContestCreateMutation } from '../api/contestApi'
import { useTaskGetByTitleQuery } from '../api/taskApi'
import CommonButton from '../components/CommonButton'
import CommonInput from '../components/CommonInput'
import CommonSearch from '../components/CommonSearch'
import usePrompt from '../hooks/usePrompt'
import cl from '../styles/adminContest.module.css'
import { isErrorMessage } from '../utils/assertions'
import { downloadJsonFile } from '../utils/common'

const AdminContest: FC = () => {
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [participantsCount, setParticipantsCount] = useState('')
  const [tasks, setTasks] = useState<TaskGetResponse[] | null>(null)

  const [hasDownloaded, setHasDownloaded] = useState(false)
  const [contestCreateMutation, { isSuccess, isError, error, data }] = useContestCreateMutation()

  useEffect(() => {
    if (!isError) return
    toast.error(isErrorMessage(error) ? error.data.message : 'Unknown error')
  }, [isError, error])

  useEffect(() => {
    if (!isSuccess || hasDownloaded) return

    setHasDownloaded(true)
    toast.success(`Контест успешно создан`)
    downloadJsonFile(`${title} users.json`, data)

    setIsFormDirty(false)
    setTitle('')
    setStartTime('')
    setEndTime('')
    setParticipantsCount('')
    setTasks(null)
  }, [isSuccess, hasDownloaded, data, title])

  const [isFormDirty, setIsFormDirty] = useState(false)
  const isDisabled = title && startTime && endTime && participantsCount && tasks && tasks.length !== 0 ? false : true

  usePrompt(isFormDirty)
  useBeforeUnload((e) => {
    if (isFormDirty) {
      e.preventDefault()
    }
  })

  const handleSubmit = (e: FormEvent) => {
    if (!tasks) return

    const reqData = {
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      participantsCount: Number(participantsCount),
      tasksId: tasks.map((task) => task.id),
    }

    contestCreateMutation(reqData)
    setHasDownloaded(false)
    e.preventDefault()
  }

  return (
    <div className={cl.adminDiv}>
      <h1>Создание контеста</h1>
      <form onSubmit={handleSubmit} onChange={() => setIsFormDirty(true)}>
        <CommonInput
          placeholder='Название'
          type='text'
          value={title}
          onChange={(e) => {
            setTitle(e.currentTarget.value)
          }}
        />

        <CommonInput
          placeholder='Количество участников'
          type='number'
          value={participantsCount}
          onChange={(e) => {
            setParticipantsCount(e.currentTarget.value)
          }}
        />

        <div>
          <p>Время начала: </p>
          <CommonInput
            type='datetime-local'
            value={startTime}
            onChange={(e) => {
              setStartTime(e.currentTarget.value)
            }}
          />
        </div>

        <div>
          <p>Время окончания: </p>
          <CommonInput
            type='datetime-local'
            value={endTime}
            onChange={(e) => {
              setEndTime(e.currentTarget.value)
            }}
          />
        </div>

        <p>Задачи:</p>
        <div className={cl.tasksDiv}>
          {tasks?.map((task, index) => (
            <div key={index}>
              <p>
                {index + 1}
                {')'}
              </p>

              <p>{task.title}</p>

              <p className={cl.removeBtn} onClick={() => setTasks(tasks.filter((curTask) => curTask.id !== task.id))}>
                &times;
              </p>
            </div>
          ))}
          {
            <div className={cl.searchTaskDiv}>
              <p>
                {tasks?.length ? tasks.length + 1 : 1}
                {')'}
              </p>
              <CommonSearch<TaskGetResponse, TaskGetRequest>
                isEqual={(a, b) => a.id === b.id}
                useSearch={useTaskGetByTitleQuery}
                placeholder='Введите название'
                result={tasks}
                setResult={setTasks}
                limit={10}
                renderItem={(task) => <p>{task.title}</p>}
              />
            </div>
          }
        </div>
        <CommonButton label='Создать' type='submit' disabled={isDisabled} />
      </form>
    </div>
  )
}

export default AdminContest
