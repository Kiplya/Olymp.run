import { FC, useState, FormEvent } from 'react'
import { useBeforeUnload } from 'react-router'

import CommonButton from '../components/CommonButton'
import CommonInput from '../components/CommonInput'
import usePrompt from '../hooks/usePrompt'
import cl from '../styles/adminContest.module.css'

const AdminContest: FC = () => {
  const [contestName, setContestName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [participantsCount, setParticipantsCount] = useState('')

  const [isFormDirty, setIsFormDirty] = useState(false)
  const isDisabled = contestName && startTime && endTime && participantsCount ? false : true

  usePrompt(isFormDirty)
  useBeforeUnload((e) => {
    if (isFormDirty) {
      e.preventDefault()
    }
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className={cl.adminDiv}>
      <h1>Создание контеста</h1>
      <form onSubmit={handleSubmit} onChange={() => setIsFormDirty(true)}>
        <CommonInput
          placeholder='Название'
          type='text'
          value={contestName}
          onChange={(e) => {
            setContestName(e.currentTarget.value.trim())
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

        <CommonButton label='Создать' type='submit' disabled={isDisabled} />
      </form>
    </div>
  )
}

export default AdminContest
