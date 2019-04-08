import React, { useState, useReducer, useEffect } from 'react'
import styled from 'styled-jss'
import withStyles from 'react-jss'

const _div = styled('div')({
  width: (props) => props.w,
  height: (props) => props.h,
  backgroundColor: (props) => props.bgColor,
  color: (props) => props.color,
  border: (props) => props.border,
  padding: (props) => props.padding,
  borderRadius: (props) => props.br
})

const TagsInput = ({ classes, getTags, placeholder, allowSpaces = false }) => {
  const initialState = { tags: [] }
  
  function removeTag ({ tags, index }) {
    if (!index && index !== 0) {
      let newArray = [...tags]
      newArray.pop()
      return newArray
    } else {
      let newArray = [...tags]
      newArray.splice(index, 1)
      return newArray
    }
  }
  
  function reducer (state, action) {
    switch (action.type) {
      case 'ADD':
        return {
          tags: [...state.tags, action.tag]
        }
      case 'REMOVE':
        return {
          tags: [...removeTag({ tags: state.tags, index: action.index })]
        }
      default:
        throw new Error()
    }
  }
  
  const [state, dispatch] = useReducer(reducer, initialState)
  const [inputValue, updateValue] = useState('')
  useEffect(() => {
    if (getTags) {
      getTags(state.tags)
    }
  }, [state.tags])
  
  function handleChange (e) {
    let value = e.target.value
    if (!allowSpaces) {
      if (value[value.length - 1] === ' ') {
        return false
      }
    }
    if (value[value.length - 1] !== ',') {
      updateValue(e.target.value)
    }
  }
  
  function handleKeyUp (e) {
    if (/(188|13)/.test(e.which)) { // test for comma or enter
      // add tag
      if (inputValue !== '') {
        if (state.tags.includes(inputValue)) {
          alert('Tag already exists')
        } else {
          dispatch({ type: 'ADD', tag: inputValue })
        }
      }
      // clear field
      updateValue('')
    } else if (/(8)/.test(e.which)) {
      if (inputValue === '' && state.tags.length > 0) {
        dispatch({ type: 'REMOVE' })
      }
    }
  }
  
  const handleRemoveTag = (index) => {
    dispatch({ type: 'REMOVE', index })
  }
  
  const placeHolderText = state.tags.length === 0 && inputValue === '' ? placeholder ?
    placeholder : 'e.g. (tag swag mag)' : null
  
  return <div
    className={classes.root}
  >
    <div id={'tags'}>
      {state.tags.map((tag, i) => {
        return <span className={classes.tagContainer} key={i}>
          <span className={classes.tagName}>{tag}</span>
          <span onClick={() => handleRemoveTag(i)} className={classes.tagRemove}>x</span>
        </span>
      })}
    </div>
    <div id={'input'}>
      <input
        className={classes.input}
        type={'text'}
        onKeyUp={handleKeyUp}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeHolderText}
      />
    </div>
  </div>
}

const styles = {
  root: {
    display: 'inline-flex',
    width: '300px',
    height: 30,
    padding: 4,
    border: '1px solid grey',
    borderRadius: '3px',
    '& #tags': {
      display: 'flex',
      '& > span': {
        padding: 4
      }
    },
    font: `400 13.3333px Arial`,
    '&:focus-within': {
      borderColor: '#66bfff',
      boxShadow: `0 0 0 4px rgba(0, 149, 255, 0.15)`,
      outline: 0,
      position: 'relative'
    },
    alignItems: 'center',
    justifyContent: 'flex-start',
    cursor: 'text',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  tagContainer: {
    backgroundColor: 'rgba(0, 149, 255, 0.15)',
    borderRadius: 3,
    margin: [0, 3]
  },
  tagName: {},
  tagRemove: {
    paddingLeft: 3,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  input: {
    border: 'none',
    outline: 'none',
    padding: '4px',
  }
}

export default withStyles(styles)(TagsInput)
