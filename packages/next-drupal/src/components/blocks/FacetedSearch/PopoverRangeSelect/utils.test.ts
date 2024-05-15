import { getButtonType } from './utils'

describe('PopoverRangeSelect utils', () => {
  it('has getButtonType', () => {
    const sortedOptions = ['2000', '2001', '2002', '2003', '2004', '2005']
    expect(getButtonType(0, sortedOptions, ['2000', '2003'], '2001')).toBe(
      'edge',
    )
  })
})
