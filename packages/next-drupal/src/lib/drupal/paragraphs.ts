import { type JsonApiResource } from 'next-drupal'

import { fetchResource } from './content'

export const fetchParagraph = async (
  paragraph: JsonApiResource,
): Promise<JsonApiResource | null> => {
  const paragraphData = await fetchResource(paragraph.type, paragraph.id)

  if (paragraphData?.field_media) {
    const mediaData = await fetchResource(
      paragraphData.field_media.type,
      paragraphData.field_media.id,
    )
    if (mediaData?.field_media_image?.id) {
      const imageData = await fetchResource(
        mediaData.field_media_image.type,
        mediaData.field_media_image.id,
      )
      if (imageData?.uri?.url) {
        paragraphData.field_media.url = imageData.uri.url
      }
    }
  }

  if (paragraphData?.field_background_media) {
    const bgMediaData = await fetchResource(
      paragraphData.field_background_media.type,
      paragraphData.field_background_media.id,
    )
    if (bgMediaData?.field_media_image?.id) {
      const imageData = await fetchResource(
        bgMediaData.field_media_image.type,
        bgMediaData.field_media_image.id,
      )
      if (imageData?.uri?.url) {
        paragraphData.field_background_media.url = imageData.uri.url
      }
    }
  }

  // TODO: temporarily disabled, should be fixed if this function is needed
  // if (paragraphData?.field_paragraphs?.length > 0) {
  //   paragraphData.field_paragraphs = await Promise.all(
  //     paragraphData.field_paragraphs?.map(
  //       async (p: JsonApiResource) => await fetchParagraph(p)
  //     ) ?? []
  //   )
  // }
  // console.log(config)

  return paragraphData
}
