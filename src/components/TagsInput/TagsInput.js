import React, { useState, useReducer } from 'react'
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

const TagsInput = ({ classes }) => {
  const initialState = { tags: [] }
  
  function removeTag({tags, tag}) {
    if (!tag) {
      let newArray = [...tags]
      newArray.pop()
      console.log('newArray', newArray)
      return newArray
    } else {
      let newArray = []
      for (let item of tags) {
        if (item !== tag) {
          newArray.push(item)
        }
      }
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
          tags: removeTag({tags: state.tags, tag: action.tag})
        }
      default:
        throw new Error()
    }
  }
  
  const [state, dispatch] = useReducer(reducer, initialState)
  const [inputValue, updateValue] = useState('')
  
  function handleChange(e) {
    let value = e.target.value
    if (value[value.length-1] !== ',') {
      updateValue(e.target.value)
    }

  }
  function handleKeyUp (e) {
    if (/(188|13)/.test(e.which)) { // test for comma or enter
      // add tag
      if (inputValue !== '') {
        dispatch({ type: 'ADD', tag: inputValue })
      }
      // clear field
      updateValue('')
    } else if (/(8)/.test(e.which)) {
      if (inputValue === '' && state.tags.length > 0) {
        dispatch({type: 'REMOVE'})
      }
    }
  }

  const placeHolderText = state.tags.length === 0 && inputValue === '' ? 'e.g. (tag1 tag2 tag3)' : null
  return <_div
    className={classes.root}
    w={'300px'}
    h={'30px'}
    padding={'4px'}
    border={'1px solid grey'}
    br={'3px'}
  >
    <div id={'tags'}>
      {state.tags.map((tag, i) => {
        return <span key={i}>
          <span>{tag}</span>
          <span>(x)</span>
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
  </_div>
}

const styles = {
  root: {
    display: 'inline-flex',
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
  input: {
    border: 'none',
    outline: 'none',
    padding: '4px',
  }
}

export default withStyles(styles)(TagsInput)
