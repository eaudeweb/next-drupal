# Drupal CMS for nextjs

### @todo list ✓

#### Packages

- [ ] Remove beta versions for the following packages:
- [ ] Upgrate packages:
  - [ ] `next-auth@5.0.0` - still in beta - here is a guide to [migrating-to-v5](https://authjs.dev/getting-started/migrating-to-v5). @razvanMiu
  - [ ] `typescript@5.5.0-dev` - this version adds a [${configDir}](https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta/#the-configdir-template-variable-for-configuration-files) parameter that can be used to dynamicaly write tsconfig.json files. @razvanMiu

#### Authentication

Some of these are very unlikely to happen.

- [ ] Fix: when access_token expired, refresh_token still valid, if changing the current page and closing the window before SSR finished, the session will be lost. **Might be imposible to solve**. @razvanMiu
- [ ] Fix: when access_token expired, refresh_token still valid, if fast changing between 2 or more tabs of the same application the session will be lost because multiple requests to refresh the token will be sent with the same refresh_token. **Might be imposible to solve**. @razvanMiu
- [x] Fix: when multiple tabs of the same application are opened, sign-in in one tab (TAB-1) will trigger a broadcast event to other tabs. When clicking on an inactive tab (TAB-2) after sign-in in the previous tab (TAB-1) initially the session state update doesn't propagate. Activating another tab (TAB-3) and then comming back to (TAB-2) triggers the session state update. @razvanMiu
- [x] Fix: when multiple tabs of the same application are opened, sign-in in one tab should trigger a refresh in the other tabs. This will fix the bug above. This behavior works on sign-out. @razvanMiu

#### Others

- [ ] In `tsconfig` package include types declarations files (\*.d.ts) from `node_modules/@edw` namespace without going back one directory. @razvanMiu
- [ ] Don't show antd warning `findDOMNode is deprecated` that was reported here [2020](https://github.com/ant-design/ant-design/issues/22493) and here [2023](https://github.com/ant-design/ant-design/issues/41183). @razvanMiu
- [ ] Fix `React does not recognize the 'fetchPriority' prop on a DOM element.` warning thrown by `@edw/base/global/OptimizedImage.tsx`. @razvanMiu

#### Project structure:

- [ ] Make project structure consistent. @razvanMiu

```
.
├── 📂 apps
│   ├── 📂 idraliance
│   └── 📂 multilateralfund
├── 📂 packages
│   ├── 📂 base
│   │   ├── 📂 src
│   │   │   ├── 📂 components
│   │   │   │   ├── 📂 theme
│   │   │   │   │   ├── 📂 Header
│   │   │   │   │   │   ├── 🟦 Header.tsx
│   │   │   │   │   │   └── 🟦 AuthHeader.tsx
│   │   │   │   │   ├── 📁 Footer
│   │   │   │   │   ├── 📁 Layout
│   │   │   │   │   ├── 📁 Error
│   │   │   │   │   └── ...etc
│   │   │   │   ├── 📂 ui
│   │   │   │   │   ├── 📁 Button
│   │   │   │   │   ├── 📁 Link
│   │   │   │   │   ├── 📁 Dropdown
│   │   │   │   │   └── ...etc
│   │   │   ├── 📂 hooks
│   │   │   │   ├── 🟦 usePrevious.ts
│   │   │   │   └── ...etc
│   │   │   ├── 📂 hocs // Heigher order componets
│   │   │   │   ├── 🟦 withRouter.ts
│   │   │   │   └── ...etc
│   │   │   ├── 📂 hofs // Heigher order componets
│   │   │   │   ├── 🟦 applyAuthGuard.ts
│   │   │   │   ├── 🟦 applyConfig.ts
│   │   │   │   └── ...etc
│   │   │   ├── 📂 helpers
│   │   │   │   ├── 📂 Api
│   │   │   │   │   ├── 🟦 Api.ts
│   │   │   │   │   └── ...etc
│   │   │   │   ├── 📁 Antd
│   │   │   │   ├── 📁 Url
│   │   │   │   └── ...etc
│   │   │   ├── 📂 config
│   │   │   │   ├── 🟦 index.ts // Base config
│   │   │   │   └── ...etc
│   │   │   ├── 📂 styles
│   │   │   │   ├── 📂 mixins
│   │   │   │   │   ├── 🟪 someMixin.scss
│   │   │   │   │   └── ...etc
│   │   │   │   ├── 📂 functions
│   │   │   │   │   ├── 🟪 someFunction.scss
│   │   │   │   │   └── ...etc
│   │   │   │   ├── 📂 vars
│   │   │   │   │   ├── 🟪 someVarsFile.scss
│   │   │   │   │   └── ...etc
│   │   │   │   └── 🟪 index.scss // @forward all required styles for base theme
│   │   ├── ⬜ package.json
│   │   └── ⬜ tsconfig.json
│   ├── 📂 drupal
│   │   ├── 📂 src
│   │   │   ├── 📂 components
│   │   │   │   ├── 📁 blocks
│   │   │   │   ├── 📁 paragraphs
│   │   │   │   ├── 📂 theme // Only if drupal node is needed
│   │   │   │   │   ├── 📂 Header
│   │   │   │   │   │   ├── 🟦 Header.tsx
│   │   │   │   │   │   └── 🟦 AuthHeader.tsx
│   │   │   │   │   ├── 📁 Footer
│   │   │   │   │   ├── 📁 Layout
│   │   │   │   │   ├── 📁 Error
│   │   │   │   │   └── ...etc
│   │   │   │   ├── 📂 ui // Only if drupal node is needed
│   │   │   │   │   ├── 📁 Button
│   │   │   │   │   ├── 📁 Link
│   │   │   │   │   ├── 📁 Dropdown
│   │   │   │   │   └── ...etc
│   │   │   ├── 📂 hooks
│   │   │   │   ├── 🟦 useNode.ts
│   │   │   │   └── ...etc
│   │   │   ├── 📂 hocs // Heigher order componets
│   │   │   │   ├── 🟦 withNode.ts
│   │   │   │   └── ...etc
│   │   │   ├── 📂 hofs // Heigher order componets
│   │   │   │   ├── 🟦 applyNodeAuthGuard.ts
│   │   │   │   ├── 🟦 applyConfig.ts
│   │   │   │   └── ...etc
│   │   │   ├── 📂 helpers
│   │   │   │   ├── 📂 Auth
│   │   │   │   │   ├── 🟦 Auth.ts
│   │   │   │   │   └── ...etc
│   │   │   │   ├── 📁 Drupal
│   │   │   │   └── ...etc
│   │   │   ├── 📂 config
│   │   │   │   ├── 📂 Blocks
│   │   │   │   │   └── 🟦 Blocks.ts
│   │   │   │   ├── 📂 Paragraphs
│   │   │   │   │   └── 🟦 Paragraphs.ts
│   │   │   │   ├── 🟦 index.ts // Drupal config
│   │   │   │   └── ...etc
│   │   │   ├── 📂 styles
│   │   │   │   ├── 📂 vars
│   │   │   │   │   ├── 🟪 someVarsFile.scss
│   │   │   │   │   └── ...etc
│   │   │   │   └── 🟪 index.scss // @forward all required styles for drupal theme
│   │   ├── ⬜ package.json
│   │   └── ⬜ tsconfig.json
│   ├── 📁 eslint-config-custom
│   └── 📁 tsconfig
├── 📁 scripts
├── ⬜ Makefile
├── ⬜ package.json
├── ⬜ tsconfig.json
└── ...etc
```
