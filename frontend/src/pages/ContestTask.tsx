import { AllowedCompilers, TypeTaskDifficulty } from '@shared/apiTypes'
import parse from 'html-react-parser'
import { FC, FormEvent } from 'react'
import { useOutletContext } from 'react-router'

import CommonButton from '../components/CommonButton'
import CommonSelect from '../components/CommonSelect'
import TextArea from '../components/TextArea'

import cl from '../styles/contestTask.module.css'

const convertDifficulty = (difficulty: TypeTaskDifficulty) => {
  if (difficulty === 'easy') {
    return 'легкая'
  } else if (difficulty === 'medium') {
    return 'средняя'
  } else {
    return 'тяжелая'
  }
}

interface TaskContext {
  task: {
    id: string
    title: string
    description: string
    exampleInput: string
    exampleOutput: string
    timeLimit: number
    memoryLimit: number
    difficulty: TypeTaskDifficulty
  }

  state: {
    solution: string
    compiler: string
  }

  updateState: (newData: { solution?: string; compiler?: string }) => void
}

// TODO: 1) Add toast 2) Check query fetching + completed task for disable button

const ContestTask: FC = () => {
  const { task, state, updateState } = useOutletContext<TaskContext>()
  const isDisabled = state.compiler && state.solution ? false : true

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className={cl.contestTaskDiv}>
      <h1>{task.title}</h1>
      <p>Сложность: {convertDifficulty(task.difficulty)}</p>
      <p>Ограничение по времени: {task.timeLimit / 1000} сек.</p>
      <p>Ограничение по памяти: {task.memoryLimit} МБ</p>

      <div className={cl.taskDiv}>
        <p>{parse(task.description.replace(/\n/g, '<br />'))}</p>

        <div>
          <p>
            <strong>Пример входных данных:</strong>
          </p>
          <p>{parse(task.exampleInput.replace(/\n/g, '<br />'))}</p>
        </div>

        <div>
          <p>
            <strong>Пример выходных данных:</strong>
          </p>
          <p>{parse(task.exampleOutput.replace(/\n/g, '<br />'))}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h1>Решение:</h1>
        <div className={cl.solutionTextAreaDiv}>
          <TextArea value={state.solution ?? ''} onChange={(e) => updateState({ solution: e.currentTarget.value })} />
        </div>

        <p>
          <strong>Компилятор:</strong>
        </p>
        <CommonSelect
          value={state.compiler ?? ''}
          placeholder='Выберите компилятор'
          onChange={(e) => updateState({ compiler: e.currentTarget.value })}
          options={Object.values(AllowedCompilers).map((value) => ({
            label: value,
            value: value,
          }))}
        />

        <CommonButton type='submit' label='Отправить' disabled={isDisabled} />
      </form>
    </div>
  )
}

export default ContestTask
