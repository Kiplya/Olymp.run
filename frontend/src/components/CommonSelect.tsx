import { FC, ChangeEvent } from 'react'

import cl from '../styles/commonSelect.module.css'

export interface CommonSelectOption {
  label: string
  value: string
}

interface CommonSelectProps {
  options: CommonSelectOption[]
  value: string
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  placeholder: string
  className?: string
}

const CommonSelect: FC<CommonSelectProps> = ({ options, value, onChange, placeholder, className }) => (
  <select className={`${cl.select} ${className ?? ''}`} value={value} onChange={onChange}>
    <option value='' disabled hidden>
      {placeholder}
    </option>
    {options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
)

export default CommonSelect
