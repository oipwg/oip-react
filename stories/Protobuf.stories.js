import React from 'react'
import { storiesOf } from '@storybook/react'
import { DescriptorSetProto, RecordTemplate } from '../src/components'
import { useTheme, ThemeProvider } from '../src/theme'

const ThemeWrapper = (props) => {
  const { theme } = useTheme()
  return <ThemeProvider theme={theme}>
    {props.children}
  </ThemeProvider>
}

storiesOf('Protobuf', module)
  .add('DescriptorSetProto', () => {
    return <ThemeWrapper>
      <DescriptorSetProto
        // onBuild={(proto) => console.log(proto.toString('base64'))}
        getDescriptor={desc => {console.log(desc.toString())}}
      />
    </ThemeWrapper>
  })

  .add('RecordTemplate', () => {
    return <ThemeWrapper>
      <RecordTemplate

      />
    </ThemeWrapper>
  })
