import React, {Component} from 'react';
import { connect } from 'react-redux';

import ArtifactPieceBase from '../ArtifactPieceBase.js'

export default class ArtifactDescription extends Component {
	render(){
		return <ArtifactPieceBase artifactFunction={"getDescription"} {...this.props} />
	}
}
