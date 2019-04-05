import React from 'react'
import { storiesOf } from '@storybook/react'
import { ProtoGen } from '../src/components'
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

storiesOf('ProtoGenerator', module)
.add('default', () => {
  return <ThemeWrapper>
    <ProtoGen
      onBuild={(proto) => console.log(proto)}
    />
  </ThemeWrapper>
})
