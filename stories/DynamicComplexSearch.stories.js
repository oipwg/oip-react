import React from 'react'
import { storiesOf } from '@storybook/react'
import { DynamicComplexSearch } from '../src/components'

const styles = {
  selectBase: {
    borderBottom: '1px solid blue',
    '&:hover': {
      backgroundColor: 'red'
    }
  },
  inputQuery: {
    'border-bottom': '1px solid orange'
  },
  buttonBase: {
    borderRadius: 40
  }
}
storiesOf('DynamicComplexSearch', module)
  .add('with oip-mainnet mapping', () => {
    return <DynamicComplexSearch
      styles={styles}
      onSubmit={(query) => console.log('my query,', query)}
      overrideStyles
    />
  })
