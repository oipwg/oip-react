import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { Artifact, ArtifactFile } from 'oip-index';
import { fileToUID } from 'oip-state'

import { getFileExtension } from "../../utils";

import PlaylistItem from './PlaylistItem'
import './assets/styles/FilePlaylist.css'

class FilePlaylist extends React.Component {
	constructor(props) {
		super(props);

		this.supportedFileTypes = ['mp3', 'mp4', 'aac'];

		if (props.supportedFileTypes) {
			for (let type of props.supportedFileTypes) {
				this.supportedFileTypes.push(type)
			}
		}

		this.state = {
			playlistContent: {
				Files: [],
				Artifact: undefined,
				title: undefined,
				author: undefined,
				playlistType: undefined
			}
		};

		this.filterFiles = this.filterFiles.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let playlist_content = prevState.playlistContent;

		// Check if the Artifact, files, or ReduxActiveFiles have changed
		if (nextProps.Files !== prevState.Files || nextProps.ReduxActiveFiles !== prevState.ReduxActiveFiles) {
			// Prefer to build off of the Files prop (an single item/array of ArtifactFiles/Artifacts)
			if (nextProps.Files) {
				let playlistFiles = [];

				// If Files was passed in as an array, break down and organize the array
				if (Array.isArray(nextProps.Files)) {
					let files = nextProps.Files;

					for (let file of files) {
						//if the object in the array was an Artifact, get it's files and push them to playlistFiles
						//@ToDo: would like to push the artifact itself and display a playlist item as an artifact
						if (file instanceof Artifact) {
							let artifactFiles = file.getFiles();
							for (let afile of artifactFiles) {
								playlistFiles.push(afile)
							}
						}
						//if the object in the array was an ArtifactFile, just push it to the playlistFiles
						if (file instanceof ArtifactFile) {
							playlistFiles.push(file)
						}
					}

					// Set the playlistFiles to Files
					playlist_content.Files = playlistFiles;

					// Set the type to custom so the playlist can function accordingly
					playlist_content.playlistType = "Custom";

				// If someone passed down an Artifact object instead of an array of [mixed] files, do what we did above
				} else if (nextProps.Files instanceof Artifact) {
					playlist_content.Artifact = nextProps.Files;
					playlist_content.Files = nextProps.Files.getFiles();
					playlist_content.title = nextProps.Files.getTitle();
					playlist_content.author = nextProps.Files.getDetail("artist");
					playlist_content.playlistType = "Artifact";
				}

			// If there are no Files, use the ReduxActiveFiles to build the state
			} else if (nextProps.ReduxActiveFiles){
				playlist_content.playlistType = "ReduxActiveFiles"

				let redux_files = []

				for (let uid in nextProps.ReduxActiveFiles){
					if (uid !== "active"){
						// Grab each ArtifactFile
						redux_files.push(nextProps.ReduxActiveFiles[uid].ArtifactFile)
					}
				}

				playlist_content.Files = redux_files
			}
		}

		return {
			playlistContent: playlist_content
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
		let playlist_content = this.state.playlistContent;

		let files = playlist_content.Files;
		files = this.filterFiles(files);
		if (this.props.ActiveArtifact === undefined) {
			files = []
		}
		return (
			<div className={`file-playlist-container border ${this.props.className}`} style={{height: "100%", width: "auto", overflowY: "scroll", fontSize: "13px", ...this.props.style}}>
				<ul className="file-playlist p-0 m-0">
					{/*<li style={{listStyle: "none", borderBottom: "1px solid #f2f2f2"}}>*/}
						{/*<PlaylistHeader/>*/}
					{/*</li>*/}
					{files.map( (file, i) => {
						return (
							<li key={fileToUID(file)} className="p-0 m-0 border-bottom" style={{listStyle: "none", borderBottom: "1px solid #f2f2f2"}}>
								<PlaylistItem
									File={file}
									index={i+1}
								/>
							</li>
						)
					})}
				</ul>
			</div>
		)
	}
}

FilePlaylist.propTypes = {
	//can be an array of Artifacts, ArtifactFiles, or both
	Files: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object
	]),
	/**
	*  A default file can be passed down if you want
	*/
	defaultFile: PropTypes.object,
	/**
	*  Custom title
	*/
	title: PropTypes.string,
	/**
	*  Custom author
	*/
	author: PropTypes.string,
	/**
	*  Custom className
	*/
	className: PropTypes.string,
	/**
	*  Custom style
	*/
	style: PropTypes.object
};

function mapStateToProp(state){
	return {
		ReduxActiveFiles: state.ActiveArtifactFiles,
		ActiveArtifact: state.ActiveArtifact.Artifact
	}
}

export default connect(mapStateToProp)(FilePlaylist)