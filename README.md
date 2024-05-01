# MultilateralFund Website

## Prerequisites

* NVM https://github.com/nvm-sh/nvm

## Getting started

1. Copy `apps/multilateralfund/.env.example` to `apps/multilateralfund/.env` and customise `NEXT_PUBLIC_DRUPAL_BASE_URL` and `NEXT_IMAGE_DOMAIN` with the URL and domain of the Drupal website.\
Local Drupal website can be used e.g:
```
   NEXT_PUBLIC_DRUPAL_BASE_URL=https://multilateralfund.ddev.site:14443/
   NEXT_IMAGE_DOMAIN=multilateralfund.ddev.site
```

2. Run:

```bash
nvm install
nvm use
npm install -g pnpm
make install
make dev
```

## Technology stack

- [Nextjs](https://nextjs.org/) - React-based web development framework
- [Drupal-Next](https://next-drupal.org/) - JS lib to communicate with Drupal backends
- [Antd](https://ant.design/) - React component library and theming engine
- [TanStack/Query](https://tanstack.com/query/v5/) - Data management library

### Infrastructure stack

- [Storybook](https://storybook.js.org/) - Document and test UI Components
- [Jest](https://jestjs.io/) - Javascript testing library
- [React](https://react.dev/) - Javascript frontend development library
- [Typescript](https://www.typescriptlang.org/) - Superset of JS, provides static types
- [Turbo Repo](https://turbo.build/repo) - Incremental bundler and build system
- [pnpm](https://pnpm.io/) - Javascript package manager with support for workspaces
- [Docker](https://docs.docker.com/) - Container-based deployment

## Current features:

- basic Nextjs app, uses "pages" router
- typescript
- drupal-next used to integrate with Drupal
- antd with SSR css file generation
- custom theme for antd
- storybook
- jest tests
- makefile shortcuts

## Architecture

### The Base UI library

The `packages/base` folder has the base library

We follow an Atomic Design approach. See this article for a [short overview of Atomic Design](https://blog.logrocket.com/atomic-design-react-native/)

We use the following structure to host our components:

- `atoms`: we don't have yet any
- `molecules` - basic components
- `blocks` - Recipes for bigger components
- `global` - Site-wide recipes. Such as basic layout, footer, header, etc.
- `templates` - Full pages and layouts

# TODO:

- improve Dockerfile, see https://github.com/ReeceRose/next.js-template/tree/main
- See https://levelup.gitconnected.com/how-to-make-your-library-tree-shakable-20b5a446c1e2 to package the library and https://github.com/egoist/tsup
- See https://github.com/vercel/turbo/blob/main/examples/kitchen-sink/packages/eslint-config-custom/next.js

- https://typescript-eslint.io/blog/parser-options-project-true/
- https://github.com/antfu/eslint-config
- https://dotfyle.com/
- https://github.com/vercel/platforms/blob/main/app/app/
- https://github.com/haydenbleasel/next-forge/tree/main
- https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module
- https://www.drupal.org/project/api_client
- https://git.drupalcode.org/project/api_client/-/blob/canary/packages/json-api-client/src/JsonApiClient.ts?ref_type=heads
- https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/
https://dev.to/gvergnaud/bringing-pattern-matching-to-typescript-introducing-ts-pattern-v3-0-o1k

## jq filters

- Select a country from a facet

```
jq '.meta.facets[] | objects | select(.id == "jsonapi_country").terms[] | select(.values.value == "180")'
```
