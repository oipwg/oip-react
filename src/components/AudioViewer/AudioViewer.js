import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import ColorThief from '@mariotacke/color-thief'
import { PlayButton, PauseButton, NextButton, PrevButton } from 'react-player-controls'

import { playFile, pauseFile } from 'oip-state/src/actions/ActiveArtifactFiles/actions'
import { fileToUID, setActiveFile } from 'oip-state/src/actions/ActiveArtifactFiles/thunks'

import AudioWaveSurfer from './AudioWaveSurfer';
import PosterWrapper from '../ImageViewer/PosterWrapper'
import './assets/styles/AudioViewer.scss'

class AudioViewer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			colorOne: '#fff',
			colorTwo: '#000',
			colorThree: '#000',
			paletteGenerated: false
		};

	}

	static getDerivedStateFromProps(nextProps, prevState) {
		console.log("Audio Viewer::getDerivedStateFromProps")
		let paletteGenerated = prevState.paletteGenerated
		if (nextProps.ArtifactFile !== prevState.ArtifactFile ||
			((nextProps.ReduxArtifactFile && prevState.ReduxArtifactFile) && nextProps.ReduxArtifactFile.ArtifactFile !== prevState.ReduxArtifactFile.ArtifactFile)) {
			console.log("ArtifactFile has switched in AudioViewer")
			//we set this variable to stop an infinite loop in the generateColorPalette function in which the image node gets passed repeatedly
			paletteGenerated = false
		}
		return {
			paletteGenerated,
			ArtifactFile: nextProps.ArtifactFile,
			ReduxArtifactFile: nextProps.ReduxArtifactFile
		}
	}

	generateColorPalette = (imageNode) => {
		//if a palette has not been generated already, generate one
		if (!this.state.paletteGenerated) {
			console.log("Color Thieving")
			let colorThief = new ColorThief();
			let palette = colorThief.getPalette(imageNode, 2);
			this.setState({colorOne: palette[0]})
			this.setState({colorTwo: palette[1]})
			this.setState({colorThree: palette[2]})
			this.setState({paletteGenerated: true})
		}
	};

	setActiveFile = (file) => {
		this.props.setActiveFile(file)
	}

	render() {
		let file;
		if (this.props.ArtifactFile) {
			file = this.props.ArtifactFile
		} else if (this.props.ReduxArtifactFile) {
			file = this.props.ReduxArtifactFile.ArtifactFile
		} else {
			file = undefined;
		}
		let artist, title;
		if (file) {
			artist = file.parent.getDetail('artist') || 'unknown';
			title = file.getFilename() || 'unknown';
		} else {
			artist = undefined;
			title = undefined;
		}

		if (this.props.ArtifactFile && fileToUID(this.props.ArtifactFile) !== this.props.ActiveFileUID) {
			this.setActiveFile(this.props.ArtifactFile)
		}

		let isPlaying = this.props.ReduxArtifactFile ? this.props.ReduxArtifactFile.isPlaying : false;
		
		let playbackButton

		if (isPlaying) 
			playbackButton = <PauseButton isEnabled={true} onClick={() => this.props.pauseFile(fileToUID(file))} />
		else
			playbackButton = <PlayButton isEnabled={true} onClick={() => this.props.playFile(fileToUID(file))} />

		return (
			<div className="container-fluid h-100" style={{backgroundImage: file ? (`linear-gradient(-90deg, rgb(${this.state.colorOne.toString()}), rgb(${this.state.colorTwo.toString()}))`) :
					`linear-gradient(-90deg, #29323c, #485563)`   }}>
				<div className={"row no-gutters h-100 py-4"}>
					<div className={"col-7"}>
						<div className={"d-flex p-3"}>
							<div className={"d-block ml-2"}>
								<span className={""} style={{backgroundColor: 'rgb(0,0,0,.7)', padding: '4px', color: '#f2f2f2'}}>{file ? artist : "No file loaded"}</span>
								{file ? <span className={"d-block"} style={{backgroundColor: 'rgb(0,0,0,.7)', padding: '8px 7px 7px', fontSize: '20px', color: 'white', lineHeight: '20px'}}>{title}</span> : null}
							</div>
						</div>
					</div>
					<div className={"col-5 pr-3 d-flex justify-content-center"}>
						<div  style={{height: '200px', width: '200px'}}>
							<PosterWrapper ArtifactFile={file} onImageLoad={this.generateColorPalette}/>
						</div>
					</div>
					<div className={"col-12"} style={{bottom: '0px'}}>
						<AudioWaveSurfer ArtifactFile={file}/>
					</div>
					<div className={"col-12 d-flex justify-content-center"}>
						<div className={"audio-controls d-flex align-items-center"}>
							<div className={"mx-1"}><PrevButton isEnabled={true}/></div>
							<div className={"mx-1"}>{playbackButton}</div>
							<div className={"mx-1"}><NextButton isEnabled={true}/></div>
						</div>
					</div>
				</div>
			</div>

		);
	}
}

function mapStateToProps(state) {
	return {
		ActiveFileUID: state.ActiveArtifactFiles.active,
		ReduxArtifactFile: state.ActiveArtifactFiles[state.ActiveArtifactFiles.active]
	}
}

const mapDispatchToProps = {
	playFile,
	pauseFile,
	setActiveFile
}

AudioViewer.propTypes = {
	ArtifactFile: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioViewer);