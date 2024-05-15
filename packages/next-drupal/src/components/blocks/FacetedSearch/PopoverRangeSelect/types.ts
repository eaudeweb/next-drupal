export type OptionValue = string | undefined // one option, such as "2000"
export type FilterValue =
  | []
  | [OptionValue, OptionValue]
  | [OptionValue]
  | undefined

export type ButtonType = 'default' | 'edge' | 'halfSelected' | 'innerSelected'
