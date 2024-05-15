import { MenuEntry } from '@edw/next-drupal/@types'
import type {
  DrupalMenuLinkContent,
  JsonApiWithLocaleOptions,
} from 'next-drupal'

import { buildUrl, deserialize } from 'next-drupal'

type ItemsMap = Record<string, MenuEntry>

const _entry = (item: any): MenuEntry => ({
  label: item.attributes?.title ?? item.title,
  to: item.attributes?.url ?? item.url,
})

// TODO: there's a problem with the type here, the item in children is initially a string, then it's converted to a MenuEntry
const addChildren = (item: MenuEntry, itemsMap: ItemsMap): MenuEntry => {
  if (item.children) {
    const func = (mixedChild: unknown): MenuEntry => {
      const child = itemsMap[mixedChild as string]
      const res = addChildren(child, itemsMap)
      return res
    }
    item.children = item.children?.map(func)
  }
  return item
}

const getParent = (item: any): string | undefined =>
  item.attributes?.parent ?? item.parent

export function buildMenu(items: any[]): MenuEntry[] {
  // console.log('items', items)
  const itemsMap = Object.assign(
    {},
    ...items.map((item) => ({ [item.id]: _entry(item) })),
  )

  items.forEach((item) => {
    const parentId = getParent(item)
    if (parentId) {
      const parent = itemsMap[parentId]
      parent.children = [...(parent.children || []), item.id]
    }
  })

  const menu = items
    .filter((item) => getParent(item) === '')
    .map(({ id }) => addChildren(itemsMap[id], itemsMap))

  return menu
}

// customized copy of get-menu, to use the decoupled drupal endpoints
export async function getDecoupledMenu<T extends DrupalMenuLinkContent>(
  name: string,
  options?: {
    accessToken?: any
    deserialize?: boolean
  } & JsonApiWithLocaleOptions,
): Promise<{
  items: T[]
  tree: T[]
}> {
  options = {
    deserialize: true,
    ...options,
  }

  const localePrefix =
    options?.locale && options.locale !== options.defaultLocale
      ? `/${options.locale}`
      : ''

  const url = buildUrl(`${localePrefix}/api/v1/menu/${name}`)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const data = await response.json()

  const items = options.deserialize ? deserialize(data) : data

  const { items: tree } = buildMenuTree(items)

  return {
    items,
    tree,
  }
}

function buildMenuTree(data: any): any {
  console.log(data)
  throw new Error('Needs to be finished')
}
