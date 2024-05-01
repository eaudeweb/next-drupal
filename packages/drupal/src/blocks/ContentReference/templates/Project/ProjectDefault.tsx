import { Teaser } from '@edw/drupal'

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
    ></Teaser>
  )
}

export default ProjectDefault
