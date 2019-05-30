import React from 'react'
import { storiesOf } from '@storybook/react'
import { DescriptorSetProto, RecordTemplate, RecordProto } from '../src/components'
import { useTheme, ThemeProvider } from '../src/theme'

const ThemeWrapper = (props) => {
  const { theme } = useTheme()
  return <ThemeProvider theme={theme}>
    {props.children}
  </ThemeProvider>
}

storiesOf('Protobuf', module)
  .add('DescriptorSetProto', () => {
    function getDescriptor ( fn ) {
      try {
        let descriptor = fn()
        console.log(descriptor.toString())
      } catch (err) {
        console.error(err)
      }
    }
    return <ThemeWrapper>
      <DescriptorSetProto
        // onBuild={(proto) => console.log(proto.toString('base64'))}
        getDescriptor={getDescriptor}
      />
    </ThemeWrapper>
  })

  .add('RecordTemplate', () => {
    return <ThemeWrapper>
      <div style={{ width: '500px' }}>
        <RecordTemplate
          onSuccess={txid => console.log('Success: ', txid)}
          onError={err => console.error(err)}
          withPublisher={true}
        />
      </div>
    </ThemeWrapper>
  })

  .add('RecordProto', () => {
    const descriptor = 'CnkKCnR4aWQucHJvdG8SCG9pcFByb3RvIhgKBFR4aWQSEAoDcmF3GAEgASgMUgNyYXdCCloIb2lwUHJvdG9KMwoFEgMAAAAKCAoBDBIDAAAACggKAQISAwAAAAoJCgIEABIDAAAACgsKBAQAAgASAwAAAGIGcHJvdG8zCscBCgdwLnByb3RvEhJvaXBQcm90by50ZW1wbGF0ZXMaCnR4aWQucHJvdG8iTQoBUBIQCgRtYXNzGAEoA1IEbWFzcxIQCgRuYW1lGAIoCVIEbmFtZRIkCgVtb29ucxgDIAMoCzIOLm9pcFByb3RvLlR4aWRSBW1vb25zSk0KBRIDAAAACggKAQwSAwAAAAoICgECEgMAAAAKCQoCBAASAwAAAAoLCgQEAAIAEgMAAAAKCwoEBAACARIDAAAACgsKBAQAAgISAwAAAA=='
    const templateName = 'tmpl_D7309B2A2738A99F'
    function onSuccess(res) {
      console.log('successfully sent data to chain: ', res)
    }
    function onError(err) {
      console.log('error', err)
    }
    const template = {
      descriptor,
      templateName
    }
    return <ThemeWrapper>
      <div style={{ width: '500px' }}>
        <RecordProto
          template={template}
          onSuccess={onSuccess}
          onError={onError}
          withPublisher={true}
        />
      </div>
    </ThemeWrapper>
  })
