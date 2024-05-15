// @todo: add typescript types
import DOMPurify from 'isomorphic-dompurify'

export default function WidgetError({ error, fields, name }: any) {
  if (!error) return null

  if (Array.isArray(error)) {
    return error.map((e: any, index) => (
      <WidgetError key={index} name={name} error={e} fields={fields} />
    ))
  }

  if (typeof error === 'object' && error[name]) {
    return <WidgetError name={name} error={error[name]} fields={fields} />
  }

  if (typeof error === 'object' && error.error) {
    return <WidgetError name={name} error={error.error} fields={fields} />
  }

  if (typeof error === 'object' && Array.isArray(fields)) {
    return Object.entries(error).map(
      ([key, e]: any) =>
        !fields.includes(key) && (
          <WidgetError key={key} name={name} error={e} fields={fields} />
        ),
    )
  }

  if (typeof error === 'string') {
    return (
      <p
        className="error"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(error),
        }}
      />
    )
  }

  return null
}
