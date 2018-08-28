import React from 'react';

import Playlist from './Playlist'
import './assets/FilePlaylist.css'

class FilePlaylist extends React.Component {
	render() {
		return (
			<div style={{height: "100%"}}>
				<style dangerouslySetInnerHTML={{
					__html: [
						'.scrollbar {',

						'}',
						'.scrollbar::-webkit-scrollbar {',
						'    width: ' + '10px' + ';',
						'}',
						'.scrollbar::-webkit-scrollbar-thumb {',
						'    background-color: ' + 'red' + ';',
						'}',
						'.scrollbar::-webkit-scrollbar-thumb:hover {',
						'    background-color: ' + '#555' + ';',
						'}',
						'.scrollbar::-webkit-scrollbar-track {',
						'    background-color: ' +"#f1f1f1" + ';',
						'}'
					].join('\n')
				}} />
				<div className="scrollbar" style={{height: "100%", width: "auto", overflowY: "scroll",}}>
					<Playlist Artifact={this.props.Artifact} ArtifactFile={this.props.ArtifactFile}/>
				</div>
			</div>
		)
	}
}

export default FilePlaylist