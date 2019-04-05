import React, { useRef } from 'react'
import { withStyles } from '../../theme'
import uid from 'uid'

import { useGlobalFormState } from '../index'
import { protobuilder } from './dependencies'

const protoFields = {
  'string': 'text',
  'bool': 'text',
  'bytes': 'test',
  'double': 'number',
  'float': 'number',
  'int32': 'number',
  'int64': 'number',
  'uint32': 'number',
  'uint64': 'number',
  'sint32': 'number',
  'sint64': 'number',
  'fixed32': 'number',
  'fixed64': 'number',
  'sfixed32': 'number',
  'sfixed64': 'number',
}

const SelectOptions = React.memo((
  { state, opts, onChange, onFocus, onBlur, id, name = '' }
) => {
  return <select
    onChange={onChange ? (e) => onChange(e, id) : null}
    onFocus={onFocus ? (e) => {onFocus(e, id)} : null}
    onBlur={onBlur ? (e) => {onBlur(e, id)} : null}
    name={name}
    value={state[name]}
  >
    {Object.keys(opts).map((opt, i) => {
      return <option
        key={i}
        value={opt}
      >
        {opt}
      </option>
    })}
  </select>
}, (oldProps, newProps) => {
  return oldProps.state.fieldType === newProps.state.fieldType
})

const InputField = React.memo((
  { state, onChange, onFocus, onBlur, id, type = 'text', name = '', placeholder = '' }
) => {
  return <input
    type={type}
    id={id}
    name={name}
    value={state[name]}
    onChange={onChange ? (e) => onChange(e, id) : null}
    onFocus={onFocus ? (e) => {onFocus(e, id)} : null}
    onBlur={onBlur ? (e) => {onBlur(e, id)} : null}
    placeholder={placeholder}
  />
}, (oldProps, newProps) => {
  return oldProps.state.fieldName === newProps.state.fieldName
})

const FieldRow = ({ gfs, id }) => {
  return <div>
    <SelectOptions
      opts={protoFields}
      id={id}
      state={gfs.state.form[id]}
      onChange={gfs.update}
      name={'fieldType'}
    />
    <InputField
      placeholder={'Field Name'}
      id={id}
      state={gfs.state.form[id]}
      onChange={gfs.update}
      name={'fieldName'}
    />
    {gfs.state.form[id].index > 0 && <button onClick={() => {gfs.remove(id)}}>-</button>}
  </div>
}

const ProtoGen = ({ classes, onBuild }) => {
  const id = useRef(uid()).current
  const initialFormRow = {
    fieldType: 'string',
    fieldName: ''
  }
  
  const gfs = useGlobalFormState(id, initialFormRow)
  
  return <div className={classes.root}>
    <FieldRow
      gfs={gfs}
      id={id}
    />
    {Object.keys(gfs.state.form).map((formId) => {
      if (formId !== id) {
        return <FieldRow gfs={gfs} id={formId} key={formId}/>
      }
    })}
    <button onClick={() => gfs.add(uid(), initialFormRow)}>+</button>
    <button onClick={onBuild ? () => onBuild(protobuilder(gfs.state.form)) : null}>Create</button>
  </div>
}

const styles = {
  root: {}
}

export default withStyles(styles)(ProtoGen)
