import React from 'react'
import { storiesOf } from '@storybook/react'
import { useTheme, ThemeProvider } from '../src/theme'
import {Publisher} from "../src/components/Publisher";
import WalletButton from '../src/components/Publisher/WalletButton'

const ThemeWrapper = (props) => {
  const { theme } = useTheme()
  return <ThemeProvider theme={theme}>
    {props.children}
  </ThemeProvider>
}
const message = 'p64:ClMSUTpPCk0KPHR5cGUuZ29vZ2xlYXBpcy5jb20vb2lwUHJvdG8udGVtcGxhdGVzLnRtcGxfMzcwODQwRUVDQjNDMjdDQRINCCESCVJ5YW4gTW9vbhABGAEiIm9mYkI2N2dxamdhWWk0NXU4UWsyVTNoR29DbXlaY2diTjQqQR+BAHDXt0vjBky9WcA4gwreKSXRDPrehWjYYxaG2G3O3hqGwsbyFwIf41H+xFP97peBbGnj0W40PhOxKSDHoR4+'
const defaultMessage = 'test this testnet'

storiesOf('Publisher', module)
  .add('default', () => {
    function onSuccess(res) {
      console.log('successfully sent data to chain: ', res)
    }
    function onError(err) {
      console.log('error', err)
    }
    return <ThemeWrapper>
      <Publisher
        onSuccess={onSuccess}
        onError={onError}
      />
    </ThemeWrapper>
  })
  .add('wallet button', () => {
    function onSuccess(res) {
      console.log('successfully sent data to chain: ', res)
    }
    function onError(err) {
      console.log('error', err)
    }
    return <ThemeWrapper>
      <WalletButton
        onSuccess={onSuccess}
        onError={onError}
        network={'testnet'}
        wif={'cVeJgyPeQS2935MGpLWiPj28sowu2QxRx4vbdM5UinMwk151Epkq'}
        text={'Use this button to send data to the FLO chain!'}
        message={message ? message : defaultMessage}
      />
    </ThemeWrapper>
  })
