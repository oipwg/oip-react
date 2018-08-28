import React from 'react';
import { storiesOf } from '@storybook/react';
import {withKnobs, select} from '@storybook/addon-knobs';

import 'bootstrap/dist/css/bootstrap.min.css'

import FilePlaylist from '../src/components/FilePlaylist/FilePlaylist'
import { apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb, sintel} from './TestArtifacts'
import { getArtifactOptions, getFileOptions } from './util'

const stories = storiesOf('FilePlaylist', module);
stories.addDecorator(withKnobs);

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
const heightDefault = '500px';

const artifacts = getArtifactOptions([apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb, sintel]);

stories.add('Basic FilePlaylist', () => {
	const artifact_value = select(artifacts.title, artifacts.options, artifacts.default_artifact);
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];

	const width_value = select(widthLabel, widthOptions, widthDefault);
	const height_value = select(heightLabel, heightOptions, heightDefault);

	return (
		<div style={{width: width_value, height: height_value}}>
			<FilePlaylist Artifact={artifact} ArtifactFile={artifact_file} />
		</div>
	)
}, {notes: 'Basic FilePlaylist. Use knobs to switch between Artifacts/Files'});