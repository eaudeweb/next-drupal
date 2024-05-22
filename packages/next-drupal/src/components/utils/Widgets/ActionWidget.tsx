import { Button } from 'antd'

import WidgetError from '../../theme/Errors/WidgetError'

export function ActionWidget({ InputProps, error, form, webformField }) {
  return (
    <>
      <Button
        disabled={form?.loading}
        htmlType="submit"
        style={{ alignItems: 'center', display: 'inline-flex' }}
      >
        {webformField['#submit__label'] || 'Submit'}
      </Button>
      <WidgetError
        name={InputProps?.name}
        error={error || form?.error}
        fields={form?.fields}
      />
    </>
  )
}

export default ActionWidget
