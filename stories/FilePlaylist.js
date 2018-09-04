import React from 'react';
import { storiesOf } from '@storybook/react';
import {withKnobs, select} from '@storybook/addon-knobs';
import { host } from 'storybook-host';
import { Provider } from 'react-redux'
import { createStore } from 'oip-state'

import { setActiveArtifact } from 'oip-state/src/actions/ActiveArtifact/thunks'

import 'bootstrap/dist/css/bootstrap.min.css'

import FilePlaylist from '../src/components/FilePlaylist/FilePlaylist'
import { apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb, sintel, eightbit} from './TestArtifacts'
import { getArtifactOptions, getFileOptions } from './util'

const stories = storiesOf('FilePlaylist', module);
stories.addDecorator(withKnobs);
stories.addDecorator(
	host({
		title: 'FilePlaylist',
		align: 'center top',
		cropMarks: false
	}),
);

const store = createStore()

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
	"100%": "100%"
};
const widthDefault = '500px';

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

const artifacts = getArtifactOptions([apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb, sintel, eightbit]);

stories.add('Basic FilePlaylist', () => {
	const artifact_value = select(artifacts.title, artifacts.options, "Cor Metallicum");
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];

	const width_value = select(widthLabel, widthOptions, widthDefault);
	const height_value = select(heightLabel, heightOptions, heightDefault);

	store.dispatch(setActiveArtifact(artifact))
	return (
		<Provider store={store}>
			<div style={{width: width_value, height: height_value}}>
				<FilePlaylist Files={[artifact]} />
			</div>
		</Provider>

	)
}, {notes: 'Basic FilePlaylist. Use knobs to switch between Artifacts/Files'});