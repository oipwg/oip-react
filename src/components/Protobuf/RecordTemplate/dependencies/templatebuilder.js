import { util } from 'protobufjs'
import { sign } from 'bitcoinjs-message'
import { ECPair, payments } from 'bitcoinjs-lib'
import networks from '../../../../networks'
import { isValidWIF } from '../../../../util'

const protomodules = require('./protofiles/compiled/module/compiled')
export const RecordTemplateProto = protomodules.oip5.record.RecordTemplateProto
export const SignedMessage = protomodules.oipProto.SignedMessage
const OipFiveProto = protomodules.oip5.OipFive

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
  
  const templateMessage = RecordTemplateProto.create(templatePayload)
  const templateBuffer = RecordTemplateProto.encode(templateMessage).finish()
  const template64 = util.base64.encode(templateBuffer, 0, templateBuffer.length)
  return { templateBuffer, template64, templateMessage }
}

export function signMessage ({ message, ECPair }) {
  let privateKeyBuffer = ECPair.privateKey
  let compressed = ECPair.compressed || true
  
  let signature
  try {
    signature = sign(message, privateKeyBuffer, compressed, ECPair.network.messagePrefix)
  } catch (e) {
    throw new Error(e)
  }
  
  const p2pkh = payments.p2pkh({ pubkey: ECPair.publicKey, network: ECPair.network }).address
  const publicKey = ECPair.publicKey
  let publicKeyAscii = new Uint8Array(p2pkh.length)
  for (let i in p2pkh) {
    publicKeyAscii[i] = (p2pkh.charCodeAt(i))
  }
  
  return {
    signature,
    p2pkh,
    publicKey,
    publicKeyAscii
  }
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
  const signedMessage = SignedMessage.create(signedMessagePayload)
  const signedMessageBuffer = SignedMessage.encode(signedMessage).finish()
  // returns base64 encoded message ready for chain
  const signedMessage64 = util.base64.encode(signedMessageBuffer, 0, signedMessageBuffer.length)
  
  return {
    signedMessage,
    signedMessageBuffer,
    signedMessage64
  }
}

export function buildOipFiveTemplate( templateMessage ) {
  const templatePayload = {
    recordTemplate: templateMessage
  }
  
  let err = OipFiveProto.verify(templatePayload)
  if (err) {
    throw new Error(err)
  }
  
  const oip5message = OipFiveProto.create(templatePayload)
  const oip5messageBuffer = OipFiveProto.encode(oip5message).finish()
  const oip5message64 = util.base64.encode(oip5messageBuffer, 0, oip5messageBuffer.length)
  return { oip5messageBuffer, oip5message64, oip5message }
}


export default function templateBuilder ({ friendlyName, description, DescriptorSetProto, wif, network = 'mainnet' }) {
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
  
  // 1 build template message
  let { templateMessage } = buildRecordTemplate({ friendlyName, description, DescriptorSetProto })
  
  // 2 build OIP5
  const { oip5messageBuffer, oip5message64 } = buildOipFiveTemplate(templateMessage)
  
  // 3 sign oip5b64 message
  const { publicKeyAscii, signature } = signMessage({ ECPair: keypair, message: oip5message64 })
  
  // 4 build SignedMessageProto
  return buildSignedMessage({ SerializedMessage: oip5messageBuffer, PubKey: publicKeyAscii, Signature: signature })
}
