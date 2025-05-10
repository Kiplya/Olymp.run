import { FC, useCallback, useState } from 'react'

import Modal from './Modal'

import { useLogoutMutation } from '../api/userApi'
import useAppSelector from '../hooks/useAppSelector'

import cl from '../styles/headerFooter.module.css'

const Header: FC = () => {
  const [isShowModal, setShowModal] = useState(false)
  const [logoutMutation] = useLogoutMutation()
  const isAuth = useAppSelector((state) => state.authSlice.isAuth)
  const openModal = useCallback(() => setShowModal(true), [])
  const closeModal = useCallback(() => setShowModal(false), [])

  const confirmLogout = useCallback(() => {
    logoutMutation()
    closeModal()
  }, [closeModal, logoutMutation])

  return (
    <>
      <div className={`${cl.headerFooter} ${cl.header}`}>
        <img className={cl.logoImg} src='/img/logo.webp' alt='' />
        {isAuth && <img className={cl.logoutBtn} src='/img/logoutButton.webp' alt='' onClick={openModal} />}
      </div>

      <Modal
        isOpen={isShowModal}
        modalText='Вы уверены, что хотите выйти?'
        onClose={closeModal}
        onConfirm={confirmLogout}
      />
    </>
  )
}

export default Header
