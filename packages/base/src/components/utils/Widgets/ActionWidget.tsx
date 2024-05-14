import CheckOutlined from '@ant-design/icons/lib/icons/CheckOutlined'
import ExclamationOutlined from '@ant-design/icons/lib/icons/ExclamationOutlined'
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
        {!!form?.error && !form?.loading && <ExclamationOutlined />}
        {!!form?.loaded && <CheckOutlined />}
        {form?.loading && 'Submitting...'}
        {!form?.loading && (webformField['#submit__label'] || 'Submit')}
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
