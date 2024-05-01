import { useRef } from 'react'

export default function usePrevious<T>(value: T): T | null {
  // initialise the ref with previous and current values
  const ref = useRef({
    prev: null,
    value: value,
  })

  const current = ref.current.value

  // if the value passed into hook doesn't match what we store as "current"
  // move the "current" to the "previous"
  // and store the passed value as "current"
  if (value !== current) {
    ref.current = {
      prev: current as any,
      value: value,
    }
  }

  // return the previous value only
  return ref.current.prev
}
