import { FC, useState, FormEvent } from 'react'
import { useBeforeUnload } from 'react-router'

import CommonButton from '../components/CommonButton'
import CommonInput from '../components/CommonInput'
import TextArea from '../components/TextArea'

import usePrompt from '../hooks/usePrompt'
import cl from '../styles/adminTask.module.css'

const AdminTask: FC = () => {
  const [taskName, setTaskName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskInputExample, setTaskInputExample] = useState('')
  const [taskOutputExample, setTaskOutputExample] = useState('')
  const [testsFile, setTestsFile] = useState<File | null>(null)

  const [isFormDirty, setIsFormDirty] = useState(false)
  const isDisabled = taskName && taskDescription && taskInputExample && taskOutputExample && testsFile ? false : true

  usePrompt(isFormDirty)
  useBeforeUnload((e) => {
    if (isFormDirty) {
      e.preventDefault()
    }
  })

  const handleSubmit = (e: FormEvent) => {
    setTaskName('')
    setTaskDescription('')
    setTaskInputExample('')
    setTaskOutputExample('')
    setTestsFile(null)
    e.preventDefault()
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
            setTaskName(e.currentTarget.value.trim())
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
          onChange={(e) => e.target.files?.[0] && setTestsFile(e.target.files[0])}
        />

        <CommonButton label='Создать' type='submit' disabled={isDisabled} />
      </form>
    </div>
  )
}

export default AdminTask
