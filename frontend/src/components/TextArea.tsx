import { FC, ChangeEvent } from 'react'

import cl from '../styles/textArea.module.css'

interface TextAreaProps {
  value: string
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

const TextArea: FC<TextAreaProps> = ({ value, onChange, className, placeholder, disabled }) => (
  <textarea
    className={className ? className : cl.textArea}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
  />
)

export default TextArea
