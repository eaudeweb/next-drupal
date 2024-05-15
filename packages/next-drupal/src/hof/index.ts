// @todo Miu: add type checks
export { default as withAuthGuard } from './withAuthGuard'
export { default as withAuthInitialSession } from './withAuthInitialSession'
export { default as withAuthNodeGuard } from './withAuthNodeGuard'
export { default as withDrupalCommonResources } from './withDrupalCommonResources'
export { default as withDrupalNodeResources } from './withDrupalNodeResources'

export function compose(...fns: any) {
  return function (...args: any) {
    return fns.reduce(
      (acc: any, fn: any) => {
        return fn(acc)
      },
      ...args,
      null,
    )
  }
}
