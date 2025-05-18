import { FC, ChangeEvent, MouseEvent } from 'react'

import cl from '../styles/input.module.css'

interface CommonInputProps {
  type: 'text' | 'password' | 'datetime-local' | 'number' | 'file'
  value?: string | number | undefined
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClick?: (event: MouseEvent<HTMLInputElement>) => void
  className?: string
  placeholder?: string
  disabled?: boolean
  accept?: '.json'
}

const CommonInput: FC<CommonInputProps> = ({
  className,
  type,
  accept,
  value,
  onClick,
  onChange,
  placeholder,
  disabled,
}) => (
  <input
    className={`${cl.textInput} ${className ?? ''}`}
    type={type}
    value={value}
    onChange={onChange}
    onClick={onClick}
    placeholder={placeholder}
    disabled={disabled}
    accept={accept}
  />
)

export default CommonInput
