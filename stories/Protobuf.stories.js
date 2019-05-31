import React from 'react'
import { storiesOf } from '@storybook/react'
import { DescriptorSetProto, RecordTemplate, RecordProto } from '../src/components'
import { useTheme, ThemeProvider } from '../src/theme'
import RecordProtoContainer from '../src/components/Protobuf/RecordProtoContainer'

const ThemeWrapper = (props) => {
  const { theme } = useTheme()
  return <ThemeProvider theme={theme}>
    {props.children}
  </ThemeProvider>
}

storiesOf('Protobuf', module)
  .add('DescriptorSetProto', () => {
    function getDescriptor (descr) {
      if (descr) {
        console.log(descr.toString())
      }
    }

    return <ThemeWrapper>
      <DescriptorSetProto
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
          // _extends={1569568859}
        />
      </div>
    </ThemeWrapper>
  })
  .add('RecordProto', () => {
    const file_descriptor_set = 'CmYKB3AucHJvdG8SEm9pcFByb3RvLnRlbXBsYXRlcyI/CgFQEgwKBG5hbWUYASABKAkSFQoNZmF2b3JpdGVTcG9ydBgCIAEoCRIVCg1mYXZvcml0ZUZydWl0GAMgASgJYgZwcm90bzM='
    const name = 'tmpl_348E9396'

    function onSuccess (res) {
      console.log('successfully sent data to chain: ', res)
    }

    function onError (err) {
      console.log('error', err)
    }

    const template = {
      file_descriptor_set,
      name
    }

    return <ThemeWrapper>
      <div style={{ width: '500px', display: 'block' }}>
        <RecordProto
          template={template}
          onSuccess={onSuccess}
          onError={onError}
          withPublisher={true}
        />
      </div>
    </ThemeWrapper>
  })
  .add('RecordProtoContainer', () => {
    function onSuccess (res) {
      console.log('successfully sent data to chain: ', res)
    }

    function onError (err) {
      console.log('error', err)
    }

    const templates = [
      {
        file_descriptor_set: 'CmcKGG9pcFByb3RvX3RlbXBsYXRlcy5wcm90bxISb2lwUHJvdG8udGVtcGxhdGVzIi8KAVASDAoEbmFtZRgBIAEoCRIMCgRzb2lsGAIgASgJEg4KBmNvbG9ycxgDIAMoCWIGcHJvdG8z',
        name: 'tmpl_5D8DB85B'
      },
      {
        file_descriptor_set: 'CmYKB3AucHJvdG8SEm9pcFByb3RvLnRlbXBsYXRlcyI/CgFQEgwKBG5hbWUYASABKAkSFQoNZmF2b3JpdGVTcG9ydBgCIAEoCRIVCg1mYXZvcml0ZUZydWl0GAMgASgJYgZwcm90bzM=',
        name: 'tmpl_348E9396'
      },
      {
        file_descriptor_set: 'CnkKCnR4aWQucHJvdG8SCG9pcFByb3RvIhgKBFR4aWQSEAoDcmF3GAEgASgMUgNyYXdCCloIb2lwUHJvdG9KMwoFEgMAAAAKCAoBDBIDAAAACggKAQISAwAAAAoJCgIEABIDAAAACgsKBAQAAgASAwAAAGIGcHJvdG8zCscBCgdwLnByb3RvEhJvaXBQcm90by50ZW1wbGF0ZXMaCnR4aWQucHJvdG8iTQoBUBIQCgRtYXNzGAEoA1IEbWFzcxIQCgRuYW1lGAIoCVIEbmFtZRIkCgVtb29ucxgDIAMoCzIOLm9pcFByb3RvLlR4aWRSBW1vb25zSk0KBRIDAAAACggKAQwSAwAAAAoICgECEgMAAAAKCQoCBAASAwAAAAoLCgQEAAIAEgMAAAAKCwoEBAACARIDAAAACgsKBAQAAgISAwAAAA==',
        name: 'tmpl_D7309B2A'
      }
    ]
    return <ThemeWrapper>
      <div style={{ width: '500px' }}>
        <RecordProtoContainer
          onSuccess={onSuccess}
          onError={onError}
          templates={templates}
        />
      </div>
    </ThemeWrapper>
  })
