import { useState } from 'react'

import { CloseOutlined } from '@ant-design/icons'
import { Button, Flex, Input, Modal } from 'antd'
import { useRouter } from 'next/router'

import { signIn } from '@edw/drupal/lib/auth'

import './LoginModal.scss'

interface LoginModalProps {
  isVisible: boolean
  onClose: () => void
  title: string
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isVisible,
  onClose,
  title,
}) => {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleCancel = () => {
    onClose()
    setUsername('')
    setPassword('')
    setError('')
  }

  const useLoginHandle = async () => {
    const result = await signIn('credentials', {
      password,
      redirect: false,
      username,
    })

    if (result?.ok) {
      router.reload()
      return
    }

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        setError('Invalid username or password. Please try again.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } else {
      setError('')
      onClose()
      setUsername('')
      setPassword('')
    }
  }

  return (
    <Modal
      className="login-modal"
      closeIcon={<CloseOutlined />}
      footer={null}
      open={isVisible}
      title={<h3>{title}</h3>}
      width={595}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Flex vertical>
        <Input
          placeholder="USERNAME"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="PASSWORD"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="login-modal__error">{error}</div>}
        <Button
          className="login-modal__button"
          disabled={!username || !password}
          type="primary"
          onClick={useLoginHandle}
        >
          SUBMIT
        </Button>
      </Flex>
    </Modal>
  )
}
