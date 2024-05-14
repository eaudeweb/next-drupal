# Next-drupal

## Getting started

There is no release for any of the packages under this repo. To use it please make use of mrs-developer.

1. Install [Nextjs](https://nextjs.org/docs/getting-started/installation) project using `pages` directory. Note: only `next@13.x.x` is supported because of next-auth dependency.

2. Add the following scripts under your `package.json`:

```json
{
   "scripts": {
      ...etc,
      "develop": "npx --yes -p mrs-developer missdev --output=../workspaces --no-config",
      "develop:npx": "npx --yes -p mrs-developer missdev --output=../workspaces --no-config"
   }
}
```

3. Add `pnpm-workspace.yaml` file in your project root, containing:

```yaml
packages:
  - 'workspaces/**/packages/*'
```

4. Add desired dependencies:
```json
{
   "dependencies": {
      "@edw/base": "workspace:*",
      "@edw/drupal": "workspace:*",
   },
   "devDependencies": {
      "eslint-config-custom": "workspace:*",
      "tsconfig": "workspace:*",
   }
}
```

5. Define `.eslintrc.js`. Override with your project necessities. This requires `eslint-config-custom` package.

```js
module.exports = {
  extends: ['custom/next'],
  rules: {
      'react/no-unescaped-entities': 'off',
  },
  ...etc
}
```

6. Define `tsconfig.json`. Override with your project necessities. This requires `tsconfig` package.

```json
{
   "extends": "tsconfig/nextjs.json",
   ...etc
}
```

7. For eslint perfectionist plugin add `internalPaths` under your `package.json` file:

```json
{
   ...etc,
   "internalPaths": [
      "@",
      "~",
      "@idra"
   ]
}
```

8. Bootstrap global config in your `pages/_app.tsx` file

```ts
import { config } from '@edw/base/src'
import { type DrupalConfigRegistry } from '@edw/drupal/src'

import installSite from '@/siteconfig'

Object.assign(
  config as DrupalConfigRegistry,
  installSite(config as DrupalConfigRegistry),
)
```

9. Configure `pages/_app.tsx`:
```tsx
import { App as BaseApp, DefaultLayout } from '@edw/base/src/components'
import { withAuthInitialSession } from '@edw/drupal/src/hof'
import { SessionProvider } from '@edw/drupal/src/lib/auth'

...etc

export default function App({
  Component,
  pageProps: { initialSession, ...pageProps },
}: AppProps): React.JSX.Element {
  const { breadcrumb, error, menus, node } = pageProps

  return (
    <BaseApp initialAppState={{ breadcrumb, menus, node }} theme={theme()}>
      <SessionProvider initialSession={initialSession}>
         <DefaultLayout
            error={error}
            header={<YourHeader />}
            footer={<YourFooter />}
         >
            <Component {...pageProps} />
         </DefaultLayout>
      </SessionProvider>
    </BaseApp>
  )
}


App.getInitialProps = withAuthInitialSession()
```

10. Configure `pages/[[...slug]].tsx`

```tsx
import {
  compose,
  withDrupalCommonResources,
  withDrupalNodeResources,
} from '@edw/drupal/src/hof'

...etc

export const getServerSideProps = compose(
  withDrupalCommonResources,
  withDrupalNodeResources,
)()
```

11. Define `pages/api/auth/[...nextauth].ts` apis for next-auth:

```ts
import NextAuth from '@edw/drupal/src/lib/auth'
export default NextAuth
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
