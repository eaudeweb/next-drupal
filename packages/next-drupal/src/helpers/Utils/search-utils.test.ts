import { getCurrentPage, queryHasConditions } from './search-utils'

describe('useSearchApp utils', () => {
  it('getCurrentPage', () => {
    let query
    expect(getCurrentPage(query)).toBe(1)

    query = { filter: {}, page: { limit: '10', offset: '0' }, sort: [] }
    expect(getCurrentPage(query)).toBe(1)

    query = { filter: {}, page: { limit: '10', offset: '10' }, sort: [] }
    expect(getCurrentPage(query)).toBe(2)
  })

  it('queryHasConditions', () => {
    let query

    query = { filter: {}, page: { limit: '10', offset: '0' }, sort: [] }
    expect(queryHasConditions(query)).toBe(false)

    query = {
      filter: { fulltext: '' },
      page: { limit: '10', offset: '0' },
      sort: [],
    }
    expect(queryHasConditions(query)).toBe(false)

    query = {
      filter: { fulltext: 'something' },
      page: { limit: '10', offset: '0' },
      sort: [],
    }
    expect(queryHasConditions(query)).toBe(true)

    query = {
      filter: { fulltext: '', other: { operator: '=', value: '' } },
      page: { limit: '10', offset: '0' },
      sort: [],
    }
    expect(queryHasConditions(query)).toBe(false)

    query = {
      filter: { fulltext: '', other: { operator: '=', value: 'x' } },
      page: { limit: '10', offset: '0' },
      sort: [],
    }
    expect(queryHasConditions(query)).toBe(true)

    query = {
      filter: {
        other: {
          condition: {
            operator: '=',
            path: 'country',
            value: [],
          },
        },
      },
      page: { limit: '10', offset: '0' },
      sort: [],
    }
    expect(queryHasConditions(query)).toBe(false)

    query = {
      filter: {
        fulltext: 'something',
        other: {
          condition: {
            operator: '=',
            path: 'country',
            value: [],
          },
        },
      },
      page: { limit: '10', offset: '0' },
      sort: [],
    }
    expect(queryHasConditions(query)).toBe(true)

    query = {
      filter: {
        fulltext: '',
        other: {
          condition: {
            operator: '=',
            path: 'country',
            value: [],
          },
        },
      },
      page: { limit: '10', offset: '0' },
      sort: [],
    }
    expect(queryHasConditions(query)).toBe(false)

    query = {
      filter: {
        other: {
          condition: {
            operator: '=',
            path: 'country',
            value: ['0'],
          },
        },
      },
      page: { limit: '10', offset: '0' },
      sort: [],
    }
    expect(queryHasConditions(query)).toBe(true)

    query = {
      filter: {
        other: {
          condition: {
            operator: '=',
            path: 'country',
            value: 'something',
          },
        },
      },
      page: { limit: '10', offset: '0' },
      sort: [],
    }
    expect(queryHasConditions(query)).toBe(true)
  })
})
