import React from 'react'
import { storiesOf } from '@storybook/react'

import { DynamicComplexSearch } from '../components'

storiesOf('DynamicComplexSearch', module)
  .add('with oip-mainnet mapping', () => {
    return <DynamicComplexSearch />
  })
