import protobuf from 'protobufjs/index'
import descriptor from 'protobufjs/ext/descriptor/index'
import _ from 'lodash'
import toPascalCase from 'js-pascalcase'

function protobuilder (form) {
  // console.log(form)
  let sorted = []
  for (let uid in form) {
    if (form.hasOwnProperty(uid)) {
      sorted.push([uid, form[uid].index])
    }
  }
  sorted.sort((a, b) => {
    return a[1] - b[1]
  })

  const P = new protobuf.Type('P')
  let counter = 1
  for (let item of sorted) {
    let index = counter
    let id = item[0]
    let rowData = form[id]
    let type = rowData.fieldType
    let name = _.camelCase(rowData.fieldName)
    if (!name || name === '') {
      throw new Error(`Missing field name at position: ${counter} for id: ${id}`)
    }
    let rule = rowData.fieldRule === 'repeated' ? 'repeated' : undefined

    let ENUM = rowData.enumValue ? rowData.enumValue : undefined

    let EnumProto

    if (ENUM) {
      name = toPascalCase(name)
      let enumValues = {}
      enumValues['UNDEFINED'] = 0 // set default value
      for (let entry in ENUM) {
        enumValues[`${name}_${ENUM[entry].toUpperCase()}`] = Number(Number(entry) + 1)
      }

      EnumProto = new protobuf.Enum(name, enumValues)
      P.add(EnumProto)
    } else {
      P.add(new protobuf.Field(name, index, type, rule))
    }

    counter += 1
  }

  let root = new protobuf.Root()
  root.define('oip5.record.templates').add(P)
  let descriptorFromRoot = root.toDescriptor('proto3')
  let buffer = descriptor.FileDescriptorSet.encode(descriptorFromRoot).finish()

  return buffer
}

export default protobuilder
