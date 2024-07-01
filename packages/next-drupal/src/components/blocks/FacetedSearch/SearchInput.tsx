import React, { useCallback, useEffect, useState } from 'react'

import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import classNames from 'classnames'

interface SearchInputProps {
  id: string
  onChange: (id: string, value: string | string[]) => void
  placeholder: string
  value: string | undefined
}

const SearchInput: React.FC<SearchInputProps> = ({
  id,
  onChange,
  placeholder,
  value = '',
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      if (e.type === 'click') {
        onChange(id, '')
      }
    },
    [id, onChange],
  )

  const handleSearch = () => {
    onChange(id, inputValue)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <div
      className={classNames('search-input-wrapper', {
        expanded: isFocused || inputValue,
      })}
    >
      <Input
        className="simple-search-input"
        placeholder={placeholder}
        suffix={<SearchOutlined />}
        value={inputValue}
        onBlur={handleBlur}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onPressEnter={handleSearch}
        allowClear
      />
    </div>
  )
}

export default SearchInput
