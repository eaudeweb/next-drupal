import { useEffect, useRef } from 'react'

import cx from 'classnames'

import WidgetError from '../../theme/Errors/WidgetError'

const FRIENDLYCAPTCHA_SITEKEY: string = process?.env
  ?.NEXT_PUBLIC_FRIENDLYCAPTCHA_SITEKEY
  ? process.env.NEXT_PUBLIC_FRIENDLYCAPTCHA_SITEKEY
  : ''

export function CaptchaWidget({ id, InputProps = {}, error }: any) {
  const captchaRef: any = useRef(null)
  const onChange = useRef(InputProps.onChange)

  useEffect(() => {
    onChange.current = InputProps.onChange
  }, [InputProps.onChange])

  useEffect(() => {
    let widget: any = null

    if (FRIENDLYCAPTCHA_SITEKEY) {
      ;(async () => {
        const { WidgetInstance } = await import('friendly-challenge')
        widget = new WidgetInstance(captchaRef.current, {
          doneCallback: (value) => {
            onChange.current(value)
          },
          errorCallback: () => {
            onChange.current(true)
          },
          sitekey: FRIENDLYCAPTCHA_SITEKEY,
        })
      })()
    }

    return () => {
      if (widget) {
        widget.reset()
      }
    }
  }, [])

  return (
    <>
      <div
        id={id}
        className={cx('frc-captcha')}
        data-sitekey={FRIENDLYCAPTCHA_SITEKEY}
        ref={captchaRef}
      />
      <WidgetError name={InputProps?.name} error={error} />
    </>
  )
}

export default CaptchaWidget
