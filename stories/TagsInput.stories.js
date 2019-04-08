import React from 'react'
import { storiesOf } from '@storybook/react'
import { TagsInput } from '../src/components'
import { useTheme, ThemeProvider } from '../src/theme'

const ThemeWrapper = (props) => {
  const { theme } = useTheme()
  return <ThemeProvider theme={theme}>
    {props.children}
  </ThemeProvider>
}

storiesOf('TagsInput', module)
.add('default', () => {
  return <ThemeWrapper>
    <TagsInput/>
  </ThemeWrapper>
})
