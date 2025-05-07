import { FC } from 'react'

import CommonButton from './CommonButton'

import cl from '../styles/modal.module.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  modalText: string
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, modalText, onConfirm }) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className={cl.overlay} onClick={onClose}>
      <div className={cl.modal} onClick={(e) => e.stopPropagation()}>
        <p>{modalText}</p>
        <div>
          <CommonButton label='Да' type='button' onClick={onConfirm} />
          <CommonButton label='Нет' type='button' onClick={onClose} />
        </div>
      </div>
    </div>
  )
}

export default Modal
