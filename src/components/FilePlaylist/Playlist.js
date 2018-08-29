import React, { Component } from 'react';
import { getFileExtension } from '../../utils.js'


class Playlist extends Component {
	render() {
		let files = [], artist;
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
		if (this.props.Artifact) {
			artist = this.props.Artifact.getDetail("artist")
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
							<div className="row no-gutters" style={{height: "50px"}}>
								<div className="col-1 d-flex align-items-center"><span style={{color: "#999"}}> {i} </span></div>
								<div className="col-11">
									<div className="row no-gutters pt-1">
										<div className="col d-flex justify-content-start ">
											<span className="mr-2" style={{color: "#999"}}>{artist ? artist : "unknown creator"}</span>
											<span className="ml-2" style={styles.filename}>{file.getFilename()}</span>
										</div>
									</div>
									<div className="row no-gutters mt-2">
										<div className="col d-flex justify-content-start align-items-center">
											Holder
										</div>
									</div>

								</div>
							</div>
						</li>
					)
				})}
			</ul>
		);
	}
}

export default Playlist;

const styles ={
	filename: {
		textOverflow: "ellipsis",
		overflow: "hidden",
		whiteSpace: "nowrap",
		color: "black"
	}
};