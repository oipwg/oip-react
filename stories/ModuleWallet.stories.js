import React from 'react'
import { storiesOf } from '@storybook/react'
import { ModuleWallet } from '../src/components'
import { useTheme, ThemeProvider } from '../src/theme'

const ThemeWrapper = (props) => {
  const { theme, changeTheme } = useTheme()
  return <ThemeProvider theme={theme}>
    {props.children}
    <button
      style={{ display: 'block', marginTop: '30px', backgroundColor: 'unset', border: 'none', padding: '10px', cursor: 'pointer' }}
      onClick={() => changeTheme(theme.name === 'light' ? 'dark' : 'light')}>Toggle Theme</button>
  </ThemeProvider>
}

// const StyledDCS = withStyles(styles)(DynamicComplexSearch)
storiesOf('ModuleWallet', module)
  .add('default', () => {
    return <ThemeWrapper>
      <ModuleWallet
        coins={['flo', 'floTestnet']}
        height={'400px'}
        weidth={'900px'}
        borderRadius={'20px'}
        // boxShadow={'2px 1px 2px'}
        border={`1px solid grey`}
      />
    </ThemeWrapper>
  })
