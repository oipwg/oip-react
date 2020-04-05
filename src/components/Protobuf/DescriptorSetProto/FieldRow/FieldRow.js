import React from 'react'
import classNames from 'classnames'
import TagsInput from '../../../UI/TagsInput'
import SelectOptions from '../SelectOptions'
import shouldUpdate from '../helpers/shouldUpdate'
import InputField from '../InputField'
import { protoFields } from '../constants'

//  two selects; singular/repeated and types
const FieldRow = ({ gfs, id, liftDescriptor, classes, validate }) => {
  const isEnum = gfs.state.form[id].fieldType === 'enum'
  return <div className={classes.descriptorFieldRowContainer}>
    <div className={classes.selectOptions}>
      <SelectOptions
        opts={['singular', 'repeated']}
        id={id}
        state={gfs.state.form[id]}
        onChange={gfs.update}
        name='fieldRule'
        shouldUpdate={shouldUpdate}
        onBlur={liftDescriptor}
        classes={classes}
      />
      <SelectOptions
        opts={protoFields}
        id={id}
        state={gfs.state.form[id]}
        onChange={gfs.update}
        name='fieldType'
        shouldUpdate={shouldUpdate}
        onBlur={liftDescriptor}
        classes={classes}
      />
    </div>
    <InputField
      placeholder='Field Name'
      id={id}
      state={gfs.state.form[id]}
      onChange={gfs.update}
      name='fieldName'
      shouldUpdate={shouldUpdate}
      allowSpaces={false}
      onBlur={liftDescriptor}
      classes={classes}
      validate={validate}
    />
    {isEnum ? <TagsInput
      placeholder='(i.e. type enum fields here)'
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
    >-
    </button>}
  </div>
}

export default FieldRow
