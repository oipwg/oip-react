import { ECPair, payments } from 'bitcoinjs-lib'
import { Networks } from 'js-oip'

const { floMainnet, floTestnet } = Networks

const network = {
    flo_mainnet: floMainnet.network,
    flo_testnet: floTestnet.network
}

const wif = 'cVeJgyPeQS2935MGpLWiPj28sowu2QxRx4vbdM5UinMwk151Epkq'
const p2pkh = 'oRpmeYvjgfhkSpPWGL8eP5ePupyop3hz9j'
const ecpair = ECPair.fromWIF(wif, network.flo_testnet)

it.skip('make random ECPair', () => {
    const randomWIF = ECPair.makeRandom({ network: network.flo_testnet }).toWIF()
    const EC = ECPair.fromWIF(randomWIF, network.flo_testnet)
    const p2pkh = payments.p2pkh({ pubkey: EC.publicKey, network: network.flo_testnet }).address
    // console.log(randomWIF, p2pkh)
})