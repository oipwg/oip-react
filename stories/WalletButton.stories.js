import React from 'react'
import { storiesOf } from '@storybook/react'
import { useTheme, ThemeProvider } from '../src/theme'
import WalletButton from "../src/components/WalletButton";

const ThemeWrapper = (props) => {
    const { theme } = useTheme()
    return <ThemeProvider theme={theme}>
        {props.children}
    </ThemeProvider>
}

storiesOf('WalletButton', module)
    .add('default', () => {
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
                message={'test this testnet'}
            />
        </ThemeWrapper>
    })
