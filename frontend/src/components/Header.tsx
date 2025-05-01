import { FC } from 'react'

import { useAuth } from '../context/AuthContext'
import cl from '../styles/headerFooter.module.css'

const Header: FC = () => {
  const { isAuth } = useAuth()

  return (
    <div className={`${cl.headerFooter} ${cl.header}`}>
      <img className={cl.logoImg} src='/static/img/logo.webp' alt='' />
      {isAuth && <img className={cl.logoutBtn} src='/static/img/logoutButton.webp' alt='' />}
    </div>
  )
}

export default Header
