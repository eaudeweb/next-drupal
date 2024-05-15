import { Button, Card } from 'antd'

import { DrupalLink } from '@edw/next-drupal/components/ui'

const Default = ({ entity }: any) => {
  return (
    <div>
      <Card
        className="content-reference-card"
        title={entity?.title || 'No Title'}
      >
        {entity?.path?.alias ? (
          <DrupalLink href={entity.path.alias}>
            <Button type="primary">Visit</Button>
          </DrupalLink>
        ) : (
          'Alias not set for this item'
        )}
      </Card>
    </div>
  )
}

export default Default
