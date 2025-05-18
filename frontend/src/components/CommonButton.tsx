import { FC, MouseEvent } from 'react'

import cl from '../styles/button.module.css'

interface CommonButtonProps {
  label: string
  type: 'button' | 'submit' | 'reset'
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  className?: string
  disabled?: boolean
}

const CommonButton: FC<CommonButtonProps> = ({ className, label, type, onClick, disabled }) => (
  <button className={`${cl.button} ${className ?? ''}`} type={type} onClick={onClick} disabled={disabled}>
    {label}
  </button>
)

export default CommonButton
