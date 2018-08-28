import React, { Component } from 'react';
import { getFileExtension } from '../../utils.js'


class Playlist extends Component {
	render() {
		let files = [];
		if (this.props.Artifact) {
			let tmpFiles = this.props.Artifact.getFiles();
			let supportedFileTypes = ["mp4", "mp3", "ogg", "wav"];
			for (let f of tmpFiles) {
				let ext = getFileExtension(f);
				if (supportedFileTypes.includes(ext)) {
					files.push(f)
				}
			}
		}
		return (
			<ul className="list-group">
				<li className="list-group-item" style={{padding: "5px 30px", display:"flex", height: "100px"}}>
					<div style={{margin: "auto"}}>
						<button className="btn btn-sm btn-outline-info"><span className="icon icon-controller-play"></span>Play All: Free</button>
						<span style={{paddingLeft: "10px"}}/>
						<button className="btn btn-sm btn-outline-info"><span className="icon icon-download"></span> Buy All: Free</button>
					</div>
				</li>
				{files.map(function(file, i){
					return (
						<li key={i} className="list-group-item">
							<div style={{height: "50px"}}>{file.getFilename()}</div>
						</li>
					)
				})}
			</ul>
		);
	}
}

export default Playlist;
