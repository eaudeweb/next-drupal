import { UserOutlined } from '@ant-design/icons'
import { Dropdown, DropdownProps, Flex, MenuProps } from 'antd'
import { useSession } from 'next-auth/react'

import { useDefaultBreakpoint } from '@edw/base'
import { DrupalLink } from '@edw/base/src/molecules'
import { signOut } from '@edw/drupal/lib/auth'

type Props = {
  dropdown?: DropdownProps
}

export const UserDropdown: React.FC<Props> = ({ dropdown }) => {
  const session = useSession()
  const isInDefaultBreakpoint = useDefaultBreakpoint()

  if (session?.status === 'unauthenticated' || session?.status === 'loading')
    return null

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <a onClick={() => signOut()}>Log out</a>,
    },
  ]

  const { menu, ...dropdownProps } = dropdown || {}

  return (
    <Dropdown
      {...dropdownProps}
      menu={{
        ...{
          items: items,
          mode: !isInDefaultBreakpoint ? 'inline' : undefined,
        },
        ...menu,
      }}
    >
      <DrupalLink href="/user">
        <Flex gap={10}>
          <UserOutlined />{' '}
          {session?.data?.user?.email && session?.data?.user?.email}
        </Flex>
      </DrupalLink>
    </Dropdown>
  )
}
