import { DrupalNode } from 'next-drupal'

export const nodeToPath = (node: DrupalNode): string => {
  const { path } = node
  const id = node.drupal_internal__nid
  return path?.alias ?? `/node/${id}`
}

export const removeDrupalLinkPrefixes = (input: string): string => {
  const prefixes = ['internal:', 'entity:', 'base:']
  for (const prefix of prefixes) {
    if (input.startsWith(prefix)) {
      return input.slice(prefix.length)
    }
  }
  return input
}

export const getEntityURL = (entity: DrupalNode): string => {
  switch (entity.type) {
    default:
      return nodeToPath(entity)
  }
}
