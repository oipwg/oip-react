import React, {useRef, useEffect} from 'react'
import moment from 'moment'
import uid from 'uid'

import buildQuery from './querybuilder'
import getAndParseMapping from './elasticmapparser'
import {useDateTimePicker, useComplexFilter} from "./hooks";
import mapping42 from './042artifactMapping'

function getMapping(index) {
	//mock: use api to get mapping back from elastic
	
	// console.log(mapping42[index]['mappings']['_doc']['properties'])
	
	const artifactMapping = mapping42[index]['mappings']['_doc']['properties']['artifact']['properties']
	const metaMapping = mapping42[index]['mappings']['_doc']['properties']['meta']['properties']
	
	const parseMap = mapping => {
		let tmpObj = {}
		const loopOverMapping = (mapping) => {
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
			if (val) { //remove the ones with typed 'object'
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
// console.log('mymaps!!!!', artMap, metaMap)

const stringFields = ['contains', 'is (exact)', 'is (not)']
const numFields = ['contains', 'is (exact)', 'is (not)', 'above', 'below', 'between']
const dateFields = ['is (exact)', 'before', 'is (not)', 'after', 'between']
const booleanFields = ['is']

//the root search component
const SearchComp = (mapping) => {
	const id = useRef(uid()).current //set a unique id for the initial simple search form (to distinguish it from incoming complex search forms)
	const [state, add, handleRemove, handleUpdate] = useComplexFilter(id)
	
	//todo: remove when using real component for param input
	mapping = artMap
	// const map2 = getAndParseMapping("mainnet-oip042_artifact")
	
	let fieldKeys = Object.keys(mapping)
	const getFieldOptions = (field = '') => {
		if (field === 'date') {
			return dateFields
		}
		const fieldType = mapping[field]
		switch (fieldType) {
			case 'string':
				return stringFields
			case 'number':
				return numFields
			case 'boolean':
				return booleanFields
			default:
				return ['contains']
		}
	}
	
	const getFieldType = (field) => {
		return field === 'date' ? 'date' : mapping[field]
	}
	
	return <>
		<form style={{display: 'block'}}>
			<FormBase
				fieldKeys={fieldKeys}
				getFieldOptions={getFieldOptions}
				getFieldType={getFieldType}
				handleUpdate={handleUpdate}
				id={id}
				state={state}
			/>
		</form>
		{/*filter out simple form*/}
		{Object.keys(state.forms).filter(uid => uid !== id).map(uid => {
			return <form key={uid} style={{display: 'block'}}>
				<Complex
					id={uid}
					state={state}
					fieldKeys={fieldKeys}
					handleUpdate={handleUpdate}
					handleRemove={handleRemove}
					getFieldOptions={getFieldOptions}
					getFieldType={getFieldType}
				/>
			</form>
		})}
		
		<div style={{display: 'flex', flexDirection: 'row'}}>
			<button onClick={() => {
				console.log(state)
			}}>Log State
			</button>
			<button onClick={(e) => {
				e.preventDefault();
				buildQuery(state)
			}}>Build Query
			</button>
			<button onClick={() => add(uid())}>Add Row</button>
		</div>
	</>
}

const Complex = ({id, state, fieldKeys, handleUpdate, handleRemove, getFieldOptions, getFieldType}) => {
	return <>
		<select name={'operator'} onChange={(e) => handleUpdate(e, id)}>
			<option value={'AND'}> AND</option>
			<option value={'OR'}> OR</option>
			<option value={'NOT'}> NOT</option>
		</select>
		<FormBase
			id={id}
			state={state}
			fieldKeys={fieldKeys}
			handleUpdate={handleUpdate}
			getFieldOptions={getFieldOptions}
			getFieldType={getFieldType}
		/>
		<button onClick={(e) => {
			e.preventDefault();
			handleRemove(id)
		}}> -
		</button>
	</>
}

const FormBase = ({id, state, fieldKeys, handleUpdate, getFieldOptions, getFieldType}) => {
	const formState = state.forms[id]
	const field = formState['field']
	const option = formState['option']
	
	const optionRef = useRef(null)
	
	//when the field updates, make sure the option gets updated too //todo make sure query ref gets updated too
	useEffect(() => {
		const name = optionRef.current.name
		const value = optionRef.current.value
		handleUpdate({target: {name, value}}, id) //simulate e.target.[] event
	}, [field])
	
	return <>
		<select name={'field'} onChange={(e) => handleUpdate(e, id)}>
			<option value={'*'}>All Fields</option>
			{fieldKeys.map((k, i) => {
				return <option value={k} key={i}>{k}</option>
			})}
		</select>
		<select ref={optionRef} name={'option'} onChange={(e) => handleUpdate(e, id)}>
			{getFieldOptions(field).map((opt, i) => {
				return <option value={opt} key={i}>{opt}</option>
			})}
		</select>
		<FormQueryInput
			handleUpdate={handleUpdate}
			id={id}
			option={option}
			getFieldType={getFieldType}
			field={field}
			formState={formState}
		/>
	</>
}

const FormQueryInput = ({handleUpdate, id, option, getFieldType, field}) => {
	const booleanRef = useRef(null)
	let fieldType = getFieldType(field)
	
	if (fieldType === 'string') {
		fieldType = 'text'
	}
	
	//when the field changes, update option field
	useEffect(() => {
		if (fieldType === 'boolean') {
			const name = booleanRef.current.name
			const value = booleanRef.current.value
			handleUpdate({target: {name, value}}, id) //simulate e.target.[] event
		}
		// if (fieldType === 'text' || fieldType === 'number') {
		// 	console.log('fieldtype is text/number')
		// }
	}, [field])
	
	const input = (type) => {
		return <>
			<input name={'query'} type={type} onChange={(e) => handleUpdate(e, id)}/>
			{option === 'between' ? <>
				<span>and</span>
				<input name={'maxQuery'} type={type} onChange={(e) => handleUpdate(e, id)}/> </> : null
			}
		</>
	}
	
	const dtp = (name) => <DateTimePicker
		handleUpdate={handleUpdate}
		name={name}
		id={id}
	/>
	const renderDateTimePicker = () => <>
		{dtp('query')}
		{option === 'between' ? <><span>and</span>{dtp('maxQuery')} </> : null}
	</>
	
	//text, number, boolean, or date
	const renderFormInput = (fieldType) => {
		switch (fieldType) {
			case 'text':
			case 'number':
				return input(fieldType)
			case 'boolean':
				return <select ref={booleanRef} name={'query'} onChange={(e) => handleUpdate(e, id)}>
					<option value={true}>True</option>
					<option value={false}>False</option>
				</select>
			case 'date':
				return renderDateTimePicker()
			default:
				return input(fieldType)
		}
	}
	return renderFormInput(fieldType)
}

const DateTimePicker = ({name, id, handleUpdate}) => {
	moment.locale('en')
	const {
		month, day, year, //state
		setMonth, setDay, setYear, //setstate
		hour, minute, second, //state
		setHour, setMinute, setSecond, //setstate
		days, years, //html maps
		hours, minutes, seconds, //html maps
		dateObject
	} = useDateTimePicker()
	
	function getUnixTimestamp() {
		// console.log(year,month,day,hour,minute,second)
		// console.log(`${year}-${month}-${day} ${hour}:${minute}:${second}`)
		// console.log(moment.utc(`${year}-${month}-${day} ${hour}:${minute}:${second}`).unix())
		return moment.utc(`${year}-${month}-${day} ${hour}:${minute}:${second}`).unix()
	}
	
	useEffect(() => {
		const value = getUnixTimestamp()
		handleUpdate({target: {name, value}}, id)
	}, [month, day, year, hour, minute, second])
	
	return <>
		<select onChange={(e) => {
			setMonth(e.target.value)
		}} name={'months'}>
			{Object.keys(dateObject).map((m, i) => {
				return <option key={i} value={dateObject[m].mm}>{m}</option>
			})}
		</select>
		<select onChange={(e) => {
			setDay(e.target.value)
		}} name={'days'}>
			{days.map((d, i) => {
				return <option key={i} value={d}>{d}</option>
			})}
		</select>
		<input onChange={(e) => {
			setYear(e.target.value)
		}} type={'number'} list={'years'}/>
		<datalist id={'years'}>
			{years.map((y, i) => {
				return <option key={i} value={y}>{y}</option>
			})}
		</datalist>
		<select onChange={(e) => {
			setHour(e.target.value)
		}} name={'hours'}>
			{hours.map((m, i) => {
				return <option key={i} value={m}>{m}hr</option>
			})}
		</select>
		<select onChange={(e) => {
			setMinute(e.target.value)
		}} name={'minutes'}>
			{minutes.map((m, i) => {
				return <option key={i} value={m}>{m}m</option>
			})}
		</select>
		<select onChange={(e) => {
			setSecond(e.target.value)
		}} name={'seconds'}>
			{seconds.map((m, i) => {
				return <option key={i} value={m}>{m}s</option>
			})}
		</select>
	</>
}

export default SearchComp
