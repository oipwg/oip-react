import React, {useRef, useEffect} from 'react'
import moment from 'moment'
import uid from 'uid'

import buildQuery from './querybuilder'
import getAndParseMapping from './elasticmapparser'
import {useDateTimePicker, useComplexFilter} from "./hooks";

const stringFields = ['contains', 'is (exact)', 'is (not)']
const numFields = ['contains', 'is (exact)', 'is (not)', 'above', 'below', 'between']
const dateFields = ['is (exact)', 'before', 'is (not)', 'after', 'between']
const booleanFields = ['is']

//the root search component
const AdvancedSearchForm = (mapping) => {
	const id = useRef(uid()).current //set a unique id for the initial simple search form (to distinguish it from incoming complex search forms)
	const [state, add, handleRemove, handleUpdate] = useComplexFilter(id)
	
	//todo: remove when using real component for param input
	
	mapping = getAndParseMapping("mainnet-oip042_artifact")
	
	const splitField = (field) => {
		let split = field.split('.')
		return split[split.length-1]
	}
	const getFieldOptions = (field = '') => {
		if (field === '*') {
			return ['contains']
		}
		if (field === 'date') {
			return dateFields
		}
		const fieldType = mapping[splitField(field)].type
		switch (fieldType) {
			case 'string':
				return stringFields
			case 'number':
				return numFields
			case 'boolean':
				return booleanFields
			default:
				throw new Error(`Invalid field type: ${fieldType}`)
		}
	}
	
	const getFieldType = (field) => {
		if (field === '*') {
			return 'string'
		}
		field = splitField(field)
		return field === 'date' ? 'date' : mapping[field].type
	}
	
	return <>
		<form style={{display: 'block'}}>
			<FormBase
				mapping={mapping}
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
					mapping={mapping}
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

const Complex = ({id, state, mapping, handleUpdate, handleRemove, getFieldOptions, getFieldType}) => {
	return <>
		<select name={'operator'} onChange={(e) => handleUpdate(e, id)}>
			<option value={'AND'}> AND</option>
			<option value={'OR'}> OR</option>
			<option value={'NOT'}> NOT</option>
		</select>
		<FormBase
			id={id}
			state={state}
			mapping={mapping}
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

const FormBase = ({id, state, mapping, handleUpdate, getFieldOptions, getFieldType}) => {
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
			{Object.keys(mapping).map((k, i) => {
				return <option value={mapping[k].path} key={i}>{k}</option>
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

export default AdvancedSearchForm
