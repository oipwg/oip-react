import React from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import PaymentButton from '../PaymentButton'
import { getIPFSImage} from '../../utils'
import { fileToUID, setActiveFile } from 'oip-state/src/actions/ActiveArtifactFiles/thunks';
import './assets/FilePlaylist.css'

class PlaylistItem extends React.Component {
	constructor(props) {
		super(props);

		this.uid = fileToUID(this.props.File);
		this.state = {
			active: false
		};

		this.setActiveFile = this.setActiveFile.bind(this);

	}

	setActiveFile() {
		let activeFiles = this.props.ActiveArtifactFiles;
		if (activeFiles.active === this.uid) {
			this.props.setActiveFile(undefined)
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
		let loadWithPicture = true, artifact, poster, artist, filename, file;
		if (this.props.File) {
			file = this.props.File;
			artifact = file.parent;
			poster = getIPFSImage(artifact);
			artist = artifact.getDetail('artist');
			filename = file.getFilename()
		}
		return (
			<div className={`row no-gutters file-playlist-item ${this.isActive() ? "isActive" : null}`} onClick={this.setActiveFile}>
				{/*img*/}
				<div className={loadWithPicture ? "col-2 d-flex align-items-center playlist-artifact-image" : "d-none"} >
					<img className="img-responsive" style={{maxHeight: '38px'}} src={poster} alt='poster' />
				</div>
				{/*index/playing*/}
				<div className="col-1 d-flex justify-content-start align-items-center">
					<span style={{fontWeight: "100", color: "#999"}}> {this.props.index} </span>
				</div>
				{/*contentItems*/}
				<div className={(loadWithPicture ? "col-6" : "col-7") + " d-flex align-items-center"}>
					<div style={styles.fileInfo}>
						<a style={{color: "#999"}}>{artist}</a>
						<span style={{fontWeight: "100", color: "#999"}}> - </span>
						<a>{filename}</a>
					</div>
				</div>
				{/*payment buttons*/}
				<div className="col-3 d-flex align-items-center">
					<div className="row no-gutters">
						<div className="col d-flex">
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
		wordBreak: 'normal'
	},
	paymentButton: {
		fontSize: "12px",
		border: "none",
	}
};

PlaylistItem.propTypes = {
	File: PropTypes.object,
	index: PropTypes.number
};

function mapStateToProps(state) {
	return {
		state: state,
		ActiveArtifactFiles: state.ActiveArtifactFiles
	}
}

const mapDispatchToProps = {
	setActiveFile
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistItem);