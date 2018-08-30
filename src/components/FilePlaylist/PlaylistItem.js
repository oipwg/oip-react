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
		let loadWithPicture = true;
		return (
			<div className="row no-gutters file-playlist-item">
				<div className={loadWithPicture ? "col-1 d-flex align-items-center" : null}>
					<img style={{maxHeight: '44px', width: 'auto'}} src={getIPFSImage(this.props.File.parent)} alt='poster' />
				</div>
				<div className="col-1 d-flex justify-content-center align-items-center">
					<span style={{fontWeight: "100", color: "#999"}}> {this.props.index} </span>
				</div>
				<div className="col-7 d-flex align-items-center">
					<div style={styles.fileInfo}>
						<a style={{color: "#999"}}>{this.props.File.parent.getDetail('artist')}</a>
						<span style={{fontWeight: "100", color: "#999"}}> - </span>
						<a>{this.props.File.getFilename()}</a>
					</div>
				</div>
				<div className="col-3">
					{/*<div className="row no-gutters">*/}
						{/*/!*row for options button on top right corner*!/*/}
					{/*</div>*/}
					<div className="row no-gutters">
						{/*this row should ideally be for favoriting, sharing, AND playing/buying/pausing...*/}
						<div className="col d-flex">
							<PaymentButton
								ArtifactFile={this.props.File}
								type="view"
							/>
							<PaymentButton
								ArtifactFile={this.props.File}
								type="buy"
							/>
						</div>
					</div>
					{/*<div className="row no-gutters">*/}
						{/*/!*row to act as a space holder*!/*/}
					{/*</div>*/}
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
	}
};

export default PlaylistItem;