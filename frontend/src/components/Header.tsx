import { FC } from 'react'

import cl from '../styles/headerFooter.module.css'

const Header: FC = () => (
  <div className={`${cl.headerFooter} ${cl.header}`}>
    <img className={cl.logoImg} src='/static/img/logo.webp' alt='' />
    <img className={cl.logoutBtn} src='/static/img/logoutButton.webp' alt='' />
  </div>
)

export default Header
