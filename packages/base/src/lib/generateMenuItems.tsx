import type { MenuEntry } from '../types'
import type { ItemType, SubMenuType } from 'antd/es/menu/hooks/useItems'

import { DrupalLink } from '@edw/base'

export const generateMenuItems = (
  menu: MenuEntry[],
  menuItemClassname: string = '',
  subMenuProps?: Omit<SubMenuType, 'children' | 'key'>,
): ItemType[] => {
  return menu.map((item): ItemType => {
    if (item.children && item.children.length > 0) {
      return {
        key: item.to,
        children: generateMenuItems(item.children, menuItemClassname),
        label: (
          <DrupalLink className={menuItemClassname} href={item.to}>
            {item.label}
          </DrupalLink>
        ),
        ...subMenuProps,
      }
    }
    return {
      key: item.to,
      label: (
        <DrupalLink className={menuItemClassname} href={item.to}>
          {item.label}
        </DrupalLink>
      ),
    }
  })
}
