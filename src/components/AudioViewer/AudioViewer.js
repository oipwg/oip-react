import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import { PlayButton, PauseButton } from 'react-player-controls'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import {getIPFSURL} from "../../utils";
import AudioWaveSurfer from './AudioWaveSurfer';
import './assets/styles/AudioViewer.scss'

class AudioViewer extends Component {
	constructor(props) {
		super(props);

		this.state = {};

	}
	render() {
		let file = this.props.ArtifactFile || this.props.ReduxArtifactFile;
		let url, artist, title;
		if (file) {
			url = getIPFSURL(file);
			artist = file.parent.getDetail('artist');
			title = file.getFilename();
		} else {
			artist = "unknown";
			title = "unknown";
		}
		return (
			<div className="AudioViewer-container container-fluid">
				<div className="d-flex">
					<div>
						<div>
							<PlayButton
								isEnabled={true}
								onClick={ () => {console.log("Oh hello")}}
							/>
						</div>

						<div>
							<div>{artist}</div>
							<div>{title}</div>
						</div>
					</div>
					<div>canvas/album art</div>
				</div>
				<div>
					<AudioWaveSurfer ArtifactFile={file}/>
				</div>

			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		ReduxArtifactFile: state.ActiveArtifactFiles[state.ActiveArtifactFiles.active]
	}
}

const mapDispatchToProps = {

}

AudioViewer.propTypes = {
	ArtifactFile: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioViewer);

const styles = {
	circle: {
		height: '100px',
		width: '100px',
		backgroundColor: '#bbb',
		borderRadius: '50%',
		// display: 'inline-block'
	}
};