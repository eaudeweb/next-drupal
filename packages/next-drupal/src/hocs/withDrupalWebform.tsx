import { Skeleton } from 'antd'

import { useDrupalApi } from '../hooks'

function SkeletonWebform() {
  const labelStyle = { width: '100px' }
  const inputStyle = { width: '100%' }

  return (
    <form>
      <Skeleton paragraph={false} style={labelStyle} />
      <Skeleton.Input style={inputStyle} />
      <Skeleton paragraph={false} style={labelStyle} />
      <Skeleton.Input style={inputStyle} />
      <Skeleton paragraph={false} style={labelStyle} />
      <Skeleton.Input style={inputStyle} />
      <Skeleton.Button />
    </form>
  )
}

function ErrorWebform({ error }: any) {
  if (Array.isArray(error)) {
    return error.map((e, index) => <p key={index}>{e}</p>)
  }
  if (typeof error === 'object') {
    return Object.keys(error).map((key, index) => (
      <p key={index}>{error[key]}</p>
    ))
  }
  return <p>{error}</p>
}

const withDrupalWebform = (WrappedComponent) => {
  return function WebformProvider({ paragraph }: any) {
    const webformId = paragraph?.field_block?.settings?.webform_id

    const state = useDrupalApi(`/webform_rest/${webformId}/fields`)

    if (state.loading) {
      return <SkeletonWebform />
    }

    if (state.error) {
      return <ErrorWebform error={state.error} />
    }

    return <WrappedComponent fields={state.data || {}} webformId={webformId} />
  }
}

export default withDrupalWebform
