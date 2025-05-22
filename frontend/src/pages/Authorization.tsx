import { FC, FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useLoginMutation } from '../api/userApi'
import CommonButton from '../components/CommonButton'
import CommonInput from '../components/CommonInput'
import cl from '../styles/authorization.module.css'
import { isFetchBaseQueryError } from '../utils/assertions'
import { getStatusMessage } from '../utils/common'

const Authorization: FC = () => {
  const [loginMutation, { isError, error }] = useLoginMutation()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!isError) return

    setLogin('')
    setPassword('')
    toast.error(getStatusMessage(isFetchBaseQueryError(error) ? error.status : 0))
  }, [isError, error])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    loginMutation({ login, password })
  }

  return (
    <div className={cl.authDiv}>
      <h1>Авторизация</h1>

      <form onSubmit={handleSubmit}>
        <CommonInput
          type='text'
          value={login}
          onChange={(e) => setLogin(e.currentTarget.value.trim())}
          placeholder='Логин'
        />
        <CommonInput
          type='password'
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value.trim())}
          placeholder='Пароль'
        />
        <CommonButton label='Вход' type='submit' disabled={!login || !password} />
      </form>
    </div>
  )
}

export default Authorization
