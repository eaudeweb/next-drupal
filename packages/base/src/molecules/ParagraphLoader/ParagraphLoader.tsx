import React from 'react'

import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

import './ParagraphLoader.scss'

export const ParagraphLoader = () => (
  <Spin
    fullscreen={true}
    indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
  />
)
