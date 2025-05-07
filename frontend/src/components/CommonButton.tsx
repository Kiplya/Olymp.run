import { FC } from 'react'

import cl from '../styles/button.module.css'

interface CommonButtonProps {
  label: string
  type: 'button' | 'submit' | 'reset'
  className?: string
  onClick?: () => void
  disabled?: boolean
}

const CommonButton: FC<CommonButtonProps> = ({ className, label, type, onClick, disabled }) => (
  <button className={className ? className : cl.button} type={type} onClick={onClick} disabled={disabled}>
    {label}
  </button>
)

export default CommonButton
