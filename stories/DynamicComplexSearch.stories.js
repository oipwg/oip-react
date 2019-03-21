import React from 'react'
import { storiesOf } from '@storybook/react'
import { DynamicComplexSearch } from '../src/components'

storiesOf('DynamicComplexSearch', module)
  .add('with oip-mainnet mapping', () => {
    return <DynamicComplexSearch
      onSubmit={(query) => console.log('my query,', query)}
    />
  })
