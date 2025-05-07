import { Endpoints } from '@shared/apiTypes'
import { FC, MouseEvent, useCallback, useState } from 'react'

import Modal from './Modal'

import { useAuth } from '../context/AuthContext'
import useApiRequest from '../hooks/useApiRequest'
import cl from '../styles/headerFooter.module.css'

const Header: FC = () => {
  const { isAuth, logout } = useAuth()
  const [isShowModal, setShowModal] = useState(false)
  const openModal = useCallback(() => setShowModal(true), [])
  const closeModal = useCallback(() => setShowModal(false), [])

  const { request } = useApiRequest(
    Endpoints.LOGOUT,
    {},
    {
      onSuccess: () => {
        logout()
      },
    },
  )

  const confirmLogout = useCallback(() => {
    request()
    closeModal()
  }, [request, closeModal])

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
