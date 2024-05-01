import { Card } from 'antd'
import toggles from 'classnames'

import { DrupalLink } from '@edw/base'

import LocationPin from './location-pin.svg'
import TitleArrow from './title-arrow.svg'

import './Teaser.scss'

const Teaser = ({
  boxShadow = true,
  className,
  customIcon,
  date,
  description,
  dots = true,
  href,
  imageLeft,
  imageRight,
  labels = [],
  location,
  title,
}: any) => {
  const teaser = (
    <Card
      className={toggles({
        [className]: className,
        teaser: true,
        'teaser--with-shadow': boxShadow,
      })}
      bordered={false}
    >
      {dots && (
        <div className="teaser__dots-wrapper">
          {customIcon}
          <div className="teaser__dots"></div>
        </div>
      )}
      <div className="teaser__image-left">{imageLeft}</div>
      {imageRight && <div className="teaser__image-right">{imageRight}</div>}
      <div className="teaser__content">
        {labels.length > 0 && (
          <div className="teaser__labels">
            {labels.map((label: any, key: React.Key) => (
              <div key={key} className="teaser__label tag-text">
                {label}
              </div>
            ))}
          </div>
        )}

        {title && (
          <h3 className="teaser__title">
            {title}
            <TitleArrow className="teaser__title-arrow" />
          </h3>
        )}

        {date && <div className="teaser__date">{date}</div>}

        {location && (
          <div className="teaser__location">
            <LocationPin />
            {location}
          </div>
        )}

        {description && (
          <div className="teaser__description">{description}</div>
        )}
      </div>
    </Card>
  )
  return href ? <DrupalLink href={href}>{teaser}</DrupalLink> : teaser
}

export default Teaser
