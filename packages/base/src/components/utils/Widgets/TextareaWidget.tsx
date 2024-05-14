import { Input } from 'antd'

import WidgetError from '../../theme/Errors/WidgetError'

export function TextareaWidget({ id, InputProps = {}, error, title }: any) {
  return (
    <>
      <label htmlFor={id}>{title}</label>
      <Input.TextArea
        {...InputProps}
        id={id}
        status={error ? 'error' : undefined}
      />
      <WidgetError name={InputProps?.name} error={error} />
    </>
  )
}

export default TextareaWidget
