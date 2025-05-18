import { TaskDifficulties } from '@shared/apiTypes'
import { FC } from 'react'
import { useOutletContext } from 'react-router'

import cl from '../styles/contestTask.module.css'

interface TaskContext {
  id: string
  title: string
  description: string
  exampleInput: string
  exampleOutput: string
  timeLimit: number
  memoryLimit: number
  difficulty: (typeof TaskDifficulties)[keyof typeof TaskDifficulties]
}

const ContestTask: FC = () => {
  const task = useOutletContext<TaskContext>()

  return (
    <div className={cl.contestTaskDiv}>
      <h1>{task.title}</h1>
    </div>
  )
}

export default ContestTask
