import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import ColorThief from '@mariotacke/color-thief'
import { PlayButton, PauseButton } from 'react-player-controls'

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
			<div className="audio-viewer-container" style={{position: 'relative', height: '380px', overflow: 'hidden'}}>
				<div style={{height: '100%'}}>
					<div className={"background-gradient"} style={{height: "100%", position: 'relative', zIndex: '0',
						backgroundImage: file ? (`linear-gradient(-90deg, rgb(${this.state.colorOne.toString()}), rgb(${this.state.colorTwo.toString()}))`) :
							`linear-gradient(-90deg, #29323c, #485563)`
					}}/>
				</div>
				<div className={"border-box"} style={{position: 'absolute', top: '0', left: '0', right: '0', width: '100%', height: '100%', boxSizing: 'border-box', zIndex: '10',
					padding: '30px 400px 20px 30px'
				}}>
					{file ? (<div className={"album-art"} style={{position: 'absolute', top: '20px', right: '20px', zIndex: '1', width: '340px', height: '340px'}}>
						<PosterWrapper ArtifactFile={file} onImageLoad={this.generateColorPalette}/>
					</div>) : null}
					<div className={"album-title"}>
						<div className={"hyphenate"} style={{overflowWrap: "break-word", wordWrap: 'break-word'}}>
							<div className={"title-container d-flex"}>
								<div className={"playback-button"} style={{height: '60px', width: '60px', marginRight: '10px'}}>
									{playbackButton}
								</div>
								<div className={"track-info"} style={{flex: '1', minWidth: '0px'}}>
									<div className={"artist-info mr-0"} style={{marginBottom: '7px'}}>
										<span style={{backgroundColor: 'rgb(0,0,0,.7)', padding: '4px', color: '#f2f2f2'}}>{file ? artist: "No file loaded"}</span>
									</div>
									{file ? <span style={{backgroundColor: 'rgb(0,0,0,.7)', padding: '8px 7px 7px', fontSize: '22px', color: 'white', lineHeight: '36px'}}>{title}</span> : null}
								</div>
								{file ? (<div className={"soundbar"}
								     style={{position: 'absolute', bottom: '0', 'left': '30px', right: '390px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
									<div className={"waveform_"} style={{marginBottom: '30px', height: '100px', zIndex: '1'}}>
										<div className={"waveform_wrapper"} style={{position: 'relative', 'width': '100%', height: '100%'}}>
											<div className={"waveform_wrapper_loaded"} style={{position: 'absolute', left: '0', top: '0', right: '0', bottom: '0'}}>
												<AudioWaveSurfer ArtifactFile={file}/>
											</div>
										</div>
									</div>
								</div>) : null}
							</div>
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