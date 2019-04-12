import protobuf, { Field, Message, Root, Type } from 'protobufjs'
import descriptor from 'protobufjs/ext/descriptor'
import path from 'path'

const protoScalarValues = [
  'string', 'bool', 'bytes', 'double', 'float', 'int32',
  'int64', 'uint32', 'uint64', 'sint32', 'sint64',
  'fixed32', 'fixed64', 'sfixed32', 'sfixed64'
]

describe('protobuf.js', () => {
  it('default load proto file', async () => {
    let root = await protobuf.load(path.resolve('./', 'tests', 'Protobuf', 'resources', 'proto', 'RecordTemplate.proto'))
    expect(root).toBeInstanceOf(Root)

    let MessageType = root.lookupType('oip5.RecordTemplateProto') // packagename.MessageName
    expect(MessageType).toBeInstanceOf(Type)

    let payload = { friendlyName: 'RandomString' }
    let err = MessageType.verify(payload)
    expect(err).toBeNull()

    let messageFromPayload = MessageType.create(payload)
    expect(messageFromPayload).toBeInstanceOf(Message)

    let buffer = MessageType.encode(messageFromPayload).finish()
    expect(buffer).toBeInstanceOf(Buffer)

    let decodedBuffer = MessageType.decode(buffer)
    expect(decodedBuffer).toBeInstanceOf(Message)

    let object = MessageType.toObject(decodedBuffer, {
      longs: String,
      enums: String,
      bytes: String
    })
    expect(object).toEqual({
      'friendlyName': 'RandomString'
    })
  })
  it('load proto, toJSON === compiled fromJSON', async () => {
    let root = await protobuf.load(path.resolve('./', 'tests', 'Protobuf', 'resources', 'proto', 'RecordTemplate.proto'))
    expect(root).toBeInstanceOf(Root)
    expect(root.lookupType('oip5.RecordTemplateProto')).toBeInstanceOf(Type)
    expect(root.toJSON().nested.oip5).toEqual(require('./resources/compiled/json/compiled.json').nested.oip5)

    let root2 = Root.fromJSON(require('./resources/compiled/json/compiled.json').nested.oip5)
    expect(root2).toBeInstanceOf(Root)
    expect(root2.lookupType('record.RecordTemplateProto')).toBeInstanceOf(Type)
  })
  it('JsonDescriptor >> FileDescriptorSet', () => {
    let root = protobuf.Root.fromJSON(require('./resources/compiled/json/compiled'))
    expect(root).toBeInstanceOf(Root)
    let RecordTemplateType = root.lookupType('oip5.RecordTemplateProto')
    expect(RecordTemplateType).toBeInstanceOf(Type)

    // let desc = RecordTemplateType.toDescriptor('proto3')
    // let buf = descriptor.FileDescriptorSet.encode(desc).finish()
    // let dec = descriptor.FileDescriptorSet.decode(buf)
    // let type = protobuf.Type.fromDescriptor(dec)
    // console.log(type)

    let descriptorFromRoot = root.toDescriptor('proto3')
    expect(descriptorFromRoot).toBeDefined()
    let buffer = descriptor.FileDescriptorSet.encode(descriptorFromRoot).finish()
    expect(buffer).toBeDefined()

    let decodedDescriptor = descriptor.FileDescriptorSet.decode(buffer)
    expect(decodedDescriptor).toEqual(descriptorFromRoot)

    let rootFromDescriptor = protobuf.Root.fromDescriptor(decodedDescriptor)
    expect(rootFromDescriptor).toBeInstanceOf(Root)
  })
  it('Type >> FileDescriptorSet', () => {
    const P = new protobuf.Type('P')
    P.add(new protobuf.Field('ryan', 1, 'string'))
    let root = new protobuf.Root()
    expect(root).toBeInstanceOf(Root)
    root.define('oip5.record.templates').add(P)
    let descriptorFromRoot = root.toDescriptor('proto3')
    expect(descriptorFromRoot).toBeDefined()
    let buffer = descriptor.FileDescriptorSet.encode(descriptorFromRoot).finish()
    expect(buffer).toBeInstanceOf(Buffer)
  })
  it('create Message from Type', () => {
    let messageTemp = {
      friendlyName: 'sir',
      description: 'wut',
      DescriptorSetProto: 'shouldBeBytes'
    }
    let root = protobuf.Root.fromJSON(require('./resources/compiled/json/compiled'))
    let type_recordTemplate = root.lookupType('oip5.RecordTemplateProto')
    let err = type_recordTemplate.verify(messageTemp)
    if (err) {
      console.log(err)
    }
    expect(err).toBeNull()
    let message = type_recordTemplate.create(messageTemp)
    expect(message).toBeInstanceOf(Message)
  })
  it('create Type using reflection only', () => {
    let ReflectMessage = new Type('P').add(new Field('scattered', 1, 'string'))
    ReflectMessage.add(new Field('random', 2, 'float'))
    let root = new Root().define('oip5.record.templates').add(ReflectMessage)
    let type = root.lookupType('oip5.record.templates.P')
    expect(type).toBeInstanceOf(Type)

    let tempObj = {
      scattered: 'string'
    }
    let err = type.verify(tempObj)
    console.log(err)
  })
  it('create Message Type using reflection and all possible proto fields', () => {
    let ReflectMessage = new Type('P')

    for (let i = 0; i < protoScalarValues.length; i++) {
      ReflectMessage.add(new Field(protoScalarValues[i], i + 1, protoScalarValues[i]))
    }

    let root = new Root().define('oip5.record.templates').add(ReflectMessage)
    let type = root.lookupType('oip5.record.templates.P')

    expect(type).toBeInstanceOf(Type)

    let tempObj = {
      sint32: 1
    }
    let err = type.verify(tempObj)
    expect(err).toBeNull()
  })
  it('create Field using rules', () => {
    expect(new Field('name', 1, 'string')).toBeInstanceOf(Field)
    expect(new Field('name', 1, 'string', 'repeated')).toBeInstanceOf(Field)
    expect(new Field('name', 1, 'string', undefined)).toBeInstanceOf(Field)

    // expect(new Field('name', 1, 'string', null)).toThrow('rule must be a string rule')

    try {
      new Field('name', 1, 'string', 'random')
    } catch (err) {
      expect(err).toBeDefined()
    }

    try {
      new Field('name', 1, 'string', 'singular')
    } catch (err) {
      expect(err).toBeDefined()
    }

    try {
      new Field('name', 1, 'string', '')
    } catch (err) {
      expect(err).toBeDefined()
    }

    try {
      new Field('name', 1, 'string', 2)
    } catch (err) {
      expect(err).toBeDefined()
    }
  })
  it('require compiled static-module', () => {
    const rootmodules = require('./resources/compiled/module/compiled')
    const RecordTemplateProto = rootmodules.oip5.record.RecordTemplateProto

    let payload = {
      friendlyName: 'ryan test',
      description: 'yah'
    }
    let err = RecordTemplateProto.verify(payload) // verify with proper fields
    expect(err).toBeNull()

    payload = {
      friendlyName: 3,
      description: 2
    }

    err = RecordTemplateProto.verify(payload) // with incorrect field types
    expect(err).not.toBeNull()

    payload = {}
    err = RecordTemplateProto.verify(payload) // with ignore fields
    expect(err).toBeNull()

    // const SignedMessage = rootmodules.oipProto.SignedMessage
  })
  it.skip('load compiled static-module', async () => {
    let ROOT = await protobuf.load(require('./resources/compiled/module/compiled'))
    console.log(ROOT)
  }
  )
  it.skip('load compiled json', async () => {
    let ROOT = await protobuf.load(require('./resources/compiled/json/compiled'))
    console.log(ROOT)
  })
})
