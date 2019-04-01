import React from 'react'
import { storiesOf } from '@storybook/react'
import { DynamicComplexSearch } from '../src/components'
import { useTheme, ThemeProvider, withStyles } from '../src/theme'

const ThemeWrapper = (props) => {
  const { theme, changeTheme } = useTheme()
  return <ThemeProvider theme={theme}>
    {props.children}
    <button
      style={{ display: 'block', marginTop: '30px', backgroundColor: 'unset', border: 'none', padding: '10px', cursor: 'pointer' }}
      onClick={() => changeTheme(theme.name === 'light' ? 'dark' : 'light')}>Toggle Theme</button>
  </ThemeProvider>
}

const styles = theme => ({
  selectBase: {
    borderBottom: `1px solid ${theme.palette.primary.main}`
  },
  inputQuery: {
    'border-bottom': `1px solid ${theme.palette.secondary.main}`
  },
  buttonBase: {
    borderRadius: 40
  }
})

// const StyledDCS = withStyles(styles)(DynamicComplexSearch)
storiesOf('DynamicComplexSearch', module)
  .add('with oip-mainnet mapping', () => {
    return <ThemeWrapper>
      <DynamicComplexSearch
        styles={styles}
        onSubmit={(query) => console.log('my query,', query)}
      />
    </ThemeWrapper>
  })
