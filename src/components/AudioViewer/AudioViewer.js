import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import ColorThief from '@mariotacke/color-thief'
import { PlayButton, PauseButton, NextButton, PrevButton, FormattedTime, VolumeSlider, ControlDirection, MuteToggleButton } from 'react-player-controls'

import { payForArtifactFile, pauseFile, fileToUID, setActiveFile, skipForward, skipBack, setVolume } from 'oip-state'

import { getIPFSImage } from "../../utils";

import AudioWaveSurfer from './AudioWaveSurfer';
import PosterWrapper from '../ImageViewer/PosterWrapper'
import './assets/styles/PlaybackControls.scss'

class AudioViewer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			colorOne: '#fff',
			colorTwo: '#000',
			colorThree: '#000',
			paletteGenerated: false,
			windowHeight: '0',
			windowWidth: '0'
		};

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handleVolumeChange = this.handleVolumeChange.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let paletteGenerated = prevState.paletteGenerated
		if (nextProps.ArtifactFile !== prevState.ArtifactFile ||
			((nextProps.ReduxArtifactFile && prevState.ReduxArtifactFile) && nextProps.ReduxArtifactFile.ArtifactFile !== prevState.ReduxArtifactFile.ArtifactFile)) {
			//we set this variable to stop an infinite loop in the generateColorPalette function in which the image node gets passed repeatedly
			paletteGenerated = false
		}
		return {
			paletteGenerated,
			ArtifactFile: nextProps.ArtifactFile,
			ReduxArtifactFile: nextProps.ReduxArtifactFile
		}
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight })
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

	getIPFSImage = (file) => {
		return getIPFSImage(file)
	};

	setActiveFile = (file) => {
		this.props.setActiveFile(file)
	};

	handleVolumeChange(volume) {
		this.props.setVolume(this.props.ActiveFileUID, volume)
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

		let isPlaying = this.props.isPlaying;
		
		let playbackButton;
		if (isPlaying) 
			playbackButton = <PauseButton isEnabled={true} onClick={() => this.props.pauseFile(fileToUID(file))} />
		else
			playbackButton = <PlayButton isEnabled={true} onClick={() => this.props.payForArtifactFile(file, 'view')} />

		let xxs = this.state.windowWidth < '576';

		const styles = {
			colorThief: {backgroundImage: file ? (`linear-gradient(-90deg, rgb(${this.state.colorOne.toString()}), rgb(${this.state.colorTwo.toString()}))`) :
					`linear-gradient(-90deg, #29323c, #485563)`   },
			posterBackground: {backgroundImage: file ? `url(${this.getIPFSImage(file)})` : `linear-gradient(-90deg, #29323c, #485563)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}
		};

		return (
			<div className="container-fluid h-100 audio-viewer p-3" style={xxs ? styles.posterBackground : styles.colorThief}>
				<div className={"row no-gutters"} style={{height: "inherit"}}>
					<div className={"col-12 col-sm-6 col-lg-7 track-info pl-3 pt-3"} style={{height: "inherit"}}>
						<span className={"track-artist"} style={{backgroundColor: 'rgb(0,0,0,.7)', padding: '4px', color: '#f2f2f2'}}>{file ? artist : "No file loaded"}</span>
						{file ? <span className={" track-title d-table"} style={{backgroundColor: 'rgb(0,0,0,.7)', padding: '8px 7px 7px', fontSize: '20px', color: 'white', lineHeight: '20px'}}>{title}</span> : null}
					</div>

					{ file ? (<div className={"d-none d-sm-flex col-sm-6 col-lg-5 album-art justify-content-md-center justify-content-md-end"} style={{height: "inherit"}}>
						<div className="poster-container d-flex align-items-center" style={{height: 'inherit', width: 'auto'}}>
							<PosterWrapper ArtifactFile={file} onImageLoad={this.generateColorPalette}/>
						</div>
					</div>) : null }

					{file ? (<div className={"col-12 col-sm-6 col-lg-7 audio-player"} style={{position: "relative", top: "-150px", height: "inherit"}}>
						<div className={"wavesurfer-container"}>
							<AudioWaveSurfer ArtifactFile={file}/>
							<div className={"time duration d-flex position-absolute justify-content-between w-100"}>
								<FormattedTime style={{fontSize: '12px', backgroundColor: 'rgb(0,0,0,.7)', padding: '0px 2px', color: '#fff'}} numSeconds={this.props.currentTime}/>
								<FormattedTime style={{fontSize: '12px', backgroundColor: 'rgb(0,0,0,.7)', padding: '0px 2px', color: '#fff'}} numSeconds={this.props.duration}/>
							</div>
						</div>
						<div className={"playback-controls d-flex justify-content-center align-items-center position-relative"}>
							<div className={"mx-1"}><PrevButton isEnabled={true} onClick={() => {this.props.skipBack()}}/></div>
							<div className={"mx-1"}>{playbackButton}</div>
							<div className={"mx-1"}><NextButton isEnabled={true} onClick={() => {this.props.skipForward()}}/></div>
						</div>
						<div className={"volume-slider d-flex justify-content-center mt-2"} >
							{/*<MuteToggleButton*/}
								{/*onHover*/}
								{/*isEnabled={true}*/}
								{/*isMuted={true}*/}
								{/*onMuteChange={() => {console.log("On Mute change")}}*/}
							{/*/>*/}
							<VolumeSlider
								volume={this.props.volume}
								onVolumeChange={this.handleVolumeChange}
								direction={ControlDirection.HORIZONTAL}
								isEnabled={true}
							/>
						</div>
					</div>) : null }
				</div>
			</div>
		);
	}
}

AudioViewer.SUPPORTED_FILE_TYPES = ["mp3", "ogg", "aac", "wav"];

function mapStateToProps(state) {
	let currentTime = undefined, duration = undefined, isPlaying = false, volume = 1;

	if (state.ActiveArtifactFiles[state.ActiveArtifactFiles.active]){
		currentTime = state.ActiveArtifactFiles[state.ActiveArtifactFiles.active].currentTime;
		duration = state.ActiveArtifactFiles[state.ActiveArtifactFiles.active].duration;
		isPlaying = state.ActiveArtifactFiles[state.ActiveArtifactFiles.active].isPlaying;
		volume = state.ActiveArtifactFiles[state.ActiveArtifactFiles.active].volume;
	}
	return {
		state: state,
		ActiveFileUID: state.ActiveArtifactFiles.active,
		ReduxArtifactFile: state.ActiveArtifactFiles[state.ActiveArtifactFiles.active],
		currentTime,
		duration,
		isPlaying,
		volume

	}
}

const mapDispatchToProps = {
	payForArtifactFile,
	pauseFile,
	setActiveFile,
	skipForward,
	skipBack,
	setVolume
}

AudioViewer.propTypes = {
	ArtifactFile: PropTypes.object
};



export default connect(mapStateToProps, mapDispatchToProps)(AudioViewer);