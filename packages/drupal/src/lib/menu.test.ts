import { buildMenu } from './menu'

const fixture = {
  data: [
    {
      id: 'menu_link_content:e2a77ce8-8101-483a-b88f-532695a61f3b',
      attributes: {
        description: null,
        enabled: true,
        expanded: true,
        menu_name: 'main',
        meta: {
          entity_id: '2',
        },
        options: [],
        parent: '',
        provider: 'menu_link_content',
        route: {
          name: '',
          parameters: [],
        },
        title: 'About MLF',
        url: '/about',
        weight: -50,
      },
      type: 'menu_link_content--menu_link_content',
    },
    {
      id: 'menu_link_content:4f94a8e8-75cd-4572-a03d-e87f449881ea',
      attributes: {
        description: null,
        enabled: true,
        expanded: true,
        menu_name: 'main',
        meta: {
          entity_id: '5',
        },
        options: [],
        parent: 'menu_link_content:e2a77ce8-8101-483a-b88f-532695a61f3b',
        provider: 'menu_link_content',
        route: {
          name: '',
          parameters: [],
        },
        title: 'Mission',
        url: '/about/mission',
        weight: -50,
      },
      type: 'menu_link_content--menu_link_content',
    },
    {
      id: 'menu_link_content:4a8fb728-db89-4b6a-aadf-1ca1192cad7a',
      attributes: {
        description: null,
        enabled: true,
        expanded: true,
        menu_name: 'main',
        meta: {
          entity_id: '6',
        },
        options: [],
        parent: 'menu_link_content:e2a77ce8-8101-483a-b88f-532695a61f3b',
        provider: 'menu_link_content',
        route: {
          name: '',
          parameters: [],
        },
        title: 'History',
        url: '/about/history',
        weight: -49,
      },
      type: 'menu_link_content--menu_link_content',
    },
    {
      id: 'menu_link_content:92298467-86a0-4fe0-bca9-4f133ac02a13',
      attributes: {
        description: null,
        enabled: true,
        expanded: true,
        menu_name: 'main',
        meta: {
          entity_id: '3',
        },
        options: [],
        parent: '',
        provider: 'menu_link_content',
        route: {
          name: '',
          parameters: [],
        },
        title: 'Our impart',
        url: '/our-impact',
        weight: -49,
      },
      type: 'menu_link_content--menu_link_content',
    },
    {
      id: 'menu_link_content:b49c1e70-0fe7-413d-9fcd-9dabc72b2723',
      attributes: {
        description: null,
        enabled: true,
        expanded: true,
        menu_name: 'main',
        meta: {
          entity_id: '4',
        },
        options: [],
        parent: '',
        provider: 'menu_link_content',
        route: {
          name: '',
          parameters: [],
        },
        title: 'Projects & Data',
        url: '/projects',
        weight: -48,
      },
      type: 'menu_link_content--menu_link_content',
    },
    {
      id: 'menu_link_content:68b1359f-a209-4347-9596-06a4ac2983ff',
      attributes: {
        description: 'Lorem ipsum',
        enabled: true,
        expanded: true,
        menu_name: 'main',
        meta: {
          entity_id: '7',
        },
        options: {
          attributes: {
            class: ['resources'],
          },
        },
        parent: '',
        provider: 'menu_link_content',
        route: {
          name: '',
          parameters: [],
        },
        title: 'Resources',
        url: '/resources',
        weight: -47,
      },
      type: 'menu_link_content--menu_link_content',
    },
    {
      id: 'menu_link_content:7c6909db-9f90-4ec2-89d5-8fa75dfa94bb',
      attributes: {
        description: null,
        enabled: true,
        expanded: true,
        menu_name: 'main',
        meta: {
          entity_id: '8',
        },
        options: [],
        parent: 'menu_link_content:68b1359f-a209-4347-9596-06a4ac2983ff',
        provider: 'menu_link_content',
        route: {
          name: '',
          parameters: [],
        },
        title: 'Decision Handbook',
        url: '/handbook',
        weight: 0,
      },
      type: 'menu_link_content--menu_link_content',
    },
    {
      id: 'menu_link_content:03f4ca83-384a-4cd4-a5a8-34642ad1131f',
      attributes: {
        description: null,
        enabled: true,
        expanded: false,
        menu_name: 'main',
        meta: {
          entity_id: '9',
        },
        options: [],
        parent: 'menu_link_content:7c6909db-9f90-4ec2-89d5-8fa75dfa94bb',
        provider: 'menu_link_content',
        route: {
          name: 'entity.node.canonical',
          parameters: {
            node: '665',
          },
        },
        title: 'Decision 20/1',
        url: '/node/665',
        weight: -50,
      },
      type: 'menu_link_content--menu_link_content',
    },
    {
      id: 'menu_link_content:3ac9ff65-2df2-4cc8-8a59-743b69ab1b10',
      attributes: {
        description: null,
        enabled: true,
        expanded: true,
        menu_name: 'main',
        meta: {
          entity_id: '1',
        },
        options: [],
        parent: '',
        provider: 'menu_link_content',
        route: {
          name: 'entity.node.canonical',
          parameters: {
            node: '4890',
          },
        },
        title: 'Careers',
        url: '/page/careers',
        weight: -46,
      },
      type: 'menu_link_content--menu_link_content',
    },
  ],
  jsonapi: {
    meta: {
      links: {
        self: {
          href: 'http://jsonapi.org/format/1.0/',
        },
      },
    },
    version: '1.0',
  },
  links: {
    self: {
      href: 'https://test.admin.multilateralfund.edw.ro/jsonapi/menu_items/main',
    },
  },
}

describe('menu.buildMenu', () => {
  it('can extract menu', () => {
    const menu = buildMenu(fixture.data)
    expect(menu).toStrictEqual([
      {
        children: [
          { label: 'Mission', to: '/about/mission' },
          { label: 'History', to: '/about/history' },
        ],
        label: 'About MLF',
        to: '/about',
      },
      { label: 'Our impart', to: '/our-impact' },
      { label: 'Projects & Data', to: '/projects' },
      {
        children: [
          {
            children: [{ label: 'Decision 20/1', to: '/node/665' }],
            label: 'Decision Handbook',
            to: '/handbook',
          },
        ],
        label: 'Resources',
        to: '/resources',
      },
      { label: 'Careers', to: '/page/careers' },
    ])

    // import util from 'node:util'
    // console.log(util.inspect(menu, { depth: null }))
  })
})
