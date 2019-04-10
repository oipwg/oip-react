import {ECPair, payments} from 'bitcoinjs-lib'
import {Networks, OIP} from 'js-oip'

const {floMainnet, floTestnet} = Networks

const network = {
  flo_mainnet: floMainnet.network,
  flo_testnet: floTestnet.network
}

import {
  buildRecordTemplate,
  signMessage,
  buildSignedMessage
} from '../src/components/Protobuf/RecordTemplate/dependencies/templatebuilder'

const wif = 'cRVa9rNx5N1YKBw8PhavegJPFCiYCfC4n8cYmdc3X1Y6TyFZGG4B'
const p2pkh = 'ofbB67gqjgaYi45u8Qk2U3hGoCmyZcgbN4'
const ecpair = ECPair.fromWIF(wif, network.flo_testnet)

// const p2pkh = payments.p2pkh({pubkey: ecpair.publicKey, network: network.flo_testnet}).address
// console.log(ECPair.makeRandom({network: network.flo_testnet}).toWIF())

describe('RecordTemplate', () => {
  it('build and sign a generated Record Template', () => {
    let fileDescriptor = Buffer.from([10, 79, 10, 27, 111, 105, 112, 53, 95, 114, 101, 99, 111, 114, 100, 95, 116, 101, 109, 112, 108, 97, 116, 101, 115, 46, 112, 114, 111, 116, 111, 18, 21, 111, 105, 112, 53, 46, 114, 101, 99, 111, 114, 100, 46, 116, 101, 109, 112, 108, 97, 116, 101, 115, 34, 17, 10, 1, 80, 18, 12, 10, 4, 116, 101, 115, 116, 24, 1, 32, 1, 40, 9, 98, 6, 112, 114, 111, 116, 111, 51])
    
    // 1 build template message
    let { buffer, b64 } = buildRecordTemplate({
      friendlyName: 'ryan',
      DescriptorSetProto: fileDescriptor,
      description: 'whatever'
    })
    
    // 2 sign b64 message
    const {PubKey, Signature} = signMessage({ECPair: ecpair, message: b64})
    // console.log(PubKey, Signature)
    
    // 3 build SignedMessageProto
    const SignedMessage64 = buildSignedMessage({ SerializedMessage: buffer, PubKey, Signature })
    expect(SignedMessage64).toBeDefined()
    expect(SignedMessage64).toEqual('CmMKBHJ5YW4SCHdoYXRldmVyIlEKTwobb2lwNV9yZWNvcmRfdGVtcGxhdGVzLnByb3RvEhVvaXA1LnJlY29yZC50ZW1wbGF0ZXMiEQoBUBIMCgR0ZXN0GAEgASgJYgZwcm90bzMQARgBIiEDCXMzHJNc8d0agySl5YBD3oVQC0NdQkwX9hS2XBLzT+EqQR8ZOJw6TrRqFuBeQO0COWkmgWcYjVcrZCC52es5TELrHArnb8ekhZfcChqh2QbezAof14vjRuILZDtIflDLZ7V6')
  })
  it.skip('publish record test template', async () => {
    let signedMessage = 'CmMKBHJ5YW4SCHdoYXRldmVyIlEKTwobb2lwNV9yZWNvcmRfdGVtcGxhdGVzLnByb3RvEhVvaXA1LnJlY29yZC50ZW1wbGF0ZXMiEQoBUBIMCgR0ZXN0GAEgASgJYgZwcm90bzMQARgBIiEDCXMzHJNc8d0agySl5YBD3oVQC0NdQkwX9hS2XBLzT+EqQR8ZOJw6TrRqFuBeQO0COWkmgWcYjVcrZCC52es5TELrHArnb8ekhZfcChqh2QbezAof14vjRuILZDtIflDLZ7V6'
    // console.log(`p64:${signedMessage}`)
    const oip = new OIP(wif, 'testnet', {explorerUrl: 'https://testnet.explorer.mediciland.com/api'})
    const wallet = oip.wallet

    let res
    try {
      res = await wallet.sendDataToChain(`p64:${signedMessage}`)
    } catch (err) {
      console.error('Error sending message to blockchain', err)
    }
    expect(res).toBeDefined()
  })
})
