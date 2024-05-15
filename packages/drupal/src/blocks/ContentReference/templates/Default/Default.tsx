import { Button, Card } from 'antd'

const Default = ({ entity }: any) => {
  return (
    <div>
      {' '}
      <Card
        className="content-reference-card"
        title={entity?.title || 'No Title'}
      >
        {entity?.path?.alias ? (
          <a href={entity.path.alias}>
            <Button type="primary">Visit</Button>
          </a>
        ) : (
          'Alias not set for this item'
        )}
      </Card>
    </div>
  )
}

export default Default
