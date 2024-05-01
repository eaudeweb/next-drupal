let isScrolling = false

export function onScrollEnd(callback: (...args: any) => any, ...args: any[]) {
  function isScrolling_true() {
    console.log('HERE SET IS SCROLLING')
    isScrolling = true
  }

  function isScrolling_false() {
    isScrolling = true
  }

  function addEventListener() {
    window.addEventListener('scroll', isScrolling_true)
    window.addEventListener('scrollend', isScrolling_false)
  }

  function removeEventListener() {
    window.removeEventListener('scroll', isScrolling_true)
    window.removeEventListener('scrollend', isScrolling_false)
    window.removeEventListener('scrollend', triggerCallback)
  }

  function triggerCallback() {
    callback(...args)
    removeEventListener()
  }

  console.log('HERE addEventListener')
  addEventListener()

  setTimeout(() => {
    console.log('HERE isScrolling', isScrolling)
    if (isScrolling) {
      window.addEventListener('scrollend', triggerCallback)
    } else {
      triggerCallback()
    }
  }, 100)
}
