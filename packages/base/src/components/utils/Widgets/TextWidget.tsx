import { Input } from 'antd'

import WidgetError from '../../theme/Errors/WidgetError'

export function TextWidget({ id, InputProps = {}, error, title }: any) {
  return (
    <>
      <label htmlFor={id}>{title}</label>
      <Input {...InputProps} id={id} status={error ? 'error' : undefined} />
      <WidgetError name={InputProps?.name} error={error} />
    </>
  )
}

export default TextWidget
