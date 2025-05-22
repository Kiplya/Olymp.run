import {
  AllowedCompilers,
  MAX_SCORE_FOR_TASK,
  SolutionSubmitRequest,
  TypeAllowedCompilerIds,
  TypeTaskDifficulty,
} from '@shared/apiTypes'
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
    compiler: TypeAllowedCompilerIds | ''
  }

  score: number | undefined
  isLoading: boolean
  contestId: string
  taskId: string

  submitSolution: (submitReq: SolutionSubmitRequest) => void
  updateState: (newData: { solution?: string; compiler?: TypeAllowedCompilerIds }) => void
}

const ContestTask: FC = () => {
  const { task, state, score, isLoading, submitSolution, taskId, contestId, updateState } =
    useOutletContext<TaskContext>()
  const isDisabled = state.compiler && state.solution && score !== MAX_SCORE_FOR_TASK && !isLoading ? false : true

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!state.compiler) return
    submitSolution({ contestId, taskId, compiler: state.compiler, solution: state.solution })
  }

  return (
    <div className={cl.contestTaskDiv}>
      <h1>{task.title}</h1>
      <p>Сложность: {convertDifficulty(task.difficulty)}</p>
      <p>Ограничение по времени: {task.timeLimit / 1000} сек.</p>
      <p>Ограничение по памяти: {task.memoryLimit} МБ</p>
      <div className={cl.taskDivWrapper}>
        <div>
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
          value={state.compiler ? state.compiler.toString() : ''}
          placeholder='Выберите компилятор'
          onChange={(e) => updateState({ compiler: Number(e.currentTarget.value) as TypeAllowedCompilerIds })}
          options={Object.entries(AllowedCompilers).map(([id, label]) => ({
            label,
            value: id,
          }))}
        />

        <CommonButton type='submit' label='Отправить' disabled={isDisabled} />
      </form>
    </div>
  )
}

export default ContestTask
