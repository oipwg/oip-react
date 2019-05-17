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
let message = 'p64:CpMBCpABCg5BcnRpc3QgUHJvZmlsZRIkcmVjb3JkIHRlbXBsYXRlIGZvciBwZXJzb25hbCBhcnRpc3RzIlgKVgoYb2lwUHJvdG9fdGVtcGxhdGVzLnByb3RvEhJvaXBQcm90by50ZW1wbGF0ZXMiHgoBUBIMCgRuYW1lGAEgASgJEgsKA2FydBgCIAEoCWIGcHJvdG8zEAEYASIiRlRkUUpKQ3RFUDdaSnlwWG4yUkd5ZGViemNGTFZnREtYUipBH/v2lc3DgF3LrBSk78nOPRalSqN9TM8KvtxC1RfwcD6HDPTwpjKcMA6EKbWIkw3IYAVn15NVWzi8PpjxhRYJLNw='

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
