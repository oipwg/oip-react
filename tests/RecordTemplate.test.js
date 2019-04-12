import { ECPair } from 'bitcoinjs-lib'
import { Networks, OIP } from 'js-oip'
import { util as protoUtil } from 'protobufjs'
import { verify } from 'bitcoinjs-message'

const { floMainnet, floTestnet } = Networks

const network = {
  flo_mainnet: floMainnet.network,
  flo_testnet: floTestnet.network
}

import templateBuilder, {
  buildRecordTemplate,
  signMessage,
  buildSignedMessage,
  buildOipFiveTemplate
} from '../src/components/Protobuf/RecordTemplate/dependencies/templatebuilder'

const protomodules = require('./Protobuf/resources/compiled/module/compiled')
const RecordTemplateProto = protomodules.oip5.record.RecordTemplateProto
const SignedMessage = protomodules.oipProto.SignedMessage
const OipFiveProto = protomodules.oip5.OipFive

const wif = 'cRVa9rNx5N1YKBw8PhavegJPFCiYCfC4n8cYmdc3X1Y6TyFZGG4B'
const p2pkh = 'ofbB67gqjgaYi45u8Qk2U3hGoCmyZcgbN4'
const ecpair = ECPair.fromWIF(wif, network.flo_testnet)

// const p2pkh = payments.p2pkh({pubkey: ecpair.publicKey, network: network.flo_testnet}).address
// console.log(ECPair.makeRandom({network: network.flo_testnet}).toWIF())

describe('RecordTemplate', () => {
  it('build record template', () => {
    const friendlyName = 'Test Template'
    const description = 'description for test template'
    const fileDescriptor = Buffer.from([10, 79, 10, 27, 111, 105, 112, 53, 95, 114, 101, 99, 111, 114, 100, 95, 116, 101, 109, 112, 108, 97, 116, 101, 115, 46, 112, 114, 111, 116, 111, 18, 21, 111, 105, 112, 53, 46, 114, 101, 99, 111, 114, 100, 46, 116, 101, 109, 112, 108, 97, 116, 101, 115, 34, 17, 10, 1, 80, 18, 12, 10, 4, 116, 101, 115, 116, 24, 1, 32, 1, 40, 9, 98, 6, 112, 114, 111, 116, 111, 51])
    
    let { templateBuffer, template64, templateMessage } = buildRecordTemplate({
      friendlyName,
      description,
      DescriptorSetProto: fileDescriptor
    })
    
    let targetBuffer = new Uint8Array(129)
    expect(protoUtil.base64.decode(template64, targetBuffer, 0)).toEqual(templateBuffer.length)
    expect(targetBuffer.buffer).toEqual(templateBuffer.buffer)
    expect(protoUtil.base64.encode(targetBuffer, 0, targetBuffer.length)).toEqual(template64)
    
    let decodedMessageFromBuffer = RecordTemplateProto.decode(templateBuffer)
    expect(decodedMessageFromBuffer).toEqual(templateMessage)
    expect(decodedMessageFromBuffer.friendlyName).toEqual(friendlyName)
    expect(decodedMessageFromBuffer.description).toEqual(description)
    expect(decodedMessageFromBuffer.DescriptorSetProto).toEqual(fileDescriptor)
  })
  it('build OipFive proto message with record template', () => {
    const friendlyName = 'Test Template'
    const description = 'description for test template'
    const fileDescriptor = Buffer.from([10, 79, 10, 27, 111, 105, 112, 53, 95, 114, 101, 99, 111, 114, 100, 95, 116, 101, 109, 112, 108, 97, 116, 101, 115, 46, 112, 114, 111, 116, 111, 18, 21, 111, 105, 112, 53, 46, 114, 101, 99, 111, 114, 100, 46, 116, 101, 109, 112, 108, 97, 116, 101, 115, 34, 17, 10, 1, 80, 18, 12, 10, 4, 116, 101, 115, 116, 24, 1, 32, 1, 40, 9, 98, 6, 112, 114, 111, 116, 111, 51])
    
    let { templateMessage } = buildRecordTemplate({
      friendlyName,
      description,
      DescriptorSetProto: fileDescriptor
    })
    
    const { oip5messageBuffer, oip5message64, oip5message } = buildOipFiveTemplate(templateMessage)
    
    let targetBuffer = new Uint8Array(132)
    expect(protoUtil.base64.decode(oip5message64, targetBuffer, 0)).toEqual(oip5messageBuffer.length)
    expect(targetBuffer.buffer).toEqual(oip5messageBuffer.buffer)
    expect(protoUtil.base64.encode(targetBuffer, 0, targetBuffer.length)).toEqual(oip5message64)
    
    let decodedMessageFromBuffer = OipFiveProto.decode(oip5messageBuffer)
    expect(decodedMessageFromBuffer).toEqual(oip5message)
  })
  it('sign record template message', () => {
    const friendlyName = 'Test Template'
    const description = 'description for test template'
    const fileDescriptor = Buffer.from([10, 79, 10, 27, 111, 105, 112, 53, 95, 114, 101, 99, 111, 114, 100, 95, 116, 101, 109, 112, 108, 97, 116, 101, 115, 46, 112, 114, 111, 116, 111, 18, 21, 111, 105, 112, 53, 46, 114, 101, 99, 111, 114, 100, 46, 116, 101, 109, 112, 108, 97, 116, 101, 115, 34, 17, 10, 1, 80, 18, 12, 10, 4, 116, 101, 115, 116, 24, 1, 32, 1, 40, 9, 98, 6, 112, 114, 111, 116, 111, 51])
    
    let { templateMessage } = buildRecordTemplate({
      friendlyName,
      description,
      DescriptorSetProto: fileDescriptor
    })
    
    const { oip5message64 } = buildOipFiveTemplate(templateMessage)
    
    const { signature, p2pkh: pubKeyHash } = signMessage({ message: oip5message64, ECPair: ecpair })
    expect(pubKeyHash).toEqual(p2pkh)
    
    expect(verify(oip5message64, p2pkh, signature, ecpair.network.messagePrefix)).toBeTruthy()
  })
  it('build proto signed message', () => {
    const friendlyName = 'Test Template'
    const description = 'description for test template'
    const fileDescriptor = Buffer.from([10, 79, 10, 27, 111, 105, 112, 53, 95, 114, 101, 99, 111, 114, 100, 95, 116, 101, 109, 112, 108, 97, 116, 101, 115, 46, 112, 114, 111, 116, 111, 18, 21, 111, 105, 112, 53, 46, 114, 101, 99, 111, 114, 100, 46, 116, 101, 109, 112, 108, 97, 116, 101, 115, 34, 17, 10, 1, 80, 18, 12, 10, 4, 116, 101, 115, 116, 24, 1, 32, 1, 40, 9, 98, 6, 112, 114, 111, 116, 111, 51])
    
    let { templateMessage, template64 } = buildRecordTemplate({
      friendlyName,
      description,
      DescriptorSetProto: fileDescriptor
    })
    expect(template64).toEqual('Cg1UZXN0IFRlbXBsYXRlEh1kZXNjcmlwdGlvbiBmb3IgdGVzdCB0ZW1wbGF0ZSJRCk8KG29pcDVfcmVjb3JkX3RlbXBsYXRlcy5wcm90bxIVb2lwNS5yZWNvcmQudGVtcGxhdGVzIhEKAVASDAoEdGVzdBgBIAEoCWIGcHJvdG8z')
    
    const { oip5message64, oip5messageBuffer } = buildOipFiveTemplate(templateMessage)
    
    const { signature, publicKeyAscii } = signMessage({ message: oip5message64, ECPair: ecpair })
    expect(signature.toString('base64')).toEqual('HwNyg/TsW2nDhkYfZlicrXrD29J2kgNpyKZMGP6b8GDaA9uTpSYyWK80ULVoxyDHhMSN9ogQj3jTnTQV0r9NYnw=')
    
    const {
      signedMessage64,
      signedMessageBuffer
    } = buildSignedMessage({ Signature: signature, PubKey: publicKeyAscii, SerializedMessage: oip5messageBuffer })
    expect(signedMessage64).toEqual('CoQBCoEBCg1UZXN0IFRlbXBsYXRlEh1kZXNjcmlwdGlvbiBmb3IgdGVzdCB0ZW1wbGF0ZSJRCk8KG29pcDVfcmVjb3JkX3RlbXBsYXRlcy5wcm90bxIVb2lwNS5yZWNvcmQudGVtcGxhdGVzIhEKAVASDAoEdGVzdBgBIAEoCWIGcHJvdG8zEAEYASIib2ZiQjY3Z3FqZ2FZaTQ1dThRazJVM2hHb0NteVpjZ2JONCpBHwNyg/TsW2nDhkYfZlicrXrD29J2kgNpyKZMGP6b8GDaA9uTpSYyWK80ULVoxyDHhMSN9ogQj3jTnTQV0r9NYnw=')
    
    const byteSize = 242
    let rawSignedMessage = new Uint8Array(byteSize)
    let numOfBytesWritten = protoUtil.base64.decode(signedMessage64, rawSignedMessage, 0)
    expect(numOfBytesWritten).toEqual(byteSize)

    const decodedMessage = SignedMessage.decode(rawSignedMessage)
    expect(SignedMessage.encode(decodedMessage).finish()).toEqual(signedMessageBuffer)
    
    expect(decodedMessage.Signature.buffer).toEqual(signature.buffer)
    expect(decodedMessage.SerializedMessage.buffer).toEqual(oip5messageBuffer.buffer)
    expect(decodedMessage.MessageType).toEqual(1)
    expect(decodedMessage.SignatureType).toEqual(1)
    expect(decodedMessage.PubKey).toEqual(publicKeyAscii)
  })
  it('templateBuilder function', () => {
    const friendlyName = 'Test Template'
    const description = 'description for test template'
    const fileDescriptor = Buffer.from([10, 79, 10, 27, 111, 105, 112, 53, 95, 114, 101, 99, 111, 114, 100, 95, 116, 101, 109, 112, 108, 97, 116, 101, 115, 46, 112, 114, 111, 116, 111, 18, 21, 111, 105, 112, 53, 46, 114, 101, 99, 111, 114, 100, 46, 116, 101, 109, 112, 108, 97, 116, 101, 115, 34, 17, 10, 1, 80, 18, 12, 10, 4, 116, 101, 115, 116, 24, 1, 32, 1, 40, 9, 98, 6, 112, 114, 111, 116, 111, 51])
    
    let { signedMessage64 } = templateBuilder({
      friendlyName,
      description,
      DescriptorSetProto: fileDescriptor,
      wif,
      network: 'testnet'
    })
    
    expect(signedMessage64).toEqual('CoQBCoEBCg1UZXN0IFRlbXBsYXRlEh1kZXNjcmlwdGlvbiBmb3IgdGVzdCB0ZW1wbGF0ZSJRCk8KG29pcDVfcmVjb3JkX3RlbXBsYXRlcy5wcm90bxIVb2lwNS5yZWNvcmQudGVtcGxhdGVzIhEKAVASDAoEdGVzdBgBIAEoCWIGcHJvdG8zEAEYASIib2ZiQjY3Z3FqZ2FZaTQ1dThRazJVM2hHb0NteVpjZ2JONCpBHwNyg/TsW2nDhkYfZlicrXrD29J2kgNpyKZMGP6b8GDaA9uTpSYyWK80ULVoxyDHhMSN9ogQj3jTnTQV0r9NYnw=')
  })
  it.skip('publish record test template', async () => {
    let signedMessage = 'CmMKBHJ5YW4SCHdoYXRldmVyIlEKTwobb2lwNV9yZWNvcmRfdGVtcGxhdGVzLnByb3RvEhVvaXA1LnJlY29yZC50ZW1wbGF0ZXMiEQoBUBIMCgR0ZXN0GAEgASgJYgZwcm90bzMQARgBIiEDCXMzHJNc8d0agySl5YBD3oVQC0NdQkwX9hS2XBLzT+EqQR8ZOJw6TrRqFuBeQO0COWkmgWcYjVcrZCC52es5TELrHArnb8ekhZfcChqh2QbezAof14vjRuILZDtIflDLZ7V6'
    // console.log(`p64:${signedMessage}`)
    const oip = new OIP(wif, 'testnet', { explorerUrl: 'https://testnet.explorer.mediciland.com/api' })
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
