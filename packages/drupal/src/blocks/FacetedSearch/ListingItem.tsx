import { ListingItem, SearchAppConfig } from '../../types'

type ListingItemProps = {
  appConfig: SearchAppConfig
} & ListingItem

const ListingItemView: React.FC<ListingItemProps> = ({
  appConfig,
  item,
  searchText,
}) => {
  if (!appConfig || !appConfig.listingItems) {
    return <span>Listing items configuration is not available</span>
  }

  if (!(item.type in appConfig.listingItems)) {
    return (
      <span>Listing item type not found in configuration: {item.type}</span>
    )
  }

  const View = appConfig.listingItems[item.type].view

  if (!View) {
    return (
      <span>No view available for this listing item type: {item.type}</span>
    )
  }

  return <View className="listing-item" item={item} searchText={searchText} />
}

export default ListingItemView
