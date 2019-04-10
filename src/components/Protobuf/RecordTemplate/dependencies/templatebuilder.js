import { util } from 'protobufjs'
import { sign } from 'bitcoinjs-message'
import { ECPair } from 'bitcoinjs-lib'
import networks from '../../../../networks'
import {isValidWIF} from '../../../../util'

const protomodules = require('./protofiles/compiled/module/compiled')
export const RecordTemplateProto = protomodules.oip5.record.RecordTemplateProto
export const SignedMessage = protomodules.oipProto.SignedMessage

export function buildRecordTemplate ({ friendlyName, description, DescriptorSetProto }) {
  const templatePayload = {
    friendlyName,
    description,
    DescriptorSetProto
  }
  
  let err = RecordTemplateProto.verify(templatePayload)
  if (err) {
    throw new Error(err)
  }
  
  const message = RecordTemplateProto.create(templatePayload)
  const buffer = RecordTemplateProto.encode(message).finish()
  const b64 = util.base64.encode(buffer, 0, buffer.length)
  return { buffer, b64 }
}

export function signMessage ({ message, ECPair }) {
  let privateKeyBuffer = ECPair.privateKey
  let compressed = ECPair.compressed || true
  
  let Signature
  try {
    Signature = sign(message, privateKeyBuffer, compressed, ECPair.network.messagePrefix)
  } catch (e) {
    throw new Error(e)
  }
  
  return { Signature, PubKey: ECPair.publicKey }
}

export function buildSignedMessage ({
  SerializedMessage,
  MessageType = 1,
  SignatureType = 1,
  PubKey,
  Signature
}) {
  let signedMessagePayload = {
    SerializedMessage,
    MessageType,
    SignatureType,
    PubKey,
    Signature,
  }
  
  let err = SignedMessage.verify(signedMessagePayload)
  if (err) {
    throw new Error(`Error verifying message payload as valid proto -- ${err}`)
  }
  
  const message = SignedMessage.create(signedMessagePayload)
  const buffer = SignedMessage.encode(message).finish()
  // returns base64 encoded message ready for chain
  return util.base64.encode(buffer, 0, buffer.length)
}

export function templatebuilder ({ friendlyName, description, DescriptorSetProto, wif, network = 'mainnet' }) {
  if (!friendlyName || friendlyName === '') {
    throw new Error(`template name must be defined; was passed: ${friendlyName}`)
  }
  if (!description || description === '') {
    throw new Error(`description must be defined; was passed: ${description}`)
  }
  if (!DescriptorSetProto) {
    throw new Error(`DescriptorSetProto must be a defined Uint8Array; was passed: ${DescriptorSetProto}`)
  }
  if (!wif || wif === '') {
    throw new Error(`must pass in a defined WIF (Wallet Input Format); aka your private key; was passed: ${wif}`)
  }
  if (!isValidWIF(wif, network)) {
    throw new Error(`Invalid WIF: ${wif}. network: ${network}`)
  }
  
  network = network === 'mainnet' ? networks.floMainnet : networks.floTestnet
  const keypair = ECPair.fromWIF(wif, network)
  
  // 1 build and encode record template
  let { buffer, b64 } = buildRecordTemplate({ friendlyName, description, DescriptorSetProto })
  // 2 sign b64 message
  const { PubKey, Signature } = signMessage({ ECPair: keypair, message: b64 })
  // 3 build SignedMessageProto
  return buildSignedMessage({ SerializedMessage: buffer, PubKey, Signature })
}

export default templatebuilder
