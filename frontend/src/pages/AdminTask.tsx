import { TypeTaskDifficulty } from '@shared/apiTypes'

import { FC, useState, FormEvent, useMemo, useEffect } from 'react'
import { useBeforeUnload } from 'react-router'
import { toast } from 'react-toastify'

import { useTaskCreateMutation } from '../api/taskApi'
import CommonButton from '../components/CommonButton'
import CommonInput from '../components/CommonInput'
import DropdownMenu, { DropdownMenuOption } from '../components/DropdownMenu'
import TextArea from '../components/TextArea'

import usePrompt from '../hooks/usePrompt'
import cl from '../styles/adminTask.module.css'
import { isErrorMessage } from '../utils/assertions'

const AdminTask: FC = () => {
  const dropdownMenuOptions: DropdownMenuOption[] = useMemo(
    () => [
      {
        label: 'Легкая',
        onClick: () => {
          setIsFormDirty(true)
          setTaskDifficulty('easy')
        },
      },
      {
        label: 'Средняя',
        onClick: () => {
          setIsFormDirty(true)
          setTaskDifficulty('medium')
        },
      },
      {
        label: 'Тяжелая',
        onClick: () => {
          setIsFormDirty(true)
          setTaskDifficulty('hard')
        },
      },
    ],
    [],
  )

  const [taskName, setTaskName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskMemoryLimit, setTaskMemoryLimit] = useState('')
  const [taskTimeLimit, setTaskTimeLimit] = useState('')
  const [taskInputExample, setTaskInputExample] = useState('')
  const [taskOutputExample, setTaskOutputExample] = useState('')
  const [taskDifficulty, setTaskDifficulty] = useState<TypeTaskDifficulty>()
  const [testsFile, setTestsFile] = useState<File | null>(null)

  const [taskCreateMutation, { isSuccess, isError, error }] = useTaskCreateMutation()

  useEffect(() => {
    if (!isError) return

    toast.error(isErrorMessage(error) ? error.data.message : 'Unknown error')
  }, [isError, error])

  useEffect(() => {
    if (!isSuccess) return
    toast.success(`Задача успешно создана`)

    setIsFormDirty(false)
    setTaskName('')
    setTaskDescription('')
    setTaskMemoryLimit('')
    setTaskTimeLimit('')
    setTaskInputExample('')
    setTaskOutputExample('')
    setTaskDifficulty(undefined)
    setTestsFile(null)
  }, [isSuccess])

  const [isFormDirty, setIsFormDirty] = useState(false)
  const isDisabled =
    taskName &&
    taskDescription &&
    taskInputExample &&
    taskOutputExample &&
    taskTimeLimit &&
    taskMemoryLimit &&
    taskDifficulty &&
    testsFile
      ? false
      : true

  usePrompt(isFormDirty)
  useBeforeUnload((e) => {
    if (isFormDirty) {
      e.preventDefault()
    }
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!taskDifficulty || !testsFile) {
      return
    }

    const formData = new FormData()
    formData.append('taskName', taskName)
    formData.append('taskDescription', taskDescription)
    formData.append('taskInputExample', taskInputExample)
    formData.append('taskOutputExample', taskOutputExample)
    formData.append('taskDifficulty', taskDifficulty)
    formData.append('taskMemoryLimit', taskMemoryLimit)
    formData.append('taskTimeLimit', taskTimeLimit)
    formData.append('testsFile', testsFile)

    taskCreateMutation(formData)
  }

  return (
    <div className={cl.adminDiv}>
      <h1>Создание задачи</h1>
      <form onSubmit={handleSubmit} onChange={() => setIsFormDirty(true)}>
        <CommonInput
          placeholder='Название'
          type='text'
          value={taskName}
          onChange={(e) => {
            setTaskName(e.currentTarget.value)
          }}
        />

        <DropdownMenu
          className={cl.dropdown}
          label={`Сложность: ${!taskDifficulty ? 'не выбрано' : taskDifficulty}`}
          options={dropdownMenuOptions}
        />

        <CommonInput
          placeholder='Огр. по времени (мс)'
          type='number'
          value={taskTimeLimit}
          onChange={(e) => {
            setTaskTimeLimit(e.currentTarget.value)
          }}
        />

        <CommonInput
          placeholder='Огр. по памяти (МБ)'
          type='number'
          value={taskMemoryLimit}
          onChange={(e) => {
            setTaskMemoryLimit(e.currentTarget.value)
          }}
        />

        <p>Описание:</p>
        <div>
          <TextArea
            value={taskDescription}
            onChange={(e) => {
              setTaskDescription(e.currentTarget.value)
            }}
          />
        </div>

        <p>Пример входных данных:</p>
        <div>
          <TextArea
            value={taskInputExample}
            onChange={(e) => {
              setTaskInputExample(e.currentTarget.value)
            }}
          />
        </div>

        <p>Пример выходных данных:</p>
        <div>
          <TextArea
            value={taskOutputExample}
            onChange={(e) => {
              setTaskOutputExample(e.currentTarget.value)
            }}
          />
        </div>

        <p>Тесты:</p>
        <CommonInput
          type='file'
          accept='.json'
          onClick={(e) => (e.currentTarget.value = '')}
          onChange={(e) => e.target.files?.[0] && setTestsFile(e.target.files[0])}
        />

        <CommonButton label='Создать' type='submit' disabled={isDisabled} />
      </form>

      <p>
        <strong>Примечание:</strong> файл должен быть типа .json и иметь следующий формат:
        <br /> [ {'{'}"input": "string", "expectedOutput": "string"{'}'}, ... ]
      </p>
    </div>
  )
}

export default AdminTask
