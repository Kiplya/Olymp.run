import { FC, useCallback, useState } from 'react'
import { useNavigate } from 'react-router'

import Modal from './Modal'

import { useLogoutMutation } from '../api/userApi'
import useAppSelector from '../hooks/useAppSelector'

import cl from '../styles/headerFooter.module.css'

const Header: FC = () => {
  const navigate = useNavigate()
  const [isShowModal, setShowModal] = useState(false)
  const [logoutMutation] = useLogoutMutation()
  const isAuth = useAppSelector((state) => state.authSlice.isAuth)
  const isAdmin = useAppSelector((state) => state.authSlice.isAdmin)
  const openModal = useCallback(() => setShowModal(true), [])
  const closeModal = useCallback(() => setShowModal(false), [])

  const confirmLogout = useCallback(() => {
    logoutMutation()
    closeModal()
  }, [closeModal, logoutMutation])

  return (
    <>
      <div className={`${cl.headerFooter} ${cl.header}`}>
        <img
          className={cl.logoImg}
          src='/img/logo.webp'
          alt=''
          onClick={isAuth ? () => navigate('/contests') : () => navigate('/login')}
        />

        {isAuth && (
          <img className={`${cl.logoutBtn} ${cl.btn}`} src='/img/logoutButton.webp' alt='' onClick={openModal} />
        )}
        {isAdmin && (
          <img
            className={`${cl.adminBtn} ${cl.btn}`}
            src='/img/adminButton.webp'
            alt=''
            onClick={() => navigate('/admin')}
          />
        )}
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
