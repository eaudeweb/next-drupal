import type { Facet, Term } from '@edw/next-drupal/@types'

import { useEffect, useState } from 'react'

import { Button, Flex, TreeSelect } from 'antd'
import { SHOW_PARENT } from 'rc-tree-select'

import { useAntdBreakpoints } from '@edw/next-drupal/hooks'

import './TreeSelectFilter.scss'

interface TreeSelectFilterProps {
  id: string
  label?: React.ReactElement
  onChange: (id: string, value: unknown) => void
  options: Facet['terms']
  placeholder?: string
  // filterValues: any
  value: string[] | undefined
}

type Option = {
  active: boolean
  children?: Array<Option>
  title: string
  value: string
}

type NodeWithChildren = {
  children?: Array<any>
}

//will filter options with count 0, except the ones that are already selected
function filterZeroCountOptions(
  options: any[],
  selectedValues: string[] = [],
): Term[] {
  selectedValues = selectedValues || []

  function hasSelectedDescendant(option: any): boolean {
    if (selectedValues.includes(option.values.value)) {
      return true
    }

    if (option.children) {
      return option.children.some(hasSelectedDescendant)
    }

    return false
  }

  function filterRecursive(options: any[]): Term[] {
    return options.filter((option) => {
      const isSelfOrDescendantSelected = hasSelectedDescendant(option)

      if (option.children) {
        option.children = filterRecursive(option.children)
      }

      return option.values.count !== 0 || isSelfOrDescendantSelected
    })
  }

  return filterRecursive(options)
}

function drupalFacetToTreeData(branch: Term[]): any {
  return branch.map((node: any) => ({
    active: node.values.active,
    title: `${node.values.label} ${
      node?.values?.count ? `(${node.values.count})` : '(0)'
    }`,
    value: node.values.value,
    ...(node.children
      ? { children: drupalFacetToTreeData(node.children) }
      : {}),
  }))
}

function visitNodes<T extends NodeWithChildren>(
  nodes: Array<T>,
  visitor: (node: T) => void,
) {
  nodes.forEach((node) => {
    visitor(node)
    if (node.children) visitNodes(node.children, visitor)
  })
}

const TreeSelectFilter: React.FC<TreeSelectFilterProps> = ({
  id,
  label,
  onChange,
  options,
  placeholder,
  value,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const breakpoints = useAntdBreakpoints()
  const showMobileDropdown = !breakpoints.lg

  const filteredOptions = options
    ? filterZeroCountOptions(options, value ? value : [])
    : []

  const treeData = drupalFacetToTreeData(filteredOptions)

  const initialValues: any = []
  visitNodes<Option>(treeData, (node) => {
    if (node.active) initialValues.push(node.value)
  })

  const [selectedValues, setSelectedValues] = useState<string[]>(initialValues)

  useEffect(() => {
    if (value) {
      setSelectedValues(value)
    } else {
      setSelectedValues([])
    }
    //reset
    if (value && value.length === 0 && initialValues.length === 0) {
      setSelectedValues([])
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, value])

  const handleChange = (newVal: string[]) => {
    setSelectedValues(newVal)
    if (!dropdownOpen) {
      onChange(id, newVal)
    }
  }
  const handleDropdownStateChange = (open: boolean) => {
    setDropdownOpen(open)
    if (!open) {
      onChange(id, selectedValues)
    }
  }

  const handleSubmit = () => {
    onChange(id, selectedValues)
    setDropdownOpen(false)
  }

  const handleCancel = () => {
    setSelectedValues(initialValues)
    setDropdownOpen(false)
  }

  return (
    <div className="tree-select-filter">
      {label}
      <TreeSelect
        className="tree-select-filter__select"
        filterTreeNode={true}
        open={dropdownOpen}
        placeholder={placeholder}
        popupClassName={`tree-select-filter__dropdown-container ${showMobileDropdown ? 'tree-select-filter__mobile-dropdown-container' : ''}`}
        showCheckedStrategy={SHOW_PARENT}
        showSearch={true}
        treeCheckable={true}
        treeData={treeData}
        treeIcon={true}
        treeLine={{ showLeafIcon: false }}
        treeNodeFilterProp="title"
        value={selectedValues}
        virtual={false}
        dropdownRender={(dropdownContent) => {
          return (
            <div>
              {dropdownContent}
              <Flex
                className="tree-select-filter__dropdown-actions-container"
                justify="space-between"
              >
                <Button
                  className="tree-select-filter__dropdown-actions-submit"
                  onClick={handleSubmit}
                >
                  Apply
                </Button>
                <Button
                  className="tree-select-filter__dropdown-actions-cancel"
                  onClick={handleCancel}
                >
                  Close
                </Button>
              </Flex>
            </div>
          )
        }}
        onChange={handleChange}
        onDropdownVisibleChange={(open) => handleDropdownStateChange(open)}
      />
    </div>
  )
}

export default TreeSelectFilter
