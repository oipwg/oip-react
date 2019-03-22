import React, { useRef, useEffect, useLayoutEffect, useState } from 'react'
import withStyles from 'react-jss'
import moment from 'moment'
import uid from 'uid'
import __ from 'classnames'

import buildQuery from './dependencies/querybuilder'
import getAndParseMapping from './dependencies/elasticmapparser'
import { useDateTimePicker, useComplexFilter } from './dependencies/dcsHooks'
import baseStyles from './styles'

const stringFields = ['contains', 'is (exact)', 'is (not)', 'exists', 'nonexistent']
const numFields = ['is (exact)', 'is (not)', 'above', 'below', 'between', 'exists', 'nonexistent']
const dateFields = ['is (on)', 'is (not on)', 'after', 'before', 'between', 'exists', 'nonexistent']
const booleanFields = ['is', 'exists', 'nonexistent']

// the root search component
const DynamicComplexSearch = ({ mapping, onSubmit, styles}) => {
  if (!onSubmit) {
    throw new Error('Must pass in an onSubmit callback function')
  }
  const StyledFormContainer = withStyles(styles)(FormContainer)
  return <StyledFormContainer
    mapping={mapping}
    onSubmit={onSubmit}
  />
}

const FormContainer = ({ mapping, onSubmit, classes }) => {
  const rootId = useRef(uid()).current // set a unique id for the initial simple search form (to distinguish it from incoming complex search forms)
  const [state, add, handleRemove, handleUpdate] = useComplexFilter(rootId)
  // todo: remove when using real component for param input
  mapping = getAndParseMapping({ index: 'mainnet-oip042_artifact' })
  // console.log(mapping)
  const splitField = (field) => {
    let split = field.split('.')
    return split[split.length - 1]
  }
  const getFieldOptions = (field = '') => {
    if (field === '*') {
      return ['contains']
    }

    const fieldType = splitField(field) === 'date' ? 'date' : mapping[splitField(field)].type

    switch (fieldType) {
      case 'date':
        return dateFields
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
    if (field === '*') {
      return 'string'
    }
    field = splitField(field)
    return field === 'date' ? 'date' : mapping[field].type
  }
  return <FormWrapper
    mapping={mapping}
    getFieldOptions={getFieldOptions}
    getFieldType={getFieldType}
    handleUpdate={handleUpdate}
    handleRemove={handleRemove}
    add={add}
    state={state}
    rootId={rootId}
    classes={classes}
    onSubmit={onSubmit}
  />
}

const FormWrapper = withStyles(baseStyles)(({
  mapping,
  getFieldOptions,
  getFieldType,
  handleUpdate,
  handleRemove,
  add,
  state,
  rootId,
  classes,
  onSubmit
}) => {
  return <div className={classes.root}>
    <form className={classes.formRow}>
      <FormBase
        mapping={mapping}
        getFieldOptions={getFieldOptions}
        getFieldType={getFieldType}
        handleUpdate={handleUpdate}
        id={rootId}
        state={state}
        classes={classes}
      />
    </form>
    {/* filter out simple form */}
    {Object.keys(state.forms).filter(uid => uid !== rootId).map(uid => {
      return <form key={uid} className={classes.formRow}>
        <ComplexBase
          id={uid}
          state={state}
          mapping={mapping}
          handleUpdate={handleUpdate}
          handleRemove={handleRemove}
          getFieldOptions={getFieldOptions}
          getFieldType={getFieldType}
          classes={classes}
        />
      </form>
    })}
    {/* toDo remove and add callback to get access to query */}
    <div className={classes.buttonRow}>
      <button className={classes.addButton} onClick={() => add(uid())}>Add Row</button>
      <button
        className={classes.submitButton}
        onClick={(e) => { e.preventDefault(); onSubmit(buildQuery(state)) }}>
        Submit
      </button>
    </div>
  </div>
})

const FormBase = ({ id, state, mapping, handleUpdate, getFieldOptions, getFieldType, classes }) => {
  const formState = state.forms[id]
  const field = formState['field']
  const option = formState['option']

  const optionRef = useRef(null)

  // when the field updates, make sure the option gets updated too
  useEffect(() => {
    const name = optionRef.current.name
    const value = optionRef.current.value
    handleUpdate({ target: { name, value } }, id) // simulate e.target.[] event
  }, [field])

  const shouldRenderQueryInput = !(option === 'exists' || option === 'nonexistent')

  return <>
    <select
      className={classes.selectField}
      name={'field'}
      onChange={(e) => handleUpdate(e, id)}
    >
      <option
        value={'*'}>
            All Fields
      </option>
      {Object.keys(mapping).map((k, i) => {
        return <option value={mapping[k].path} key={i}>{k}</option>
      })}
    </select>
    <select
      className={classes.selectOption}
      ref={optionRef}
      name={'option'}
      onChange={(e) => handleUpdate(e, id)}>
      {getFieldOptions(field).map((opt, i) => {
        return <option value={opt} key={i}>{opt}</option>
      })}
    </select>
    {shouldRenderQueryInput ? <FormQueryInput
      handleUpdate={handleUpdate}
      id={id}
      option={option}
      getFieldType={getFieldType}
      field={field}
      formState={formState}
      classes={classes}
    /> : null}
  </>
}

const ComplexBase = ({ id, state, mapping, handleUpdate, handleRemove, getFieldOptions, getFieldType, classes }) => {
  return <>
    <select className={classes.selectOp} name={'operator'} onChange={(e) => handleUpdate(e, id)}>
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
      classes={classes}
    />
    <button className={classes.removeButton} onClick={(e) => {
      e.preventDefault()
      handleRemove(id)
    }}> -
    </button>
  </>
}

const FormQueryInput = ({ handleUpdate, id, option, getFieldType, field, classes }) => {
  const booleanRef = useRef(null)
  const textNumRef = useRef(null)
  const textNumBetweenRef = useRef(null)

  let fieldType = getFieldType(field)

  if (fieldType === 'string') {
    fieldType = 'text'
  }

  const forceUpdate = (ref) => {
    const name = ref.current.name
    const value = ref.current.value
    handleUpdate({ target: { name, value } }, id) // simulate e.target.[] event
  }

  // when the field changes, update option field
  useEffect(() => {
    if (fieldType === 'boolean') {
      forceUpdate(booleanRef)
    }
    if ((fieldType === 'text' || fieldType === 'number') && field !== 'date') {
      if (textNumRef) {
        forceUpdate(textNumRef)
        if (textNumBetweenRef.current) {
          forceUpdate(textNumBetweenRef)
        }
      }
    }
  }, [field])

  const input = (type) => {
    return <div className={classes.queryContainer}>
      <input className={classes.inputQuery} ref={textNumRef} name={'query'} type={type} onChange={(e) => handleUpdate(e, id)} />
      {option === 'between' ? <>
        <span className={classes.andSpan}>and</span>
        <input className={classes.inputQuery} ref={textNumBetweenRef} name={'maxQuery'} type={type}
          onChange={(e) => handleUpdate(e, id)} /> </> : null
      }
    </div>
  }

  const dtp = (name) => <DateTimePicker
    handleUpdate={handleUpdate}
    name={name}
    id={id}
    option={option}
    classes={classes}
  />
  const renderDateTimePicker = () => <div className={classes.queryContainer}>
    {dtp('query')}
    {option === 'between' ? <><span className={classes.andSpan}>and</span>{dtp('maxQuery')} </> : null}
  </div>

  // text, number, boolean, or date
  const renderFormInput = (fieldType) => {
    switch (fieldType) {
      case 'text':
      case 'number':
        return input(fieldType)
      case 'boolean':
        return <select className={classes.selectOption} ref={booleanRef} name={'query'} onChange={(e) => handleUpdate(e, id)}>
          <option value>True</option>
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

const DateTimePicker = ({ name, id, handleUpdate, option, classes }) => {
  moment.locale('en')

  const pickingOnDate = option === 'is (on)' || option === 'is (not on)'
  const [displayTimePicker, toggleTimePicker] = useState(false)
  // don't display time picker when picking 'on' dates (see react docs for why we useLayoutEffect here. Or use[Effect])
  useLayoutEffect(() => {
    const shouldDisplayTimePicker = !pickingOnDate
    toggleTimePicker(shouldDisplayTimePicker)
  }, [option])

  const {
    month, day, year, // state
    setMonth, setDay, setYear, // setstate
    hour, minute, second, // state
    setHour, setMinute, setSecond, // setstate
    days, years, // html maps
    hours, minutes, seconds, // html maps
    dateObject
  } = useDateTimePicker()

  function getUnixTimestamp () {
    return moment.utc(`${year}-${month}-${day} ${hour}:${minute}:${second}`).unix()
  }

  // this takes the local state found in useDateTimePicker and updates the global reducer form state
  useEffect(() => {
    const value = getUnixTimestamp()
    if (pickingOnDate) {
      const unixDay = 86400 - 1 // minus one to get 12:00am to 11:59pm
      handleUpdate({ target: { name, value } }, id)
      handleUpdate({ target: { name: 'maxQuery', value: value + unixDay } }, id)
    } else {
      handleUpdate({ target: { name, value } }, id)
    }
  }, [month, day, year, hour, minute, second])

  return <div className={classes.dateTimePicker}>
    <DatePicker
      setMonth={setMonth}
      dateObject={dateObject}
      setDay={setDay}
      days={days}
      setYear={setYear}
      years={years}
      classes={classes}
    />
    {displayTimePicker ? <TimePicker
      setHour={setHour}
      hours={hours}
      setMinute={setMinute}
      minutes={minutes}
      setSecond={setSecond}
      seconds={seconds}
      classes={classes}
    /> : null}
  </div>
}

const DatePicker = ({ setMonth, dateObject, setDay, days, setYear, years, classes }) => {
  return <div className={classes.datePicker}>
    <select className={classes.selectField} onChange={(e) => {
      setMonth(e.target.value)
    }} name={'months'}>
      {Object.keys(dateObject).map((m, i) => {
        return <option key={i} value={dateObject[m].mm}>{m}</option>
      })}
    </select>
    <select className={classes.selectField} onChange={(e) => {
      setDay(e.target.value)
    }} name={'days'}>
      {days.map((d, i) => {
        return <option key={i} value={d}>{d}</option>
      })}
    </select>
    <input className={classes.inputDatalist} onChange={(e) => {
      setYear(e.target.value)
    }} type={'number'} list={'years'} />
    <datalist id={'years'}>
      {years.map((y, i) => {
        return <option key={i} value={y}>{y}</option>
      })}
    </datalist>
  </div>
}

const TimePicker = ({ setHour, hours, setMinute, minutes, setSecond, seconds, classes }) => {
  return <div className={classes.timePicker}>
    <select className={classes.selectField} onChange={(e) => {
      setHour(e.target.value)
    }} name={'hours'}>
      {hours.map((m, i) => {
        return <option key={i} value={m}>{m}hr</option>
      })}
    </select>
    <select className={classes.selectField} onChange={(e) => {
      setMinute(e.target.value)
    }} name={'minutes'}>
      {minutes.map((m, i) => {
        return <option key={i} value={m}>{m}m</option>
      })}
    </select>
    <select className={classes.selectField} onChange={(e) => {
      setSecond(e.target.value)
    }} name={'seconds'}>
      {seconds.map((m, i) => {
        return <option key={i} value={m}>{m}s</option>
      })}
    </select>
  </div>
}

export default DynamicComplexSearch
