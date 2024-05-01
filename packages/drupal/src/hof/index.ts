// @todo Miu: add type checks
export { default as withAuthGuard } from './withAuthGuard'
export { default as withDrupalCommonResources } from './withDrupalCommonResources'
export { default as withDrupalNodeResources } from './withDrupalNodeResources'
export { default as withNextAuthInitialSession } from './withNextAuthInitialSession'
export { default as withNodeAuthGuard } from './withNodeAuthGuard'

export function compose(...fns: any) {
  return function (...args: any) {
    return fns.reduceRight((acc: any, fn: any) => fn(acc), ...args)
  }
}
