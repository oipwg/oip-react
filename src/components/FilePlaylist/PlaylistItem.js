import React from 'react';
import PaymentButton from '../PaymentButton'

import { getIPFSImage} from '../../utils'
import './assets/FilePlaylist.css'


class PlaylistItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false
		}
	}
	render() {
		let loadWithPicture = false, artifact, poster, artist, filename, file;
		if (this.props.File) {
			file = this.props.File;
			artifact = file.parent;
			poster = getIPFSImage(artifact);
			artist = artifact.getDetail('artist');
			filename = file.getFilename()
		}
		return (
			<div className="row no-gutters file-playlist-item" onClick={() => {console.log("Item click")}}>
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
							/>
							<PaymentButton
								ArtifactFile={file}
								type="buy"
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
};

export default PlaylistItem;