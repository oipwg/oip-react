import React from 'react';

import Playlist from './Playlist'
import './assets/FilePlaylist.css'

class FilePlaylist extends React.Component {
	render() {
		return (
			<div>
				<style dangerouslySetInnerHTML={{
					__html: [
						'.scrollbar {',
						'    border: 1px solid ' + this.props.mainColor + ';',
						'	 border-radius: 0.25rem;',
						'}',
						'.scrollbar::-webkit-scrollbar {',
						'    background-color: ' + this.props.mainColor + ';',
						'}',
						'.scrollbar::-webkit-scrollbar-thumb {',
						'    background-color: ' + this.props.mainColor + ';',
						'}',
						'.scrollbar::-webkit-scrollbar-track {',
						'    background-color: ' + this.props.bgColor + ';',
						'}'
					].join('\n')
				}} />
				<div className="scrollbar" style={{height: "32vh", overflowY: "scroll", margin: "auto", marginTop: "10px", marginBottom: "100px", maxWidth: "450px"}}>
					<Playlist Artifact={this.props.Artifact} ArtifactFile={this.props.ArtifactFile}/>
				</div>
			</div>
		)
	}
}

export default FilePlaylist