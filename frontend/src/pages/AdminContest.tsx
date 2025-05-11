import { FC, useState } from 'react'

import CommonButton from '../components/CommonButton'
import CommonTextInput from '../components/CommonTextInput'
import cl from '../styles/adminContest.module.css'

const AdminContest: FC = () => {
  const [contestName, setContestName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [participantsCount, setParticipantsCount] = useState('')

  return (
    <div className={cl.adminDiv}>
      <h1>Создание контеста</h1>
      <form onSubmit={() => {}}>
        <div>
          <p>Название:</p>
          <CommonTextInput
            type='text'
            value={contestName}
            onChange={(e) => {
              setContestName(e.currentTarget.value.trim())
            }}
          />
        </div>

        <div>
          <p>Время начала: </p>
          <CommonTextInput
            type='datetime-local'
            value={startTime}
            onChange={(e) => {
              setStartTime(e.currentTarget.value)
            }}
          />
        </div>

        <div>
          <p>Время окончания: </p>
          <CommonTextInput
            type='datetime-local'
            value={endTime}
            onChange={(e) => {
              setEndTime(e.currentTarget.value)
            }}
          />
        </div>

        <div>
          <p>Количество участников: </p>
          <CommonTextInput
            type='text'
            value={participantsCount}
            onChange={(e) => {
              setParticipantsCount(e.currentTarget.value)
            }}
          />
        </div>

        <CommonButton label='Создать' type='submit' disabled={false} />
      </form>
    </div>
  )
}

export default AdminContest
