import Circle from '@edw/next-drupal/assets/icons/circle.svg'
import { formatDate } from '@edw/next-drupal/helpers'
import { Image, Teaser } from '@edw/next-drupal/molecules'

const NewsDefault = ({ entity }: any) => {
  const {
    field_date,
    field_hide_date,
    field_image: field_media = {},
    field_news_types = [],
    path = {},
    pseudo_content_preview = '',
    title,
  } = entity as any

  const typeLabels =
    field_news_types.length > 0 &&
    field_news_types.map((type: any) => type.name)

  return (
    <Teaser
      description={pseudo_content_preview}
      href={path?.alias}
      imageLeft={<Image height={768} media={field_media} width={768} />}
      labels={typeLabels}
      title={title}
      date={
        !field_hide_date &&
        field_date && (
          <>
            <Circle />
            <span className="teaser__news-date">
              {formatDate(field_date, {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </>
        )
      }
    ></Teaser>
  )
}

export default NewsDefault
