import React from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import PaymentButton from '../PaymentButton/PaymentButton.js'
import { getIPFSImage} from '../../utils'
import { fileToUID, setActiveFile } from 'oip-state/src/actions/ActiveArtifactFiles/thunks';
import { playFile, pauseFile } from 'oip-state/src/actions/ActiveArtifactFiles/actions';

import './assets/styles/FilePlaylist.css'
import defaultImg from './assets/images/Dull.jpg';

class PlaylistItem extends React.Component {
	constructor(props) {
		super(props);

		this.uid = this.props.File ? fileToUID(this.props.File) : undefined;
		this.state = {
			active: false
		};

		this.setActiveFile = this.setActiveFile.bind(this);

	}

	setActiveFile() {
		let activeFiles = this.props.ActiveArtifactFiles;
		if (activeFiles.active === this.uid) {
			//@ToDo: instead of setting activeFile to undefined, pause/play it
			if (activeFiles[activeFiles.active]) {
				if (activeFiles[activeFiles.active].isPlaying) {
					this.props.pauseFile(this.uid)
				} else if (activeFiles[activeFiles.active].isPaused) {
					this.props.playFile(this.uid)
				}
			}
			// this.props.setActiveFile(undefined)
		} else {
			for (let uid in activeFiles) {
				if (uid === this.uid) {
					this.props.setActiveFile(activeFiles[uid].ArtifactFile)
				}
			}
		}
	}

	isActive() {
		return this.uid === this.props.ActiveArtifactFiles.active;
	}
	render() {
		let artifact, poster, artist, filename, file;
		if (this.props.File) {
			file = this.props.File;
			artifact = file.parent;
			poster = getIPFSImage(file);
			if (poster.error) {poster = defaultImg}
			artist = artifact.getDetail('artist') || 'unknown';
			filename = file.getDisplayName() || 'unknown'
		}
		return (
			<div
				className={`d-flex justify-content-between align-items-center file-playlist-item ${this.isActive() ? "isActive" : null}  ${this.props.className}`}
				onClick={this.setActiveFile}
				style={{...this.props.style}}
			>
				{/*img*/}
				<div className={"playlist-artifact-image"} >
					<div className="img-container d-flex justify-content-center" style={{height: '34px', width: '34px', overflow: 'hidden'}}>
						<img className="img-responsive" style={{maxHeight: "100%", maxWidth: "100%"}} src={poster} alt='' />
					</div>
				</div>
				{/*index/playing*/}
				<div className="" style={styles.marginLeft15}>
					<span style={{fontWeight: "100", color: "#999"}}> {this.props.index} </span>
				</div>
				{/*contentItems*/}
				<div className={"flex-fill"}  style={{...styles.fileInfo, ...styles.marginLeft15}}>
						<a style={styles.fileInfo}>{filename}</a>
						<span style={{fontWeight: "100", color: "#999"}}> - </span>
						<a style={{color: "#999"}}>{artist}</a>
				</div>
				{/*payment buttons*/}
				<div className="d-flex">
					<PaymentButton
						ArtifactFile={file}
						type="view"
						style={styles.paymentButton}
					/>
					<PaymentButton
						ArtifactFile={file}
						type="buy"
						style={styles.paymentButton}
					/>
				</div>
			</div>
		)
	}
}

const styles = {
	fileInfo: {
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		wordBreak: 'normal',
	},
	marginLeft15: {
		marginLeft: '15px'
	},
	paymentButton: {
		fontSize: "12px",
		padding: 5,
		paddingTop: "3px",
		paddingBottom: "3px"
	}
};

function mapStateToProps(state) {
	return {
		state: state,
		ActiveArtifactFiles: state.ActiveArtifactFiles
	}
}

const mapDispatchToProps = {
	setActiveFile,
	playFile,
	pauseFile
};

PlaylistItem.propTypes = {
	File: PropTypes.object,
	index: PropTypes.number,
	style: PropTypes.object,
	className: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistItem);