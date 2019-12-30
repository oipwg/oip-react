import React, { useRef, useState } from 'react'
import withStyles from 'react-jss'
import uid from 'uid'

// gfs = GLOBAl FORM STATE    
import { useGlobalFormState } from '../../../hooks'

import TagsInput from '../../UI/TagsInput'
import classNames from 'classnames'
import { buildDescriptor } from 'oip-protobufjs'

const protoFields = {
  'string': 'text',
  'bool': 'text',
  'bytes': 'text',
  'double': 'number',
  'float': 'number',
  'enum': 'misc',
  'OipRef': 'text',
  'int32': 'number',
  'int64': 'number',
  'uint32': 'number',
  'uint64': 'number',
  'sint32': 'number',
  'sint64': 'number',
  'fixed32': 'number',
  'fixed64': 'number',
  'sfixed32': 'number',
  'sfixed64': 'number'
}

const SelectOptions = React.memo((
  { classes, state, opts, onChange, onFocus, onBlur, id, name = '' }
) => {
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
}, (oldProps, newProps) => {
  return newProps.shouldUpdate ? newProps.shouldUpdate(oldProps, newProps) : false
})

// --------------

// FIELD NAME
const InputField = React.memo((
  { classes, state, onChange, onFocus, onBlur, id, type = 'text', name = '', placeholder = '', allowSpaces = true, validate }
) => {
  let okd = () => {
  }
  if (!allowSpaces) {
    const onChangeCopy = onChange
    okd = (e) => {
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
    onKeyDown={okd}
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
}, (oldProps, newProps) => {
  return newProps.shouldUpdate ? newProps.shouldUpdate(oldProps, newProps) : false
})

const shouldUpdate = (oldProps, newProps) => {
  const nameDidNotChange = oldProps.state[oldProps.name] === newProps.state[newProps.name]
  const classesDidNotChange = oldProps.classes === newProps.classes
  return nameDidNotChange && classesDidNotChange
}
// --------------

//  two selects; sigular/repeated and types
const FieldRow = ({ gfs, id, liftDescriptor, classes, validate }) => {

  const isEnum = gfs.state.form[id].fieldType === 'enum'
  return <div className={classes.descriptorFieldRowContainer}>
    <div className={classes.selectOptions}>
      <SelectOptions
        opts={['singular', 'repeated']}
        id={id}
        state={gfs.state.form[id]}
        onChange={gfs.update}
        name={'fieldRule'}
        shouldUpdate={shouldUpdate}
        onBlur={liftDescriptor}
        classes={classes}
      />
      <SelectOptions
        opts={protoFields}
        id={id}
        state={gfs.state.form[id]}
        onChange={gfs.update}
        name={'fieldType'}
        shouldUpdate={shouldUpdate}
        onBlur={liftDescriptor}
        classes={classes}
      />
    </div>
    <InputField
      placeholder={'Field Name'}
      id={id}
      state={gfs.state.form[id]}
      onChange={gfs.update}
      name={'fieldName'}
      shouldUpdate={shouldUpdate}
      allowSpaces={false}
      onBlur={liftDescriptor}
      classes={classes}
      validate={validate}
    />
    {isEnum ? <TagsInput
      placeholder={'(i.e. type enum fields here)'}
      onBlur={liftDescriptor}
      classes={classes}
      getTags={(tags) => {
        const e = {
          target: {
            name: 'enumValue',
            value: tags
          }
        }
        gfs.update(e, id)
      }}
    /> : null}
    {gfs.state.form[id].index > 0 && <button
      onClick={() => {
        gfs.remove(id),
          validate()
      }}
      className={classNames(classes.buttonBase, classes.removeRowButton)}
    >-</button>}
  </div>
}

const DescriptorSetProto = ({ classes, getDescriptor }) => {

  const [passErrorMessage, setPassErrorMessage] = useState('');

  const id = useRef(uid()).current
  const initialFormRow = {
    fieldType: 'string',
    fieldName: '',
    fieldRule: 'singular'
  }

  const gfs = useGlobalFormState(id, initialFormRow)
  let fieldnameArr = serializeFormData(gfs.state.form).map(x => x.name).filter(el => el !== '');
  let filtered = fieldnameArr.filter((v, i, a) => a.indexOf(v) === i).filter(el => el !== '');

  const liftDescriptor = () => {
    if (getDescriptor) {
      let descriptor
      try {
        descriptor = buildDescriptor(serializeFormData(gfs.state.form))

      } catch (err) {
        // throw Error(err)
      }
      getDescriptor(descriptor)
    }
  }

  function errorMessage(message) {
    setPassErrorMessage(message);
  }

  const arraysMatch = function (arr1, arr2) {
    if (arr1.length !== arr2.length) { return errorMessage('Enter unique field names') };

    return errorMessage(null);
  };

  function validate() {
    arraysMatch(fieldnameArr, filtered);
  }



  // RYANS OLD CODE ??
  //   <FieldRow
  //   gfs={gfs}
  //   id={id}
  //   liftDescriptor={liftDescriptor}
  //   classes={classes}
  //   validate={validate}
  // />
  // {/* for every from created */}
  // {Object.keys(gfs.state.form).map((formId) => {
  //   if (formId !== id) {
  //     return <FieldRow
  //       classes={classes}
  //       gfs={gfs}
  //       id={formId}
  //       key={formId}
  //       liftDescriptor={liftDescriptor}
  //       fieldnameArr={fieldnameArr}
  //       validate={validate}
  //     />
  //   }
  // })}

  return <div className={classes.descriptorRoot}>
    {Object.keys(gfs.state.form).map((formId) => {
      return <FieldRow
        classes={classes}
        gfs={gfs}
        id={formId}
        key={formId}
        liftDescriptor={liftDescriptor}
        fieldnameArr={fieldnameArr}
        validate={validate}
      />
    })
    }
    {/* add another row */}
    <div>{passErrorMessage}</div>
    <button
      className={classNames(classes.buttonBase, classes.addRowButton)}
      onClick={() => gfs.add(uid(), initialFormRow)}>+
    </button>
  </div>
}

const styles = theme => ({
  descriptorRoot: {},
  descriptorFieldRowContainer: {},
  descriptorInputField: {},
  descriptorSelect: {},
  inputBase: {
    height: 25,
    boxSizing: 'border-box',
    margin: [10, 0, 13, 0],
    width: 250,
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: '3px',
    padding: [3, 2],
    fontSize: 12,
    '&::placeholder': {
      fontSize: 10,
    }
  },
  buttonBase: {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    color: theme.palette.greyscale(0.3),
    fontWeight: 'bold'
  },
  selectBase: {
    backgroundColor: 'transparent',
    boxSizing: 'border-box',
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: '3px',
    padding: [3, 2],
    width: '48%'
  },
  addRowButton: {
    border: 0,
    margin: [0, 0, 5, 0],
    '&:hover': {
      cursor: 'pointer',
    }
  },
  removeRowButton: {
    marginLeft: 7,
    border: 0,
    '&:hover': {
      cursor: 'pointer',
    }
  },
  selectOptions: {
    width: 250,
    display: 'flex',
    justifyContent: 'space-between'
  },
  // tags input
  tagsInputRoot: {
    width: 250,
    marginBottom: 13,
    boxSizing: 'border-box'
  }
})

function serializeFormData(form) {
  let sorted = []
  for (let uid in form) {
    if (form.hasOwnProperty(uid)) {
      sorted.push([uid, form[uid].index])
    }
  }
  sorted.sort((a, b) => {
    return a[1] - b[1]
  })

  let serialized = []

  for (let formData of sorted) {
    let data = form[formData[0]]
    let tmpObject = {
      type: data.fieldType,
      name: data.fieldName,
      rule: data.fieldRule === 'repeated' ? 'repeated' : undefined,
      values: data.enumValue
    }
    serialized.push(tmpObject)
  }

  return serialized
}

export default withStyles(styles)(DescriptorSetProto)
