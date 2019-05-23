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
let message = 'p64:Ck8STTpLCkkKKXR5cGUuZ29vZ2xlYXBpcy5jb20vdG1wbF84RDY2QzZBRkY5QkREOEVFEhwKBmZsaWdodAoMbXVzaWMgbWFraW5nCgRsb3ZlEAEYASIib1JwbWVZdmpnZmhrU3BQV0dMOGVQNWVQdXB5b3AzaHo5aipBIJkzmdugXRUvNpwPQzIAf0CW2t95SdM4HYT5oMU5G6mmLbAWSVhECBGViFTXOye4j11AgFpc/RiuLrpSQj03fzc='

const defaultMessage = 'test this testnet'
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
                message={message ? message : defaultMessage}
            />
        </ThemeWrapper>
    })
