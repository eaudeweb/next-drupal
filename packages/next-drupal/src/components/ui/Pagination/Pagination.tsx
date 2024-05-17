import { Pagination as AntdPagination, PaginationProps } from 'antd'

import BackArrow from './back-arrow.svg'
import NextArrow from './next-arrow.svg'

const itemRender: PaginationProps['itemRender'] = (
  _,
  type,
  originalElement,
) => {
  if (type === 'prev') {
    return <BackArrow />
  }
  if (type === 'next') {
    return <NextArrow />
  }
  return originalElement
}

export default function Pagination(props: PaginationProps) {
  return <AntdPagination {...props} itemRender={itemRender} />
}
