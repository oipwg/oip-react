import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import ColorThief from 'color-thief'
import { PlayButton, PauseButton } from 'react-player-controls'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import {getIPFSURL, getIPFSImage} from "../../utils";
import AudioWaveSurfer from './AudioWaveSurfer';
import PosterWrapper from '../ImageViewer/PosterWrapper'
import './assets/styles/AudioViewer.scss'

class AudioViewer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			colorOne: '#fff',
			colorTwo: '#000',
			colorThree: '#000'
		};
	}

	generateColorPalette(imageNode) {
		console.log("THIS: ", this.state)
		console.log("IMAGE NODE: ", imageNode);
		let colorThief = new ColorThief();
		let palette = colorThief.getPalette(imageNode, 2);
		console.log("Palette: ", palette);
		// this.setState({colorOne: palette[0]})
		// this.setState({colorTwo: palette[1]})
		// this.setState({colorThree: palette[2]})
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

		//@ToDO: add redux variables for play state
		let isPlaying = false;
		const playbackButton = isPlaying ? (
			<PauseButton
				isEnabled={true}
				onClick={() => {console.log("Pause")}}
			/>) : (
			<PlayButton
				isEnabled={true}
				onClick={() => {console.log("Play")}}
			/>);

		return (
			<div className="AudioViewer-container container-fluid" style={{height: "100%", width: "100%"}}>
				<div className="d-flex no-gutters">
					<div className="">
						{playbackButton}
					</div>
					<div className="">
							<div>{artist}</div>
							<div>{title}</div>
					</div>
					<div className="ml-auto">
						<div style={{height: '300px', width: '300px'}}>
							<PosterWrapper ArtifactFile={file} onImageLoad={this.generateColorPalette}/>
						</div>
					</div>
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