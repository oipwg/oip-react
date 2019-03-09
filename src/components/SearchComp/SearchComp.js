import React, {useReducer, useRef} from 'react'
import uid from 'uid'

import mapping42 from './042artifactMapping'

function getMapping(index) {
	//mock: use api to get mapping back from elastic
	
	const artifactMapping = mapping42[index]['mappings']['_doc']['properties']['artifact']['properties']
	const metaMapping = mapping42[index]['mappings']['_doc']['properties']['meta']['properties']
	
	const parseMap = mapping => {
		let tmpObj = {}
		const loopOverMapping = mapping => {
			for (let key in mapping) {
				if (mapping[key].properties) {
					loopOverMapping(mapping[key].properties)
				} else {
					tmpObj[key] = mapping[key].type
				}
			}
		}
		loopOverMapping(mapping)
		return tmpObj
	}
	
	let artMap = parseMap(artifactMapping)
	let metaMap = parseMap(metaMapping)
	
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
		let tmpObj = {}
		for (let keyField in mapping) {
			let val = switchVal(mapping[keyField])
			if (val) {
				tmpObj[keyField] = val
			}
		}
		return tmpObj
	}
	
	artMap = switchValues(artMap)
	metaMap = switchValues(metaMap)
	
	return [artMap, metaMap]
}

const [artMap, metaMap] = getMapping("mainnet-oip042_artifact")
console.log('mymaps!!!!', artMap, metaMap)

const stringFields = ['contains', 'is (exact)', 'startsWith']
const numFields = ['is (exact)', 'above', 'below', 'between']
const dateFields = ['is (exact)', 'before', 'after', 'between']
const booleanFields = ['is', 'is not']

//reducer to handle form logic for a complex filter search
const useComplexFilter = (id) => {
	const initSimpleRow = {
		field: '*',
		option: 'contains',
		query: '',
		type: 'simple',
	}
	
	const initCompRow = {
		operator: 'AND',
		field: '*',
		option: 'contains',
		query: '',
		type: 'complex',
	}
	const ADD = 'ADD'
	const REMOVE = 'REMOVE'
	const UPDATE = 'UPDATE'
	
	function init(id) {
		return {
			forms: {[id]: initSimpleRow}
		}
	}
	
	function updateItem(forms, id, key, value) {
		return {
			...forms,
			[id]: {...forms[id], [key]: value}
		}
	}
	
	function removeItem(forms, id) {
		let {[id]: _, ...rest} = forms
		return rest
	}
	
	function reducer(state, action) {
		switch (action.type) {
			case ADD:
				return {
					forms: {...state.forms, [action.id]: initCompRow}
				}
			case REMOVE:
				return {
					forms: removeItem(state.forms, action.id)
				}
			case UPDATE:
				return {
					forms: updateItem(state.forms, action.id, action.key, action.value)
				}
			default:
				throw new Error();
		}
	}
	
	const [state, dispatch] = useReducer(reducer, id, init);
	
	const _dispatch = (type, id, key, value) => {
		dispatch({type, id, key, value})
	}
	
	function update(e, id) {
		const name = e.target.name
		const value = e.target.value
		
		_dispatch(UPDATE, id, name, value)
	}
	
	function add(id) {
		_dispatch(ADD, id)
	}
	
	function remove(id) {
		_dispatch(REMOVE, id)
	}
	
	return [state, add, remove, update]
}

const SearchComp = (fields) => {
	const id = useRef(uid()).current
	const [state, add, handleRemove, handleUpdate] = useComplexFilter(id)
	
	let fieldKeys = Object.keys(mockFields)
	
	return <>
		<form style={{display: 'block'}}>
			<select name={'field'} onChange={(e) => handleUpdate(e, id)}>
				<option value={'*'}>All Fields</option>
				{fieldKeys.map((k, i) => {
					return <option value={k} key={i}>{k}</option>
				})}
			</select>
			<select name={'option'} onChange={(e) => handleUpdate(e, id)}>
				{getSelectOptionsForField(state.forms[id]['field']).map((opt, i) => {
					return <option value={opt} key={i}>{opt}</option>
				})}
			</select>
			<input name={'query'} type={'search'} onChange={(e) => handleUpdate(e, id)}/>
		</form>
		{Object.keys(state.forms).filter(uid => uid !== id).map(id => {
			return <Complex
				key={id}
				id={id}
				fieldKeys={fieldKeys}
				state={state}
				handleUpdate={handleUpdate}
				handleRemove={handleRemove}
			/>
		})}
		<div style={{display: 'flex', flexDirection: 'row'}}>
			<button onClick={() => {
				console.log(state)
			}}>Log State
			</button>
			<button onClick={() => add(uid())}>Add Row</button>
		</div>
	</>
}

const Complex = ({id, fieldKeys, state, handleUpdate, handleRemove}) => {
	return <>
		<form style={{display: 'block'}}>
			<select name={'operator'} onChange={(e) => handleUpdate(e, id)}>
				<option value={'AND'}> AND</option>
				<option value={'OR'}> OR</option>
				<option value={'NOT'}> NOT</option>
			</select>
			<select name={'field'} onChange={(e) => handleUpdate(e, id)}>
				<option value={'*'}>All Fields</option>
				{fieldKeys.map((k, i) => {
					return <option value={k} key={i}>{k}</option>
				})}
			</select>
			<select name={'option'} onChange={(e) => handleUpdate(e, id)}>
				{getSelectOptionsForField(state.forms[id]['field']).map((opt, i) => {
					return <option value={opt} key={i}>{opt}</option>
				})}
			</select>
			<input name={'query'} type={'text'} onChange={(e) => handleUpdate(e, id)}/>
			<button onClick={(e) => {e.preventDefault(); handleRemove(id)}}> - </button>
		</form>
	</>
}

export default SearchComp