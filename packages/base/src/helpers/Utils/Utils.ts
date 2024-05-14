const timer: Record<string, any> = {}

export function debounce(func: any, wait: number = 300, id?: string) {
  if (typeof func !== 'function') return
  const name = id || func.name || 'generic'
  if (timer[name]) clearTimeout(timer[name])
  timer[name] = setTimeout(func, wait)
}
