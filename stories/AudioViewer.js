import React from 'react';
import {createStore} from 'oip-state'
import { Provider } from 'react-redux'

import { storiesOf } from '@storybook/react';
import { withKnobs, select} from '@storybook/addon-knobs';
import { setActiveArtifact } from 'oip-state/src/actions/ActiveArtifact/thunks'
import { setActiveFile } from 'oip-state/src/actions/ActiveArtifactFiles/thunks'

import AudioViewer from '../src/components/AudioViewer/AudioViewer'
import FilePlaylist from '../src/components/FilePlaylist/FilePlaylist'

import { apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb, sintel, eightbit} from './TestArtifacts'
import { getArtifactOptions, getFileOptions } from './util'


const stories = storiesOf('AudioViewer', module);
stories.addDecorator(withKnobs);

const store = createStore();

const artifacts = getArtifactOptions([apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb, sintel, eightbit]);

const widthLabel = "Parent Div Width";
const widthOptions = {
	"100": "100px",
	"200": "200px",
	"300": "300px",
	"400": "400px",
	"500": "500px",
	"600": "600px",
	"700": "700px",
	"800": "800px",
	"900": "900px",
	"1000": "1000px",
	"1100": "1100px",
	"60%": "60%",
	"100%": "100%"
};
const widthDefault = '800px';

const heightLabel = "Parent Div Height";
const heightOptions = {
	"100": "100px",
	"200": "200px",
	"300": "300px",
	"400": "400px",
	"500": "500px",
	"600": "600px",
	"700": "700px",
	"800": "800px",
	"900": "900px",
	"1000": "1000px",
	"1100": "1100px",
	"100%": "100%"
};
const heightDefault = '400px';

stories.add('Via Redux', () => {
	const artifact_value = select(artifacts.title, artifacts.options, "Cor Metallicum");
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];

	const width_value = select(widthLabel, widthOptions, widthDefault);
	const height_value = select(heightLabel, heightOptions, heightDefault);

	store.dispatch(setActiveArtifact(artifact));
	store.dispatch(setActiveFile(artifact_file));

	return (
		<Provider store={store}>
			<div style={{width: width_value, height: height_value}}>
				<AudioViewer />
			</div>
		</Provider>
	)
}, {notes: 'This story uses Redux to supply the Artifact instead of getting passed one manually'});

stories.add('Via Prop', () => {
	const artifact_value = select(artifacts.title, artifacts.options, "Cor Metallicum");
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];

	const width_value = select(widthLabel, widthOptions, widthDefault);
	const height_value = select(heightLabel, heightOptions, heightDefault);

	store.dispatch(setActiveArtifact(artifact));

	return (
		<Provider store={store}>
			<div style={{width: width_value, height: height_value}}>
				<AudioViewer ArtifactFile={artifact_file} />
			</div>
		</Provider>
	)
}, {notes: 'Use knobs to switch between live artifacts & parent div widths!'});

stories.add('With Playlist', () => {
	const artifact_value = select(artifacts.title, artifacts.options, "Cor Metallicum");
	const artifact = artifacts.map[artifact_value];

	const width_value = select(widthLabel, widthOptions, widthDefault);
	const height_value = select(heightLabel, heightOptions, heightDefault);

	store.dispatch(setActiveArtifact(artifact));

	return (
		<Provider store={store}>
			<div style={{width: width_value, height: height_value}}>
				<AudioViewer />
				<div>
					<FilePlaylist Files={artifact}/>
				</div>
			</div>
		</Provider>
	)
}, {notes: 'Use knobs to switch between live artifacts & parent div widths!'});