import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import { useContestGetManyByParticipantQuery } from '../api/contestApi'

import CommonButton from '../components/CommonButton'
import Loader from '../components/Loader'
import cl from '../styles/contests.module.css'
import { getTimeDiffString } from '../utils/common'

const Contests: FC = () => {
  const { data, isError, isFetching } = useContestGetManyByParticipantQuery()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isError) return
    toast.error('Internal server error')
  }, [isError])

  return (
    <div className={cl.contestsDiv}>
      <h1>Соревнования</h1>

      {isFetching && <Loader />}
      {!isFetching && data && data.length === 0 && <p>Ничего не найдено!</p>}

      {!isFetching && data && data.length > 0 && (
        <div className={cl.contestsList}>
          {data.map((contest) => (
            <div className={cl.contestItem}>
              <p>
                <strong>{contest.title}</strong>
              </p>

              <div className={cl.contestDescription}>
                {getTimeDiffString(contest.startTime) !== 0 && <p>До начала {getTimeDiffString(contest.startTime)}</p>}
                {getTimeDiffString(contest.endTime) === 0 && <p>Завершилось</p>}

                {getTimeDiffString(contest.startTime) === 0 && getTimeDiffString(contest.endTime) !== 0 && (
                  <>
                    <p>До завершения {getTimeDiffString(contest.endTime)}</p>
                    <CommonButton
                      label='Войти'
                      type='button'
                      onClick={() => navigate(`/contest/${contest.id}`)}
                    ></CommonButton>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Contests
