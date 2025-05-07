import { FC } from 'react'

import cl from '../styles/headerFooter.module.css'

const Footer: FC = () => (
  <div className={`${cl.headerFooter} ${cl.footer}`}>
    <p>Воронежский Государственный Университет, ПММ</p>
  </div>
)

export default Footer
