import { DrupalNode } from 'next-drupal'

export function showBasicHeader(node: DrupalNode): boolean {
  const hasBannerParagraph = (
    fieldContent: Array<{ field_paragraphs: Array<any>; type: string }>,
  ): boolean => {
    if (!fieldContent) return false

    return (
      fieldContent[0]?.type === 'paragraph--edw_banner' ||
      hasBannerParagraph(fieldContent[0]?.field_paragraphs)
    )
  }

  return !hasBannerParagraph(node.field_content || [])
}
