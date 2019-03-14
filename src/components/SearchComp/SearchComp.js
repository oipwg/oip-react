import React, {useReducer, useRef, useEffect, useState} from 'react'
import moment from 'moment'
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
			if (val) { //remove the ones with typed 'object'
				tmpObj[keyField] = val
			}
		}
		return tmpObj
	}
	
	artMap = switchValues(artMap)
	metaMap = switchValues(metaMap)
	
	return [{...artMap, ryan: 'boolean'}, metaMap]
}

const [artMap, metaMap] = getMapping("mainnet-oip042_artifact")
// console.log('mymaps!!!!', artMap, metaMap)

const stringFields = ['contains', 'is (exact)', 'is (not)']
const numFields = ['contains', 'is (exact)', 'is (not)', 'above', 'below', 'between']
const dateFields = ['is (exact)', 'before', 'is (not)', 'after', 'between']
const booleanFields = ['is']

//reducer to handle form logic for a complex filter search
const useComplexFilter = (id) => {
	const initSimpleRow = {
		field: '*',
		option: 'contains',
		query: '',
		maxQuery: undefined,
		type: 'simple',
		index: 0,
	}
	
	const initCompRow = {
		operator: 'AND',
		field: '*',
		option: 'contains',
		query: '',
		maxQuery: undefined,
		type: 'complex',
	}
	const ADD = 'ADD'
	const REMOVE = 'REMOVE'
	const UPDATE = 'UPDATE'
	const RESET = 'RESET'
	
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
					forms: {...state.forms, [action.id]: {...initCompRow, index: state.count}},
					count: state.count + 1
				}
			case REMOVE:
				return {
					forms: removeItem(state.forms, action.id),
					count: state.count
				}
			case UPDATE:
				return {
					forms: updateItem(state.forms, action.id, action.key, action.value),
					count: state.count
				}
			case RESET:
				return init(action.id)
			default:
				throw new Error();
		}
	}
	
	function init(id) {
		return {
			forms: {[id]: initSimpleRow},
			count: 1,
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

//the root search component
const SearchComp = (mapping) => {
	const id = useRef(uid()).current //set a unique id for the initial simple search form (to distinguish it from incoming complex search forms)
	const [state, add, handleRemove, handleUpdate] = useComplexFilter(id)
	
	//todo: remove when using real component for param input
	mapping = artMap
	
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

function buildQuery(state) {
	const forms = state.forms
	let sorted = []
	for (let uid in forms) {
		sorted.push([uid, forms[uid].index])
	}
	sorted.sort((a, b) => {
		return a[1] - b[1]
	})
	
	let queryObject = {
		0: []
	}
	let count = 0
	for (let form of sorted) {
		const formId = form[0]
		const formState = forms[formId]
		
		let qb = handleQueryBuild(formState)
		if (formState.type === 'complex') {
			if (formState.operator === 'NOT') {
				queryObject[count].push('AND NOT')
			} else if (formState.operator === 'AND') {
				queryObject[count].push(formState.operator)
			} else {
				count+=1
				queryObject[count] = []
			}
		}
		queryObject[count].push(qb)
	}
	let query = '';
	for (let q in queryObject) {
		query+= `(${queryObject[q].join(' ')})`
		if (Number(q) !== Object.keys(queryObject).length - 1) {
			query+= ' OR '
		}
	}
	console.log(queryObject, query)
}

function handleContains(form) {
	if (form.field === '*') {
		return `${form.query}`
	}
	return `${form.field}:${form.query}`
}

function handleExact(form) {
	return `${form.field}:"${form.query}"`
}

function handleIsNot(form) {
	return `${form.field}:!${form.query}`
}

function handleGreater(form) {
	return `${form.field}:>${form.query}`
}

function handleLesser(form) {
	return `${form.field}:<${form.query}`
}

function handleBetween(form) {
	return `${form.field}:[${form.query} TO ${form.maxQuery}]`
}

function handleQueryBuild(form) {
	const type = form.option
	switch (type) {
		case 'contains':
			return handleContains(form)
		case 'is (exact)':
			return handleExact(form)
		case 'is (not)':
			return handleIsNot(form)
		case 'above':
			return handleGreater(form)
		case 'below':
			return handleLesser(form)
		case 'between':
			return handleBetween(form)
		case 'before':
			return handleLesser(form)
		case 'after':
			return handleGreater(form)
		case 'is':
			return handleExact(form)
		default:
			throw new Error('invalid query option')
	}
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

export default SearchComp

const dateObject = {
	JAN: {days: 31, mm: '01'},
	FEB: {days: 29, mm: '02'},
	MAR: {days: 31, mm: '03'},
	APR: {days: 30, mm: '04'},
	MAY: {days: 31, mm: '05'},
	JUN: {days: 30, mm: '06'},
	JUL: {days: 31, mm: '07'},
	AUG: {days: 31, mm: '08'},
	SEP: {days: 30, mm: '09'},
	OCT: {days: 31, mm: '10'},
	NOV: {days: 30, mm: '11'},
	DEC: {days: 31, mm: '12'},
}

const useDateTimePicker = () => {
	const [month, setMonth] = useState('01')
	const [day, setDay] = useState('01')
	const [year, setYear] = useState('1970')
	const [hour, setHour] = useState('00')
	const [minute, setMinute] = useState('00')
	const [second, setSecond] = useState('00')
	
	const isLeapYear = year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)
	// dateObject.FEB.days = isLeapYear ? 29 : 28
	
	let numOfDays
	for (let m in dateObject) {
		if (dateObject[m].mm === month) {
			numOfDays = dateObject[m].days
			break
		}
	}
	if (isLeapYear) {
		numOfDays++
	}
	const days = []
	for (let i = 1; i <= numOfDays; i++) {
		let num = `${i}`
		if (i < 10) {
			num = '0' + num
		}
		days.push(num)
	}
	
	const years = []
	for (let i = 2020; i >= 1900; i--) {
		years.push(i)
	}
	
	const hours = []
	const minutes = []
	const seconds = []
	
	for (let i = 0; i < 60; i++) {
		let strNum = `${i}`
		if (i < 10) {
			strNum = `0${strNum}`
		}
		minutes.push(strNum)
		seconds.push(strNum)
		if (i <= 24) {
			hours.push(strNum)
		}
	}
	
	return {
		month, day, year, //state
		hour, minute, second, //state
		setMonth, setDay, setYear, //setstate
		setHour, setMinute, setSecond, //setstate
		days, years, //html maps
		hours, minutes, seconds, //html maps
	}
}
//check for leap year
const DateTimePicker = ({name, id, handleUpdate}) => {
	moment.locale('en')
	const {
		month, day, year, //state
		setMonth, setDay, setYear, //setstate
		hour, minute, second, //state
		setHour, setMinute, setSecond, //setstate
		days, years, //html maps
		hours, minutes, seconds //html maps
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
