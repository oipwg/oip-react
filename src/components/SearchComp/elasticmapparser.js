import mapping42 from './042artifactMapping'

export default function getMapping(index, switchValue = true) {
	let mapping = {}
	function parseMapping(obj, stack = '') {
		for (let prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if (obj[prop]['properties']) {
					let updatedStack = stack + (stack === '' ? `${prop}` : `.${prop}`)
					parseMapping(obj[prop]['properties'], updatedStack )
				} else if (obj[prop]['fields']) {
					//toDo: add support for keywords
					mapping[prop] = {
						path: stack + `.${prop}`,
						...obj[prop]
					}
				} else {
					mapping[prop] = {
						path: stack + `.${prop}`,
						...obj[prop]
					}
				}
			}
		}
	}
	
	parseMapping(mapping42[index]['mappings']['_doc']['properties']) //toDo has to change to live api data
	if (!switchValue) {
		return mapping
	}
	
	const switchValues = (mapping) => {
		const switchVal = (value) => {
			switch (value) {
				case 'object': //todo ask bits about object type
					return undefined
				case 'long':
					return 'number'
				case 'keyword':
					return 'string'
				case 'text':
					return 'string'
				default:
					return value
			}
		}
		for (let keyField in mapping) {
			if (mapping.hasOwnProperty(keyField)) {
				
				let val = switchVal(mapping[keyField].type)
				if (val) { //remove the ones with typed 'object'
					mapping[keyField].type = val
				}
			}
		}
		return mapping
	}
	
	return switchValues(mapping)
}
