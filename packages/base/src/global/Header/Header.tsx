import type { MenuEntry } from '../../types'

import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { MenuOutlined, SearchOutlined } from '@ant-design/icons'
import { Drawer, DrawerProps, Input, Menu, MenuProps } from 'antd'
import cx from 'classnames'
import { usePathname, useRouter } from 'next/navigation'

import {
  Container,
  DrupalLink,
  config,
  generateMenuItems,
  useAntdBreakpoints,
  useIsElementOverflowing,
} from '@edw/base'

import './Header.scss'

interface HeaderProps extends MenuProps {
  drawerProps?: DrawerProps
  hamburgerIcon?: React.ReactNode
  logo: React.ReactNode
  menu: MenuEntry[]
  menuProps?: MenuProps
  searchIcon?: React.ReactNode
  user?: React.ReactNode
}

function findMenuItemAndParent(items: any, pathname: null | string) {
  if (!items) return { parentItem: null, selectedItem: null }

  let selectedItem = null
  let parentItem = null

  const searchItems = (items: any, parent = null) => {
    for (const item of items) {
      if (item.to === pathname) {
        selectedItem = item
        parentItem = parent
        return true
      }
      if (item.children && searchItems(item.children, item)) {
        return true
      }
    }
    return false
  }

  searchItems(items)

  return { parentItem, selectedItem } as any
}

const createSearchUrl = (searchText: string, baseUrl: string) => {
  const queryParams = new URLSearchParams({
    'qs-global_search': `filter[fulltext]=${encodeURIComponent(searchText)}&page[limit]=10&page[offset]=0`,
  })
  return `${baseUrl}?${queryParams.toString()}`
}

export const Header: React.FC<HeaderProps> = ({
  drawerProps,
  hamburgerIcon,
  logo,
  menu,
  menuProps,
  searchIcon,
  user: userDropdown,
}) => {
  const breakpoints = useAntdBreakpoints()
  const [isFocused, setIsFocused] = useState(false)
  const [current, setCurrent] = useState('')
  const [openSubsection, setOpenSubsection] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const [searchText, setSearchText] = useState('')

  const searchBaseUrl = config?.drupal?.search?.apps?.global_search?.baseUrl

  const menuRef = useRef<any>(null)

  const [isMenuOverflowing] = useIsElementOverflowing(menuRef?.current)

  const onClick = (e: any) => {
    setCurrent(e.key)
  }

  const items = useMemo(() => {
    return menu && menu.length > 0
      ? generateMenuItems(menu, 'header__menu-item', {
          popupClassName: 'header__popup',
        })
      : []
  }, [menu])

  useEffect(() => {
    const { parentItem, selectedItem } = findMenuItemAndParent(menu, pathname)

    if (selectedItem?.to) {
      setCurrent(selectedItem?.to)
    } else {
      setCurrent('')
    }
    if (parentItem?.to) {
      setOpenSubsection(parentItem?.to)
    } else {
      setOpenSubsection('')
    }
  }, [menu, pathname])

  const isFullscreenDrawer = breakpoints.xs
  const [openDrawer, setOpenDrawer] = useState(false)
  const cannotHoverRef = useRef(false)

  useEffect(() => {
    cannotHoverRef.current = window.matchMedia('not (hover: hover)').matches
  }, [])

  const showDrawer = () => {
    setOpenDrawer(true)
  }

  const onClose = () => {
    setOpenDrawer(false)
  }

  useEffect(() => {
    onClose()
  }, [pathname])

  const headerLogo = useMemo(() => {
    return (
      <>
        {logo && (
          <div className="header__logo">
            <DrupalLink href="/">{logo}</DrupalLink>
          </div>
        )}
      </>
    )
  }, [logo])

  const handleSearch = () => {
    if (searchBaseUrl) {
      const searchUrl = createSearchUrl(searchText, searchBaseUrl)
      router.push(searchUrl)
      setSearchText('')
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchText(value)
  }

  const headerMenuContent = useCallback(
    (isMobile = false, menuRef: any = null) => {
      const suffixIcon = searchIcon ? (
        React.cloneElement(searchIcon as ReactElement, {
          onClick: handleSearch,
        })
      ) : (
        <SearchOutlined onClick={handleSearch} />
      )
      return (
        <>
          <div className="header__aux">
            <div className="header__user">{userDropdown}</div>
            <div
              className={cx('header__search', {
                focused: isFocused,
              })}
            >
              {logo && items && items.length > 0 && (
                <Input
                  placeholder="Search"
                  suffix={suffixIcon}
                  value={searchText}
                  variant={'borderless'}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onPressEnter={handleSearch}
                />
              )}
            </div>
          </div>

          <div className="header__menu" ref={menuRef}>
            <Menu
              defaultOpenKeys={isMobile ? [openSubsection] : []}
              disabledOverflow={true}
              items={items}
              mode={isMobile ? 'inline' : 'horizontal'}
              selectedKeys={[current]}
              onClick={onClick}
              {...menuProps}
            />
          </div>
        </>
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      current,
      items,
      isFocused,
      logo,
      searchText,
      menuProps,
      searchIcon,
      openSubsection,
    ],
  )

  const headerRef = useRef<any>(null)
  return (
    <div className="header" ref={headerRef}>
      {items && items.length > 0 && (
        <>
          {(cannotHoverRef.current ||
            isFullscreenDrawer ||
            isMenuOverflowing) && (
            <div className="header--mobile">
              <Container size="large">
                <div className="header__content">
                  {headerLogo}
                  <a className="header__hamburger" onClick={showDrawer}>
                    {hamburgerIcon || <MenuOutlined />}
                  </a>
                </div>
                <Drawer
                  open={openDrawer}
                  rootClassName="header__drawer"
                  title={isFullscreenDrawer && headerLogo}
                  width={cx({
                    '100%': isFullscreenDrawer,
                    '375px': !isFullscreenDrawer,
                  })}
                  onClose={onClose}
                  destroyOnClose
                  {...drawerProps}
                >
                  {headerMenuContent(true)}
                </Drawer>
              </Container>
            </div>
          )}
          {!cannotHoverRef.current && (
            <div
              className={cx({
                'header--desktop container': true,
                'visually-hidden': isFullscreenDrawer || isMenuOverflowing,
              })}
            >
              {headerLogo}
              <div className="header__content">
                {headerMenuContent(false, menuRef)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Header
