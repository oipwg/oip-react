import React from 'react'
import classNames from 'classnames'

// Select Option for DescriptorSetProto
const SelectOptions = ({
  classes,
  state,
  opts,
  onChange,
  onFocus,
  onBlur,
  id,
  name = ''
}) => {
  if (!Array.isArray(opts)) {
    opts = Object.keys(opts)
  }

  return <select
    onChange={onChange ? (e) => onChange(e, id) : null}
    onFocus={onFocus ? (e) => {
      onFocus(e, id)
    } : null}
    onBlur={onBlur ? (e) => {
      onBlur(e, id)
    } : null}
    name={name}
    value={state[name]}
    className={classNames(classes.selectBase, classes.descriptorSelect)}
  >
    {opts.map((opt, i) => {
      return <option
        key={i}
        value={opt}
      >
        {opt}
      </option>
    })}
  </select>
}

export default React.memo(SelectOptions, (oldProps, newProps) => {
  return newProps.shouldUpdate ? newProps.shouldUpdate(oldProps, newProps) : false
})
