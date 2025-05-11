import { FC, FormEvent, useEffect, useState } from 'react'

import { useLoginMutation } from '../api/userApi'
import CommonButton from '../components/CommonButton'
import CommonTextInput from '../components/CommonTextInput'
import cl from '../styles/authorization.module.css'
import { getStatusMessage } from '../utils/common'

const Authorization: FC = () => {
  const [loginMutation, { isError, error }] = useLoginMutation()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    setLogin('')
    setPassword('')
  }, [isError])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    loginMutation({ login, password })
  }

  return (
    <div className={cl.authDiv}>
      <h1>Авторизация</h1>

      <form onSubmit={handleSubmit}>
        <CommonTextInput
          type='text'
          value={login}
          onChange={(e) => setLogin(e.currentTarget.value.trim())}
          placeholder='Логин'
        />
        <CommonTextInput
          type='password'
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value.trim())}
          placeholder='Пароль'
        />
        <CommonButton label='Вход' type='submit' disabled={!login || !password} />
      </form>

      <p style={{ opacity: error ? '1' : '0' }}>{getStatusMessage(isError && 'status' in error ? error.status : 0)}</p>
    </div>
  )
}

export default Authorization
