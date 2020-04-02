import React from 'react'
import { storiesOf } from '@storybook/react'
import { useTheme, ThemeProvider } from '../src/theme'
import { Publisher } from '../src/components/Publisher'
import WalletButton from '../src/components/Publisher/WalletButton'

const ThemeWrapper = (props) => {
  const { theme } = useTheme()
  return <ThemeProvider theme={theme}>
    {props.children}
  </ThemeProvider>
}

storiesOf('Publisher', module)
  .add('with wif input', () => {
    function onSuccess (res) {
      console.log('successfully sent data to chain: ', res)
    }

    function onError (err) {
      console.log('error', err)
    }

    return <ThemeWrapper>
      <Publisher
        onSuccess={onSuccess}
        onError={onError}
        message={'testnettestthis'}
      />
    </ThemeWrapper>
  })

  .add('wallet button with input', () => {
    class WrapWalletButtonInput extends React.Component {
      constructor (props) {
        super(props)

        this.state = { message: '' }
      }

      onChange = (e) => {
        this.setState({ message: e.target.value })
      }

      onSuccess = (res) => {
        console.log('successfully sent data to chain: ', res)
      }

      onError = (err) => {
        console.log('error', err)
      }

      render () {
        return <>
          <input
            type={'text'}
            onChange={this.onChange}
            value={this.state.message}
            placeholder={'enter message data here'}
            style={{
              display: 'block',
              marginBottom: '10px',
              height: '30px',
              width: '290px',
              borderRadius: '3px',
              border: '1px solid lightgrey',
              padding: '4px'
            }} />
          <WalletButton
            onSuccess={this.onSuccess}
            onError={this.onError}
            network={'testnet'}
            wif={'cVeJgyPeQS2935MGpLWiPj28sowu2QxRx4vbdM5UinMwk151Epkq'}
            text={'Use this button to send data to the FLO chain!'}
            message={this.state.message}
          />
        </>
      }
    }

    return <ThemeWrapper>
      <WrapWalletButtonInput />
    </ThemeWrapper>
  })
