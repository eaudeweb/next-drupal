import React, { useCallback, useEffect, useState } from 'react'

import { AutoComplete, Input } from 'antd'
import { useRouter } from 'next/router'

import { useAutoComplete } from '../../lib/useAutoComplete'
import SearchIcon from '../../public/search.svg'
import { AutoCompleteItem } from '../../types'

interface AutocompleteSearchInputProps {
  autocompleteTextLabel?: string
  id: string
  isLoading: boolean
  onAddChange: (id: string, value: string | string[]) => void
  onChange: (id: string, value: string | string[]) => void
  onDirectChange: (id: string, value: string | string[]) => void
  placeholder: string
  searchIndex: string
  useAutoCompleteSearch: boolean
  value: string | undefined
}

const AutocompleteEntry: React.FC<{ item: AutoCompleteItem }> = ({ item }) => (
  <>{item.value}</>
)

const AutocompleteSearchInput: React.FC<AutocompleteSearchInputProps> = ({
  id,
  autocompleteTextLabel,
  onAddChange,
  onChange,
  onDirectChange,
  placeholder,
  searchIndex,
  useAutoCompleteSearch,
  value = '',
}) => {
  const [inputValue, setInputValue] = useState(value)
  const autocomplete = useAutoCompleteSearch
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useAutoComplete(searchIndex, inputValue)
    : { data: {} }

  const router = useRouter()

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      if (e.type === 'click') {
        onDirectChange(id, '')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const handleBlur = useCallback(() => {
    onChange(id, inputValue)
  }, [id, inputValue, onChange])

  const onSelect = useCallback(
    (value: string, option: { entry: AutoCompleteItem }) => {
      const { entry } = option
      if (entry.fields.filter) {
        setInputValue('')
        // add filter to already existing
        onAddChange(entry.fields.filter, [entry.link])
      } else if (entry.link) {
        router.push({ query: { slug: entry.link.split('/').filter(Boolean) } })
      } else {
        //search directly when selecting the autocomplete val
        onDirectChange(id, value)
      }
    },
    [onAddChange, onDirectChange, router, id],
  )

  const textentry =
    inputValue && autocompleteTextLabel
      ? {
          key: 'autocompleteText',
          label: autocompleteTextLabel,
          options: [
            {
              key: 'autocompleteText-1',
              entry: {
                fields: {},
              },
              label: inputValue,
              value: inputValue,
            },
          ],
        }
      : null

  const options = [
    ...(textentry ? [textentry] : []),
    ...(Object.keys(autocomplete.data).length > 0
      ? [
          ...Object.entries(autocomplete.data).map(
            ([category, entries]: [any, any], i) => ({
              key: `${i}-${category}`,
              label: category,
              options:
                entries && entries.length > 0
                  ? entries.map((entry: any, j: any) => ({
                      key: `${j}-${category}-item`,
                      entry,
                      label: (
                        <AutocompleteEntry
                          key={`${j}-${category}-label`}
                          item={entry}
                        />
                      ),
                      value: `${j}-${category}-item`,
                    }))
                  : [],
            }),
          ),
        ]
      : []),
  ]

  return (
    <AutoComplete
      options={options as any}
      value={inputValue}
      onSelect={onSelect}
    >
      <Input.Search
        className="handbook-large-search-input"
        enterButton={<SearchIcon />}
        placeholder={placeholder}
        onBlur={handleBlur}
        onChange={handleInputChange}
        allowClear
      />
    </AutoComplete>
  )
}

export default AutocompleteSearchInput
