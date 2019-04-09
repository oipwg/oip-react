import React, {useState} from 'react'
import withStyles from 'react-jss'

import styles from './styles'
import { DescriptorSetProto } from '../index'
import {templatebuilder} from './dependencies'

const RecordTemplate = ({ classes }) => {
  
  const [name, setName] = useState('test')
  const [description, setDescription] = useState('test')
  
  const handleBuild = (descriptor) => {
    templatebuilder(name, description, descriptor)
  }
  
  return <div className={classes.root}>
    <div>
      <span>Friendly Name</span>
      <input
        type={'text'}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div>
      <span>Description</span>
      <input
        type={'text'}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
    <DescriptorSetProto
      onBuild={(descriptor) => handleBuild(descriptor)}
    />
  </div>
}

export default withStyles(styles)(RecordTemplate)
