import React from 'react';
import PropTypes from 'prop-types';
import { Artifact as A, ArtifactFile as AF } from 'oip-index';
import { fileToUID } from 'oip-state/src/actions/ActiveArtifactFiles/thunks'
import { getFileExtension } from "../../utils";

import PlaylistItem from './PlaylistItem'
import './assets/styles/FilePlaylist.css'

class FilePlaylist extends React.Component {
	constructor(props) {
		super(props);

		this.supportedFileTypes = ['mp3', 'mp4'];

		if (props.supportedFileTypes) {
			for (let type of props.supportedFileTypes) {
				this.supportedFileTypes.push(type)
			}
		}

		this.state = {
			playlistContent: {
				Files: [],
				Artifact: undefined,
				defaultFile: undefined,
				title: undefined,
				author: undefined,
				playlistType: undefined
			}
		};

		this.filterFiles = this.filterFiles.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let pc = prevState.playlistContent;

		if (nextProps.Artifact !== prevState.Artifact || nextProps.Files !== prevState.Files) {
			if (nextProps.Artifact) {
				pc.Artifact = nextProps.Artifact;
				pc.Files = nextProps.Artifact.getFiles();
				pc.defaultFile = pc.Files[0];
				pc.title = nextProps.Artifact.getTitle();
				pc.author = nextProps.Artifact.getDetail("artist");
				pc.playlistType = "Artifact";
			} else if (nextProps.Files) {
				let playlistFiles = [];
				//if Files was passed in as an array, break down and organize the array
				if (Array.isArray(nextProps.Files)) {
					let files = nextProps.Files;
					for (let f of files) {
						//if the object in the array was an Artifact, get it's files and push them to playlistFiles
						//@ToDo: would like to push the artifact itself and display a playlist item as an artifact
						if (f instanceof A) {
							let artifactFiles = f.getFiles();
							for (let f of artifactFiles) {
								playlistFiles.push(f)
							}
						}
						//if the object in the array was an ArtifactFile, just push it to the playlistFiles
						if (f instanceof AF) {
							playlistFiles.push(f)
						}
					}
					//set the playlistFiles to Files
					pc.Files = playlistFiles;

					//set the type to custom so the playlist can function accordingly
					pc.playlistType = "Custom";

					//if someone passed down an Artifact object instead of an array of [mixed] files, do what we did above
				} else if (nextProps.Files instanceof A) {
					pc.Artifact = nextProps.Files;
					pc.Files = nextProps.Files.getFiles();
					pc.defaultFile = pc.Files[0];
					pc.title = nextProps.Files.getTitle();
					pc.author = nextProps.Files.getDetail("artist");
					pc.playlistType = "Artifact";
				}
				if (nextProps.defaultFile && nextProps.defaultFile instanceof AF) {
					pc.defaultFile = nextProps.defaultFile
				} else {pc.defaultFile = playlistFiles[0]}
			}
		}

		return {
			playlistContent: pc
		}

	}

	filterFiles(files) {
		let tmpFiles = [];
		if (Array.isArray(files)) {
			for (let file of files) {
				let ext = getFileExtension(file);
				if (this.supportedFileTypes.includes(ext)){
					tmpFiles.push(file)
				}
			}
		} else if (typeof files === 'object' && files !== null) {
			let ext = getFileExtension(files);
			if (this.supportedFileTypes.includes(ext)) {
				tmpFiles.push(files)
			}
		}
		return tmpFiles
	}

	render() {
		let pc = this.state.playlistContent;
		let files = pc.Files;
		files = this.filterFiles(files);

		return (
			<div className={`file-playlist-container border ${this.props.className}`} style={{height: "100%", width: "auto", overflowY: "scroll", fontSize: "13px", ...this.props.style}}>
				<ul className="file-playlist p-0 m-0">
					{/*<li style={{listStyle: "none", borderBottom: "1px solid #f2f2f2"}}>*/}
						{/*<PlaylistHeader/>*/}
					{/*</li>*/}
					{this.props.Files ? files.map( (file, i) => {
						return (
							<li key={fileToUID(file)} className="p-0 m-0 border-bottom" style={{listStyle: "none", borderBottom: "1px solid #f2f2f2"}}>
								<PlaylistItem
									File={file}
									index={i+1}
								/>
							</li>
						)
					}) : null}
				</ul>
			</div>
		)
	}
}

FilePlaylist.propTypes = {
	//if an Artifact is passed down, the next two props must not be passed
	Artifact: PropTypes.object,
	//can be an array of Artifacts, ArtifactFiles, or both
	Files: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object
	]),
	//if passing in an array of files, a default file must be passed down
	defaultFile: PropTypes.object,
	//custom title
	title: PropTypes.string,
	//custom author
	author: PropTypes.string,
	//custom className
	className: PropTypes.string,
	//custom styles
	style: PropTypes.object
};

export default FilePlaylist