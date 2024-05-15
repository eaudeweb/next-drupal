import SingleSelectFilter from './SingleSelectFilter'

type FilterTypeSelectorProps = {
  disabled?: boolean
  id: string
  label: string
  onChange: (id: string, value: unknown) => void
  options: string[][]
  value: string | undefined
}

const FilterTypeSelector: React.FC<FilterTypeSelectorProps> = ({
  id,
  disabled = false,
  label,
  onChange,
  options,
  value,
}) => {
  return (
    <SingleSelectFilter
      id={id}
      disabled={disabled}
      label={label}
      options={options}
      value={value}
      onChange={onChange}
    />
  )
}

export default FilterTypeSelector
