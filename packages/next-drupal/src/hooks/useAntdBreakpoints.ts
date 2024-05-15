import { Breakpoint, Grid } from 'antd'

import { defaultBreakpoint } from '@edw/next-drupal/config'

export const useAntdBreakpoints = () => {
  const { useBreakpoint } = Grid
  const breakpoints = useBreakpoint()

  return breakpoints
}

export const useDefaultBreakpoint = () => {
  const breakpoints = useAntdBreakpoints()
  return breakpoints[defaultBreakpoint as Breakpoint]
}
