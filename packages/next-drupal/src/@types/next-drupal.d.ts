import type { DrupalTranslatedPath as NextDrupalTranslatedPath } from 'next-drupal'

declare module 'next-drupal' {
  interface DrupalTranslatedPath extends NextDrupalTranslatedPath {
    jsonapi_include?: []
  }
}
