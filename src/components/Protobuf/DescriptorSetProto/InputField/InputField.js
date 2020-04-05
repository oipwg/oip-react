import React from 'react'
import classNames from 'classnames'

// Creates input field for creating a DescriptorSetProto - Template
const InputField = ({
  classes,
  state,
  onChange,
  onFocus,
  onBlur,
  id,
  type = 'text',
  name = '',
  placeholder = '',
  allowSpaces = true,
  validate
}) => {
  let onKeyDown = () => {}

  if (!allowSpaces) {
    const onChangeCopy = onChange
    onKeyDown = (e) => {
      onChange = e.which === 32 ? () => {
      } : onChangeCopy
    }
  }

  return <input
    required
    type={type}
    id={id}
    name={name}
    value={state[name]}
    validate={validate(state[name])}
    onKeyDown={onKeyDown}
    onChange={onChange ? (e) => onChange(e, id) : null}
    onFocus={onFocus ? (e) => {
      onFocus(e, id)
    } : null}
    onBlur={onBlur ? (e) => {
      onBlur(e, id)
    } : null}
    placeholder={placeholder}
    className={classNames(classes.inputBase, classes.descriptorInputField)}
  />
}

export default React.memo(InputField, (oldProps, newProps) => {
  return newProps.shouldUpdate ? newProps.shouldUpdate(oldProps, newProps) : false
})
