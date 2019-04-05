import protobuf, { Root, Type, Message, Field } from 'protobufjs'
import descriptor from 'protobufjs/ext/descriptor'
import path from 'path'

const protoScalarValues = [
  'string', 'bool', 'bytes', 'double', 'float', 'int32',
  'int64', 'uint32', 'uint64', 'sint32', 'sint64',
  'fixed32', 'fixed64', 'sfixed32', 'sfixed64'
]

describe('protobuf.js', () => {
  it('test docs example', async () => {
    let root = await protobuf.load(path.resolve('./', 'tests', 'Protobuf', 'test.proto'))
    expect(root).toBeInstanceOf(Root)
    
    let TestMessage = root.lookupType('oip5.RecordTemplate') // packagename.MessageName
    expect(TestMessage).toBeInstanceOf(Type)
    
    let payload = { randomField: 'RandomString' }
    let err = TestMessage.verify(payload)
    expect(err).toBeNull()
    
    let messageFromPayload = TestMessage.create(payload)
    expect(messageFromPayload).toBeInstanceOf(Message)
    
    let buffer = TestMessage.encode(messageFromPayload).finish()
    expect(buffer).toBeInstanceOf(Buffer)
    
    let decodedBuffer = TestMessage.decode(buffer)
    expect(decodedBuffer).toBeInstanceOf(Message)
    
    let object = TestMessage.toObject(decodedBuffer, {
      longs: String,
      enums: String,
      bytes: String
    })
    expect(object).toEqual({})
  })
  it('proto -> json && json -> proto', async () => {
    let root = await protobuf.load(path.resolve('./', 'tests', 'Protobuf', 'recordTemplate.proto'))
    expect(root).toBeInstanceOf(Root)
    expect(root.lookupType('oip5.RecordTemplate')).toBeInstanceOf(Type)
    expect(root.toJSON()).toEqual(require('./recordTemplate'))
    
    let root2 = Root.fromJSON(require('./recordTemplate'))
    expect(root2).toBeInstanceOf(Root)
    expect(root2.lookupType('oip5.RecordTemplate')).toBeInstanceOf(Type)
  })
  it('JsonDescriptor >> FileDescriptorSet', () => {
    let root = protobuf.Root.fromJSON(require('./recordTemplate'))
    expect(root).toBeInstanceOf(Root)
    
    let RecordTemplateType = root.lookupType('oip5.RecordTemplate')
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
    let root = protobuf.Root.fromJSON(require('./recordTemplate'))
    let type_recordTemplate = root.lookupType('oip5.records.RecordTemplate')
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
      ReflectMessage.add(new Field(protoScalarValues[i], i+1, protoScalarValues[i]))
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
  it('use a generated static RecordTemplate module', () => {
    const rt = require('./compiled').oip5
    const template = rt.records.RecordTemplate
    
    let payload = {
      friendlyName: 'ryan test',
      description: 'yah',
    }
    let err = template.verify(payload) // verify with proper fields
    expect(err).toBeNull()
    
    payload = {
      friendlyName: 3,
      description: 2
    }
    
    err = template.verify(payload) // with incorrect field types
    expect(err).not.toBeNull()
    
    payload = {}
    err = template.verify(payload) // with ignore fields
    expect(err).toBeNull()
    
  })
})
