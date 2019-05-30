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
    function getDescriptor ( descr ) {
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
    const file_descriptor_set = 'CmcKGG9pcFByb3RvX3RlbXBsYXRlcy5wcm90bxISb2lwUHJvdG8udGVtcGxhdGVzIi8KAVASDAoEbmFtZRgBIAEoCRIMCgRzb2lsGAIgASgJEg4KBmNvbG9ycxgDIAMoCWIGcHJvdG8z'
    const name = 'tmpl_5D8DB85B'
    function onSuccess(res) {
      console.log('successfully sent data to chain: ', res)
    }
    function onError(err) {
      console.log('error', err)
    }
    const template = {
      file_descriptor_set,
      name
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
  .add('RecordProto Extends', () => {
    const file_descriptor_set = 'CkAKB3AucHJvdG8iLQoBUBITCgtzdXBlclBvd2VycxgBIAMoCRITCgtsb3ZlQWZmYWlycxgCIAMoCWIGcHJvdG8z'
    const name = 'tmpl_2F29D8C0'
    function onSuccess(res) {
      console.log('successfully sent data to chain: ', res)
    }
    function onError(err) {
      console.log('error', err)
    }
    const template = {
      file_descriptor_set,
      name,
      extends: [1569568859]
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
