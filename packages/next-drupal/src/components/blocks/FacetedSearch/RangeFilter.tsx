// import { DatePicker } from 'antd'

interface RangeFilterProps {
  picker: string
}

// <DatePicker picker={picker} />

const RangeFilter: React.FC<RangeFilterProps> = ({ picker }) => (
  <div>{picker}</div>
)

export default RangeFilter
