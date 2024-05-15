import baseBreakpoints from '@edw/next-drupal/styles/vars/breakpoints.module.scss'

const breakpoints = Object.fromEntries(
  Object.entries(baseBreakpoints).map(([k, v]) => [k, parseInt(v)]),
)

export const defaultBreakpoint = baseBreakpoints.defaultBreakpoint

export default breakpoints
