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
          onError={err => console.log('Error: ', err)}
        />
      </div>
    </ThemeWrapper>
  })

  .add('RecordProto', () => {
    const descriptor = 'CrYCChhvaXBQcm90b190ZW1wbGF0ZXMucHJvdG8SEm9pcFByb3RvLnRlbXBsYXRlcyL9AQoBUBIMCgRuYW1lGAEgASgJEgsKA2FnZRgCIAEoDRISCgpvY2N1cGF0aW9uGAMgASgJEhUKB2ZyaWVuZHMYBiADKAsyBFR4aWQSGwoNZmFtaWx5TWVtYmVycxgHIAMoCzIEVHhpZBoTCgRUeGlkEgsKA3JhdxgBIAEoDCJACghDcnlzdGFscxINCglVTkRFRklORUQQABISCg5DcnlzdGFsc19BR0FURRABEhEKDUNyeXN0YWxzX1JPU0UQAiI+CgdIb2JiaWVzEg0KCVVOREVGSU5FRBAAEg8KC0hvYmJpZXNfTVRHEAESEwoPSG9iYmllc19BQkxFVE9OEAJiBnByb3RvMw=='
    const templateName = 'tmpl_00000000000RYANC'
    return <ThemeWrapper>
      <div style={{ width: '500px' }}>
        <RecordProto
          descriptor={descriptor}
          templateName={templateName}
        />
      </div>
    </ThemeWrapper>
  })
