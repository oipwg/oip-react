import React, {Component} from 'react';
import { connect } from 'react-redux';

import ArtifactPieceBase from '../ArtifactPieceBase.js'

export default class ArtifactArtist extends Component {
	render(){
		return <ArtifactPieceBase artifactFunction={"getDetail"} artifactFnVariable={"artist"} {...this.props} />
	}
}

