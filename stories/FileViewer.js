import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select} from '@storybook/addon-knobs';

import FileViewer from '../src/components/FileViewer';
import {amsterdam, apocalypse, barbershop, barbershop_paid, CorMetallicum, scout} from './TestArtifacts'
import { getArtifactOptions, getFileOptions } from './util';

const stories = storiesOf("FileViewer", module);
stories.addDecorator(withKnobs);

const artifacts = getArtifactOptions([apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum]);

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
};
const widthDefault = '500px';

stories.add("Switch between file types", () => {
	const artifact_value = select(artifacts.title, artifacts.options, artifacts.default_artifact);
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];

	const width_value = select(widthLabel, widthOptions, widthDefault)

	return (
		<div style={{width: width_value}}>
			<FileViewer Artifact={artifact} ArtifactFile={artifact_file} />
		</div>
	)
}, {notes: 'The FileViewer is a component that takes in an Artifact and an ArtifactFile and renders the appropriate Viewer with the artifact and file passed ' +
		'down as props.'});