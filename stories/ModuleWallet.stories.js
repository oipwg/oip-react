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
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        height: '300px',
        width: '600px',
        // borderTopLeftRadius: '10px',
        // borderTopRightRadius: '10px'
        borderRadius: '10px'
      }}>
        <ModuleWallet
          coins={['flo', 'flo_testnet']}
        />
      </div>
    </ThemeWrapper>
  })
