import './TextField.css'
import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

export function TextField({ label, id, ...rest }: TextFieldProps) {
  return (
    <div className="text-field">
      <label className="text-field__label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="text-field__input" {...rest} />
    </div>
  )
}
