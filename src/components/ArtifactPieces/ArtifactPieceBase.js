import React, {Component} from 'react';
import { connect } from 'react-redux';

/**
 * Hello
 */
class ArtifactPieceBase extends Component {
	render() {
		let artifact = this.props.Artifact;

		if (!artifact && this.props.ActiveArtifact){
			artifact = this.props.ActiveArtifact
		}

		let item

		if (artifact && this.props.artifactFunction) {
			item = artifact[this.props.artifactFunction](this.props.artifactFnVariable)
		} else {
			if (!this.props.artifactFunction)
				item = "You must pass in an artifactFunction as a prop! (i.e. 'getTitle')"
			else if (this.props.artifactIsLoading && this.props.artifactFunction === "getTitle")
				item = "Loading..."
			else
				item = ""
		}

		return (
			<span style={this.props.style || {textAlign: "center"}}>{item}</span>
		)
	}
}

function mapStateToProps(state){
	return {
		ActiveArtifact: state.ActiveArtifact.Artifact,
		artifactIsLoading: state.ActiveArtifact.isLoading
	}
}

export default connect(mapStateToProps)(ArtifactPieceBase);