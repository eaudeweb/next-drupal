import FeaturedNewsArrow from '@edw/next-drupal/assets/icons/featured-news-arrow.svg'
import { DrupalLink } from '@edw/next-drupal/components/ui'
import { formatDate } from '@edw/next-drupal/helpers'

const NewsAlternative = ({ entity }: any) => {
  const {
    field_date,
    path = {},
    pseudo_content_preview = '',
    title,
  } = entity as any

  const teaser = (
    <div className="featured-news">
      <div className="featured-news__content">
        <div className="featured-news__left">
          <div className="featured-news__type">NEWS</div>
          {field_date && (
            <div className="featured-news__date">{formatDate(field_date)}</div>
          )}
        </div>
        <div className="featured-news__right">
          {title && <h3 className="featured-news__title">{title}</h3>}
          {pseudo_content_preview && <p>{pseudo_content_preview}</p>}
        </div>
        <FeaturedNewsArrow className="featured-news__arrow" />
      </div>
    </div>
  )

  return path?.alias ? (
    <DrupalLink href={path.alias} passHref>
      {teaser}
    </DrupalLink>
  ) : (
    teaser
  )
}

export default NewsAlternative
