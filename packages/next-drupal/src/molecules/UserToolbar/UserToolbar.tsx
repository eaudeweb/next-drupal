import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useSession } from 'next-auth/react'

import { DrupalLink } from '@edw/next-drupal/components/ui'
import { signOut } from '@edw/next-drupal/lib/auth'

import './UserToolbar.scss'

export const UserToolbar = () => {
  const session = useSession()

  if (session?.status === 'unauthenticated' || session?.status === 'loading')
    return null

  return (
    <div className="user-toolbar__container">
      <div className="user-toolbar__first-level">
        {session?.data?.user?.email && (
          <p className="user-toolbar__first-level__user">
            <UserOutlined />
            {session?.data?.user?.email}
          </p>
        )}
      </div>
      <div className="user-toolbar__second-level">
        <DrupalLink
          className="user-toolbar__second-level__view-profile"
          href="/user"
        >
          View profile
        </DrupalLink>
        <button
          className="user-toolbar__second-level__logout"
          onClick={() => signOut()}
        >
          <LogoutOutlined />
          Log out
        </button>
      </div>
    </div>
  )
}
