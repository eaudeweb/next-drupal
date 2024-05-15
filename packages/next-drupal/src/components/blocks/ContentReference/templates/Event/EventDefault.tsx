import MeetingIcon from '@edw/next-drupal/assets/icons/meeting-icon.svg'
import {
  formatDatesAsInterval,
  getDateBasedStatusLabel,
} from '@edw/next-drupal/helpers'
import { Teaser } from '@edw/next-drupal/molecules'

const EventDefault = ({ entity }: any) => {
  const {
    field_country,
    field_date_range,
    field_event_city,
    field_event_presence,
    field_event_venue,
    field_hide_date,
    path = {},
    title,
  } = entity as any

  const startDate = field_date_range?.value
  const endDate = field_date_range?.end_value

  return (
    <Teaser
      href={path?.alias}
      imageRight={<MeetingIcon className="meeting-icon" />}
      labels={[`${getDateBasedStatusLabel(startDate, endDate)} Meeting`]}
      title={title}
      date={
        !field_hide_date &&
        field_date_range?.end_value &&
        field_date_range?.value && (
          <>
            {formatDatesAsInterval(
              field_date_range?.value,
              field_date_range?.end_value,
            )}
          </>
        )
      }
      location={
        (field_event_venue ||
          field_event_city ||
          field_country ||
          field_event_presence) && (
          <span>
            {field_event_venue?.value &&
              `${field_event_venue.value}${
                field_event_city || field_country ? ', ' : ''
              }`}
            {field_event_city &&
              `${field_event_city}${field_country ? ', ' : ''}`}
            {field_country?.name}
            {/* @todo: refactor all meeting info into one component */}
            {field_event_presence == 'virtual' && ` (Online)`}
            {!field_event_venue &&
              !field_event_city &&
              !field_country &&
              field_event_presence}
          </span>
        )
      }
    ></Teaser>
  )
}

export default EventDefault
