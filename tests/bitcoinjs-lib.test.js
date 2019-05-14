import { ECPair, payments } from 'bitcoinjs-lib'
import { Networks } from 'js-oip'

const { floMainnet, floTestnet } = Networks

const network = {
    flo_mainnet: floMainnet.network,
    flo_testnet: floTestnet.network
}

const wif = 'cRVa9rNx5N1YKBw8PhavegJPFCiYCfC4n8cYmdc3X1Y6TyFZGG4B'
const p2pkh = 'ofbB67gqjgaYi45u8Qk2U3hGoCmyZcgbN4'
const ecpair = ECPair.fromWIF(wif, network.flo_testnet)

// cVeJgyPeQS2935MGpLWiPj28sowu2QxRx4vbdM5UinMwk151Epkq
// oRpmeYvjgfhkSpPWGL8eP5ePupyop3hz9j

it.skip('make random ECPair', () => {
    const randomWIF = ECPair.makeRandom({ network: network.flo_testnet }).toWIF()
    const EC = ECPair.fromWIF(randomWIF, network.flo_testnet)
    const p2pkh = payments.p2pkh({ pubkey: EC.publicKey, network: network.flo_testnet }).address
    // console.log(randomWIF, p2pkh
})