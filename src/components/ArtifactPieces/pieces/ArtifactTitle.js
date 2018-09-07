import React, {Component} from 'react';
import { connect } from 'react-redux';

import ArtifactPieceBase from '../ArtifactPieceBase.js'

/**
 * Hello Yourself!
 */
export default class ArtifactTitle extends Component {
	render(){
		return <ArtifactPieceBase artifactFunction={"getTitle"} {...this.props} />
	}
}