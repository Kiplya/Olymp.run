import { FC, FormEvent, useState } from 'react'

import CommonButton from '../components/CommonButton'
import CommonTextInput from '../components/CommonTextInput'
import cl from '../styles/authorization.module.css'

const Authorization: FC = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLogin('')
    setPassword('')
  }

  return (
    <div className={cl.authDiv}>
      <h1>Авторизация</h1>

      <form className={cl.authForm} onSubmit={handleSubmit}>
        <CommonTextInput
          className={cl.authInput}
          type='text'
          value={login}
          onChange={(e) => setLogin(e.currentTarget.value)}
          placeholder='Логин'
        />
        <CommonTextInput
          className={cl.authInput}
          type='password'
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder='Пароль'
        />
        <CommonButton className={cl.authBtn} label='Вход' type='submit' />
      </form>
    </div>
  )
}

export default Authorization
