import { Teaser } from '@edw/next-drupal/molecules'

const ProjectDefault = ({ entity }: any) => {
  const { body, path = {}, title } = entity as any

  return (
    <Teaser
      href={path?.alias}
      title={title}
      description={
        !!(body?.processed as boolean) && (
          <div dangerouslySetInnerHTML={{ __html: body?.processed }} />
        )
      }
    />
  )
}

export default ProjectDefault
