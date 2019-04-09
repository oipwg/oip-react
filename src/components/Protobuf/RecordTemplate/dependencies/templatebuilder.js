import protobuf from 'protobufjs'

async function templatebuilder (name, description, descriptor) {
  let ROOT = await protobuf.load(require('./protofiles/compiled/compiled'))
  console.log(ROOT)
  //
  // let RecordTemplate = ROOT.lookupType('oip5.record.RecordTemplateProto')
  // console.log(RecordTemplate)
  
  
}

export default templatebuilder
