import React, { useEffect, useState } from 'react'

import { Flex, Select } from 'antd'

import { ResolvedQuery } from '../../types'

const { Option } = Select

const findValueMatchingSort = (query: any, config: any) => {
  for (const key in config) {
    if (config[key].field === query.sort) {
      return key
    }
  }
  return 'alpha-asc'
}

const filterConfigOptions = (config: any, key: string) => {
  const newConfig = { ...config }

  if (newConfig[key]) {
    delete newConfig[key]
  }

  return newConfig
}

const Sort: React.FC<{
  configOptions: Record<string, { field: string; label: string }>
  onChange: (field: string) => void
  query: ResolvedQuery
}> = ({ configOptions, onChange, query }) => {
  const [selectedValue, setSelectedValue] = useState('')

  const hasFulltextQuery = query && query.filter && query.filter.fulltext

  //remove relevance option is theres no fulltext query
  const sortOptions = hasFulltextQuery
    ? configOptions
    : filterConfigOptions(configOptions, 'relevance')

  useEffect(() => {
    const matchingQuerySort = findValueMatchingSort(query, sortOptions)
    setSelectedValue(matchingQuerySort)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.sort, sortOptions])

  const handleChange = (value: string) => {
    const selectedOption = configOptions[value]
    if (selectedOption) {
      onChange(selectedOption.field)
      setSelectedValue(value)
    }
  }

  return (
    <Flex className="faceted-search__sort" align="center">
      <p>Sort by</p>
      <Select
        popupMatchSelectWidth={false}
        value={selectedValue}
        onChange={handleChange}
      >
        {Object.entries(sortOptions).map(([key, option]: any) => (
          <Option key={key} value={key}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Flex>
  )
}

export default Sort
