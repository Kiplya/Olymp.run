import { BaseResponse, Endpoints, LoginRequest } from '@shared/apiTypes'
import { FC, FormEvent, useState } from 'react'

import CommonButton from '../components/CommonButton'
import CommonTextInput from '../components/CommonTextInput'
import { useAuth } from '../context/AuthContext'
import useApiRequest from '../hooks/useApiRequest'
import cl from '../styles/authorization.module.css'
import { getStatusMessage } from '../utils/common'

const Authorization: FC = () => {
  const { login: loginMethod } = useAuth()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const { status, request } = useApiRequest<BaseResponse, LoginRequest>(
    Endpoints.LOGIN,
    { login, password },
    {
      onSuccess: () => {
        loginMethod()
      },
      onFinally: () => {
        setLogin('')
        setPassword('')
      },
    },
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    request()
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
        <CommonButton className={cl.authBtn} label='Вход' type='submit' disabled={!login || !password} />
      </form>

      <p style={{ opacity: status ? '1' : '0' }}>{getStatusMessage(status)}</p>
    </div>
  )
}

export default Authorization
