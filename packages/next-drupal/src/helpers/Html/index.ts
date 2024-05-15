import DOMPurify from 'isomorphic-dompurify'

export const textNodesOnly = (element: Node | string): string => {
  return DOMPurify.sanitize(element, {
    ALLOWED_TAGS: ['#text'],
  })
}
