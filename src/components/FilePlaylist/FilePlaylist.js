import React from 'react';
import PropTypes from 'prop-types';
import { Artifact as A, ArtifactFile as AF } from 'oip-index';
import { fileToUID } from 'oip-state/src/actions/ActiveArtifactFiles/thunks'

import PlaylistItem from './PlaylistItem'
import './assets/FilePlaylist.css'

class FilePlaylist extends React.Component {
	constructor(props) {
		super(props);

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

	render() {
		let pc = this.state.playlistContent;
		return (
			<div className="file-playlist-container" style={{height: "100%", width: "auto", overflowY: "scroll", fontSize: "13px"}}>
				<ul className="file-playlist p-0 m-0">
					{/*<li style={{listStyle: "none", borderBottom: "1px solid #f2f2f2"}}>*/}
						{/*<PlaylistHeader/>*/}
					{/*</li>*/}
					{pc.Files.map( (file, i) => {
						return (
							<li key={fileToUID(file)} style={{listStyle: "none", borderBottom: "1px solid #f2f2f2"}}>
								<PlaylistItem
									File={file}
									index={i}
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
	//if an Artifact is passed down, the latter two props must not be passed
	Artifact: PropTypes.object,
	//can be an array of Artifacts, ArtifactFiles, or both
	Files: PropTypes.array,
	//if passing in an array of files, a default file must be passed down
	defaultFile: PropTypes.object,
	//custom title
	title: PropTypes.string,
	//custom author
	author: PropTypes.string
};

export default FilePlaylist
//<style dangerouslySetInnerHTML={{
// 					__html: [
// 						'.scrollbar {',
// 						'    border: 1px solid ' + '#f1f1f1' + ';',
// 						'	 border-radius: 0.25rem;',
// 						'}',
// 						'.scrollbar::-webkit-scrollbar {',
// 						'    width: ' + '10px' + ';',
// 						'}',
// 						'.scrollbar::-webkit-scrollbar-thumb {',
// 						'    background-color: ' + '#555' + ';',
// 						'	 border-radius: 0.25rem;',
// 						'}',
// 						'.scrollbar::-webkit-scrollbar-thumb:hover {',
// 						'    background-color: ' + '#5E5E5E' + ';',
// 						'}',
// 						'.scrollbar::-webkit-scrollbar-track {',
// 						'    background-color: ' + "#f1f1f1" + ';',
// 						'	 border-radius: 0.25rem;',
// 						'}',
// 						'.scrollbar::-webkit-resizer {',
// 						'   background-color:  ' + 'transparent' + ';',
// 						'}'
// 					].join('\n')
// 				}} />