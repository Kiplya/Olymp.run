import { FC, ChangeEvent } from 'react'

import cl from '../styles/input.module.css'

interface CommonInputProps {
  type: 'text' | 'password' | 'datetime-local' | 'number' | 'file'
  value?: string | number | undefined
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  className?: string
  placeholder?: string
  disabled?: boolean
  accept?: '.json'
}

const CommonInput: FC<CommonInputProps> = ({ className, type, accept, value, onChange, placeholder, disabled }) => (
  <input
    className={className ? className : cl.textInput}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    accept={accept}
  />
)

export default CommonInput
