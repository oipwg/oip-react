import React from 'react'
import { storiesOf } from '@storybook/react'

import DCS from '../components/DynamicComplexSearch/DynamicComplexSearch'

storiesOf('DynamicComplexSearch', module)
  .add('with oip-mainnet mapping', () => {
    return <DCS />
  })
