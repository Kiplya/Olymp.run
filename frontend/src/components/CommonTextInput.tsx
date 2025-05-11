import { FC, ChangeEvent } from 'react'

import cl from '../styles/textInput.module.css'

interface CommonTextInputProps {
  type: 'text' | 'password' | 'datetime-local'
  value: string | number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

const CommonTextInput: FC<CommonTextInputProps> = ({ className, type, value, onChange, placeholder, disabled }) => (
  <input
    className={className ? className : cl.textInput}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
  />
)

export default CommonTextInput
