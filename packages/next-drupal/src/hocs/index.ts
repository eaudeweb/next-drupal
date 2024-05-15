export * from './withClientOnly'
export { default as withDrupalWebform } from './withDrupalWebform'

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
