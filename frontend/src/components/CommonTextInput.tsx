import { FC, ChangeEvent } from 'react'

interface CommonTextInputProps {
  type: string
  value: string | number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  className?: string
  placeholder?: string
}

const CommonTextInput: FC<CommonTextInputProps> = ({ className, type, value, onChange, placeholder }) => (
  <input className={className} type={type} value={value} onChange={onChange} placeholder={placeholder} />
)

export default CommonTextInput
